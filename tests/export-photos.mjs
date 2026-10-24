import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = ts.transpileModule(readFileSync(new URL('../lib/exportPhotos.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
}).outputText;

for (const frame of ['No Frame', 'Polaroid', 'Film Strip']) {
  for (const vertical of [true, false]) {
    const fills = [];
    const holes = [];
    const draws = [];
    let downloaded = false;
    const context = {
      globalCompositeOperation: 'source-over',
      fillRect(...rect) { fills.push({ rect, color: this.fillStyle }); },
      fill() { holes.push(this.globalCompositeOperation); },
      drawImage() { draws.push(this.globalCompositeOperation); },
      save() {}, restore() {}, translate() {}, rotate() {},
      strokeRect() {}, beginPath() {}, roundRect() {},
    };
    const canvas = {
      getContext: () => context,
      toDataURL(type) { assert.equal(type, 'image/png'); return 'data:image/png;base64,test'; },
    };
    const anchor = { click() { downloaded = true; } };
    const exports = {};
    runInNewContext(source, {
      exports,
      Image: class {
        width = 400;
        height = 300;
        set src(value) { assert.ok(value); this.onload(); }
      },
      document: { createElement: tag => tag === 'canvas' ? canvas : anchor },
    });
    await exports.exportPhotos(['photo-1', 'photo-2'], frame, vertical);
    assert.ok(downloaded, `${frame} downloads`);
    assert.match(anchor.download, /\.png$/);
    assert.deepEqual(draws, ['source-over', 'source-over'], 'Photos remain intact');
    if (frame === 'No Frame') {
      assert.equal(fills.length, 0, 'Unframed padding and gaps remain transparent');
    } else if (frame === 'Polaroid') {
      assert.equal(fills.length, 2, 'Only the two white cards are filled');
      assert.ok(fills.every(({ rect, color }) => color === '#FFFFFF' && rect[0] < 0));
    } else {
      assert.equal(fills.length, 1, 'Keep the black film frame');
      assert.equal(fills[0].color, '#0f0f0f');
      assert.ok(holes.length > 0);
      assert.ok(holes.every(mode => mode === 'destination-out'), 'Sprocket holes are transparent cutouts');
    }
  }
}
console.log('Transparent PNG export checks passed for all frames and orientations.');
