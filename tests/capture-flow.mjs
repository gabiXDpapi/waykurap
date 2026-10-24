import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const requireModule = createRequire(import.meta.url);

function load(file, mocks, globals = {}) {
  const source = ts.transpileModule(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  runInNewContext(source, { exports, require: name => mocks[name] ?? requireModule(name), ...globals });
  return exports;
}

async function main() {
  const state = [];
  const effects = [];
  const { usePhotoCapture: runCaptureHook } = load('hooks/usePhotoCapture.ts', {
    react: {
      useState(initial) {
        const index = state.push(initial) - 1;
        return [initial, value => { state[index] = value; }];
      },
      useRef: current => ({ current }),
      useEffect: effect => effects.push(effect),
    },
  }, {
    setTimeout: callback => callback(),
    document: { createElement: () => ({
      getContext: () => ({ drawImage() {} }),
      toDataURL: () => 'data:image/png;base64,captured',
    }) },
  });
  const capture = runCaptureHook({ current: { videoWidth: 640, videoHeight: 480 } });
  // React Strict Mode runs setup, cleanup, then setup again in development.
  effects.forEach(effect => { effect()(); effect(); });
  await capture.handleTakePhoto(4);
  assert.equal(state[0].length, 4);
  assert.equal(state[1], null);
  assert.equal(state[2], false);

  let photos = [];
  let isCapturing = false;
  const { default: Page } = load('app/page.tsx', {
    '../hooks/useCamera': { useCamera: () => ({ videoRef: { current: null }, stream: {}, error: '' }) },
    '../hooks/usePhotoCapture': { usePhotoCapture: () => ({ ...capture, photos, isCapturing }) },
    '../constants/config': { PHOTO_COUNTS: [3, 4, 5, 6] },
  });
  const render = () => renderToStaticMarkup(React.createElement(Page));
  assert.match(render(), /STEP 01 \/ CAPTURE/);
  photos = state[0];
  isCapturing = true;
  assert.match(render(), /STEP 01 \/ CAPTURE/);
  isCapturing = false;
  assert.match(render(), /STEP 02 \/ MAKE IT YOURS/);
  assert.match(render(), /class="camera-card" hidden=""/);
  assert.match(render(), /<video/);
  capture.handleRetake();
  photos = state[0];
  assert.match(render(), /STEP 01 \/ CAPTURE/);
  assert.doesNotMatch(render(), /class="camera-card" hidden/);
  console.log('Capture, review, retake, and Strict Mode countdown checks passed.');
}

main().catch(error => { console.error(error); process.exitCode = 1; });
