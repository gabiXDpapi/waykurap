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
  const captured = await capture.handleTakePhoto(4);
  assert.equal(captured.length, 4);
  assert.equal(state[0].length, 4);
  assert.equal(state[1], null);
  assert.equal(state[2], false);

  const session = {
    photos: [], photoCount: 4, selectedFrame: 'Film Strip', isVertical: true,
    setPhotos(photos) { session.photos = photos; },
    setPhotoCount() {}, setSelectedFrame() {}, setIsVertical() {},
  };
  const navigation = [];
  const router = {
    push: path => navigation.push(['push', path]),
    replace: path => navigation.push(['replace', path]),
  };
  const redirect = path => { throw new Error(`redirect:${path}`); };
  let result = captured;
  const mocks = {
    react: { ...React, useEffect: effect => effect() },
    'next/navigation': { useRouter: () => router, redirect },
    '@/components/PhotoSession': { usePhotoSession: () => session },
    '@/hooks/useCamera': { useCamera: () => ({ videoRef: { current: null }, stream: {}, error: '' }) },
    '@/hooks/usePhotoCapture': { usePhotoCapture: () => ({ ...capture, handleTakePhoto: async () => result }) },
    '@/constants/config': { PHOTO_COUNTS: [3, 4, 5, 6] },
    '@/lib/exportPhotos': { exportPhotos() {} },
  };
  const { default: CapturePage } = load('app/(booth)/step-1/page.tsx', mocks);
  const { default: ReviewPage } = load('app/(booth)/step-2/page.tsx', mocks);
  const { default: HomePage } = load('app/page.tsx', {
    ...mocks,
    '@/components/EyeLogo': { EyeLogo: () => null },
    './page.module.css': { default: {} },
  });
  const render = Page => renderToStaticMarkup(React.createElement(Page));
  const { default: BoothLayout } = load('app/(booth)/layout.tsx', {
    '@/components/EyeLogo': { EyeLogo: () => null },
    '@/components/PhotoSession': { PhotoSessionProvider: ({ children }) => children },
  });
  for (const header of [render(HomePage), render(BoothLayout)]) {
    assert.match(header, /<a[^>]*aria-label="Way Kurap home"[^>]*href="\/"[^>]*><h1>Way Kurap<\/h1><\/a>/);
  }
  function find(node, predicate) {
    if (!node || typeof node !== 'object') return;
    if (predicate(node)) return node;
    return React.Children.toArray(node.props?.children).map(child => find(child, predicate)).find(Boolean);
  }
  const home = render(HomePage);
  assert.match(home, /Strike a pose/);
  assert.equal((home.match(/POSE ✶ PICK ✶ DOWNLOAD ✶ REPEAT ✶/g) || []).length, 6);
  assert.match(home, /Focus or hover to pause the animation/);
  assert.equal((home.match(/href="\/step-1"/g) || []).length, 4);
  assert.match(home, /aria-label="Open the photo booth"/);
  assert.match(home, /class="camera-card /);
  for (const section of ['how-it-works', 'frames']) {
    assert.match(home, new RegExp(`id="${section}"`));
    assert.match(home, new RegExp(`href="#${section}"`));
  }
  assert.doesNotMatch(home, /<video/);
  assert.equal(ReviewPage(), null);
  assert.deepEqual(navigation.pop(), ['replace', '/step-1']);
  assert.match(render(CapturePage), /STEP 01 \/ CAPTURE/);
  const shutter = find(CapturePage(), node => node.props?.['aria-label'] === 'Take Photo');
  for (result of [undefined, captured.slice(0, 3)]) {
    await shutter.props.onClick();
    assert.equal(navigation.length, 0, 'Cancelled or incomplete captures must not navigate');
  }
  result = captured;
  await shutter.props.onClick();
  assert.deepEqual(navigation.pop(), ['push', '/step-2']);
  assert.equal(session.photos, captured);
  assert.match(render(ReviewPage), /STEP 02 \/ MAKE IT YOURS/);
  assert.doesNotMatch(render(ReviewPage), /<video/);
  assert.equal((render(ReviewPage).match(/<img /g) || []).length, 4);
  // Returning to capture does not erase the session needed by browser Forward.
  render(CapturePage);
  assert.equal(session.photos, captured);
  const retake = find(ReviewPage(), node => node.props?.className === 'secondary-button');
  retake.props.onClick();
  assert.deepEqual(navigation.pop(), ['replace', '/step-1']);
  assert.equal(session.photos.length, 0);
  assert.equal(ReviewPage(), null);
  assert.deepEqual(navigation.pop(), ['replace', '/step-1']);

  effects.forEach(effect => effect()());
  assert.equal(await capture.handleTakePhoto(4), undefined, 'Unmounted captures must not navigate');

  // A camera permission request can resolve after navigating away.
  let resolveCamera;
  let stopped = 0;
  let cleanup;
  const { useCamera: runCameraHook } = load('hooks/useCamera.ts', {
    react: {
      useState: initial => [initial, () => {}],
      useRef: current => ({ current }),
      useEffect: effect => { cleanup = effect(); },
    },
  }, {
    navigator: { mediaDevices: { getUserMedia: () => new Promise(resolve => { resolveCamera = resolve; }) } },
  });
  runCameraHook();
  cleanup();
  resolveCamera({ getTracks: () => [{ stop() { stopped++; } }] });
  await new Promise(setImmediate);
  assert.equal(stopped, 1);
  console.log('Capture, routing, empty-session redirects, retake, cancellation, and camera cleanup checks passed.');
}

main().catch(error => { console.error(error); process.exitCode = 1; });
