import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = ts.transpileModule(readFileSync(new URL('../lib/exportPhotos.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
}).outputText;

for (const frame of ['No Frame', 'Polaroid', 'Film Strip']) {
  for (const vertical of [true, false]) {
   for (const [width, height] of [[400, 300], [300, 400], [1920, 1080]]) {
    for (const count of [1, 3, 4, 5]) {
    const fills = [];
    const holes = [];
    const draws = [];
    const marks = [];
    const logoOpacities = [];
    const texts = [];
    const cutouts = [];
    const scale = width / 400;
    let downloaded = false;
    const context = {
      globalCompositeOperation: 'source-over',
      fillRect(...rect) { fills.push({ rect, color: this.fillStyle }); },
      fill() { holes.push(this.globalCompositeOperation); },
      drawImage(img, ...rect) {
        if (img.source === '/eye-logo.svg') { marks.push(rect); logoOpacities.push(this.globalAlpha); }
        else draws.push({ rect, mode: this.globalCompositeOperation });
      },
      measureText() { return { width: 65 * scale }; },
      fillText(text, x, y) { texts.push({ text, x, y, color: this.fillStyle, opacity: this.globalAlpha }); },
      strokeText() {},
      save() {}, restore() {}, translate() {}, rotate() {},
      strokeRect() {}, beginPath() {}, roundRect(...rect) { cutouts.push(rect); },
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
        width = width;
        height = height;
        set src(value) { this.source = value; assert.ok(value); this.onload(); }
      },
      document: { createElement: tag => tag === 'canvas' ? canvas : anchor },
    });
    await exports.exportPhotos(Array.from({ length: count }, (_, i) => `photo-${i}`), frame, vertical);
    assert.ok(downloaded, `${frame} downloads`);
    assert.match(anchor.download, /\.png$/);
    assert.equal(draws.length, count);
    assert.ok(draws.every(draw => draw.mode === 'source-over'), 'Photos remain intact');
    assert.equal(marks.length, 1, 'One eye logo per strip');
    assert.equal(texts.length, 1, 'One wordmark per strip');
    assert.equal(texts[0].text, 'Waykurap');
    assert.equal(texts[0].opacity, 0.65, 'Wordmark stays subtle');
    assert.deepEqual(logoOpacities, [0.65], 'Eye logo matches the wordmark opacity');
    const [x, y, w, h] = marks[0];
    const [px, py, pw, ph] = draws.at(-1).rect;
    const right = texts[0].x;
    assert.ok(x >= px && right <= px + pw, 'Watermark stays within the last photo width');
    assert.ok(x + w < right && h > 0, 'Eye sits to the left of the text');
    if (frame === 'No Frame') {
      assert.equal(fills.length, 0, 'Unframed padding and gaps remain transparent');
      assert.ok(y > py && y + h < py + ph, 'Watermark is embedded inside the last photo');
      assert.equal(canvas.width, vertical ? width : width * count + 16 * scale * (count - 1));
      assert.equal(canvas.height, vertical ? height * count + 16 * scale * (count - 1) : height);
    } else if (frame === 'Polaroid') {
      assert.equal(fills.length, count, 'Only the white cards are filled');
      assert.ok(fills.every(({ rect, color }) => color === '#FFFFFF' && rect[0] < 0));
      const [, cardY, , cardH] = fills.at(-1).rect;
      assert.ok(y > py + ph && y + h < cardY + cardH, 'Watermark fits below the photo within the rotated card');
      assert.equal(texts[0].color, '#1F1A1B');
    } else {
      assert.equal(fills.length, 1, 'Keep the black film frame');
      assert.equal(fills[0].color, '#0f0f0f');
      assert.ok(holes.length > 0);
      assert.ok(holes.every(mode => mode === 'destination-out'), 'Sprocket holes are transparent cutouts');
      assert.ok(y > py + ph && y + h < canvas.height, 'Watermark is in the bottom film border');
      assert.ok(cutouts.every(([hx, hy, hw, hh]) => right <= hx || x >= hx + hw || y + h <= hy || y >= hy + hh), 'Watermark does not overlap sprocket holes');
    }
    }
   }
  }
}

for (const failure of ['image', 'canvas']) {
  const exports = {};
  let downloaded = false;
  runInNewContext(source, {
    exports,
    Image: class {
      width = 400; height = 300;
      set src(value) { if (failure === 'image' && value === '/eye-logo.svg') this.onerror(); else this.onload(); }
    },
    document: { createElement: () => ({ getContext: () => null, click() { downloaded = true; } }) },
  });
  await assert.rejects(exports.exportPhotos(['photo']), /Please try again/);
  assert.equal(downloaded, false, 'Never download an incomplete or unwatermarked export');
  assert.equal(await exports.renderPhotos([]), undefined);
}
console.log('Watermark placement and transparent PNG checks passed for all frames, orientations, counts, and photo aspect ratios.');
