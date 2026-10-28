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
      getContext: () => ({ translate() {}, scale() {}, drawImage() {} }),
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
    endSession() { session.photos = []; },
    setPhotoCount() {}, setSelectedFrame() {}, setIsVertical() {},
  };
  const navigation = [];
  const router = {
    push: path => navigation.push(['push', path]),
    replace: path => navigation.push(['replace', path]),
  };
  const redirect = path => { throw new Error(`redirect:${path}`); };
  let result = captured;
  const { CreatorCredit } = load('components/CreatorCredit.tsx', {
    './CreatorCredit.module.css': { default: {} },
  });
  const { PhotoPreview } = load('components/PhotoPreview.tsx', {
    react: { ...React, useEffect() {} },
    '@/lib/exportPhotos': { renderPhotos() {} },
  });
  const reviewUpdates = [];
  let exportFails = false;
  const mocks = {
    '@/components/PhotoPreview': { PhotoPreview },
    '@/components/CreatorCredit': { CreatorCredit },
    react: { ...React, useEffect: effect => effect(), useState: initial => [initial, value => reviewUpdates.push(value)] },
    'next/navigation': { useRouter: () => router, redirect },
    '@/components/PhotoSession': { usePhotoSession: () => session },
    '@/hooks/useCamera': { useCamera: () => ({ videoRef: { current: null }, stream: {}, error: '', requested: false, enableCamera() {} }) },
    '@/hooks/usePhotoCapture': { usePhotoCapture: () => ({ ...capture, handleTakePhoto: async () => result }) },
    '@/constants/config': { PHOTO_COUNTS: [3, 4, 5, 6] },
    '@/lib/exportPhotos': { async exportPhotos() { if (exportFails) throw new Error('image failed'); } },
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
    '@/components/CreatorCredit': { CreatorCredit },
    '@/components/EndSession': { EndSession: () => null },
    '@/components/EyeLogo': { EyeLogo: () => null },
    '@/components/PhotoSession': { PhotoSessionProvider: ({ children }) => children },
  });
  for (const header of [render(HomePage), render(BoothLayout)]) {
    assert.match(header, /Created by <strong>Gabriel Mosquera<\/strong>/);
    assert.match(header, /href="mailto:mosqueragabriel99@gmail.com"/);
    assert.match(header, /href="https:\/\/github.com\/gabiXDpapi" target="_blank" rel="noopener noreferrer"/);
    assert.match(header, /href="https:\/\/www.linkedin.com\/in\/gabriel-mosquera-0730112a1\/" target="_blank" rel="noopener noreferrer"/);
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
  assert.ok(find(CapturePage(), node => node.type === 'video').props.className.split(' ').includes('-scale-x-100'));
  assert.match(render(CapturePage), /Enable camera/);
  assert.match(render(CapturePage), /not uploaded by this app/);
  const shutter = find(CapturePage(), node => node.props?.['aria-label'] === 'Take Photo');
  for (result of [undefined, captured.slice(0, 3)]) {
    await shutter.props.onClick();
    assert.equal(navigation.length, 0, 'Cancelled or incomplete captures must not navigate');
  }
  result = captured;
  await shutter.props.onClick();
  assert.deepEqual(navigation.pop(), ['push', '/step-2']);
  assert.equal(session.photos, captured);
  const { EndSession } = load('components/EndSession.tsx', mocks);
  const endSession = EndSession();
  assert.equal(endSession.type, 'button');
  assert.equal(endSession.props.type, 'button');
  endSession.props.onClick();
  assert.equal(session.photos.length, 0, 'Ending a session must clear photos');
  assert.deepEqual(navigation.pop(), ['replace', '/step-1']);
  endSession.props.onClick();
  assert.deepEqual(navigation.pop(), ['replace', '/step-1'], 'Ending on capture stays on capture');
  session.photos = captured;
  assert.match(render(ReviewPage), /STEP 02 \/ MAKE IT YOURS/);
  assert.doesNotMatch(render(ReviewPage), /<video/);
  assert.match(render(ReviewPage), /Preparing your photos/);
  const preview = find(ReviewPage(), node => node.type === PhotoPreview);
  assert.equal(preview.props.photos, captured);
  assert.equal(preview.props.selectedFrame, session.selectedFrame);
  assert.equal(preview.props.isVertical, session.isVertical);
  const exportButton = find(ReviewPage(), node => node.props?.className === 'primary-button export');
  reviewUpdates.length = 0;
  await exportButton.props.onClick();
  assert.deepEqual(reviewUpdates, ['', true, false], 'Export clears errors and resets the busy state');
  reviewUpdates.length = 0;
  exportFails = true;
  await exportButton.props.onClick();
  assert.deepEqual(reviewUpdates, ['', true, 'Could not export your photos. Please try again.', false], 'Failed export offers a retry and resets the busy state');

  let previewResult = null;
  let previewEffect;
  let finishPreview;
  let failPreview;
  const { PhotoPreview: AsyncPreview } = load('components/PhotoPreview.tsx', {
    react: {
      ...React,
      useState: () => [previewResult, value => { previewResult = value; }],
      useEffect: effect => { previewEffect = effect; },
    },
    '@/lib/exportPhotos': { renderPhotos: (...args) => {
      assert.deepEqual(args, [captured, session.selectedFrame, session.isVertical]);
      return new Promise((resolve, reject) => { finishPreview = resolve; failPreview = reject; });
    } },
  });
  assert.equal(AsyncPreview(preview.props).props.role, 'status');
  let cancelPreview = previewEffect();
  finishPreview('data:image/png;base64,watermarked');
  await new Promise(setImmediate);
  const renderedPreview = AsyncPreview(preview.props);
  assert.equal(renderedPreview.props.src, 'data:image/png;base64,watermarked', 'Preview uses the shared export renderer');
  assert.match(renderedPreview.props.alt, /Waykurap eye logo watermark/);
  cancelPreview();
  cancelPreview = previewEffect();
  cancelPreview();
  finishPreview('stale-frame');
  await new Promise(setImmediate);
  assert.equal(previewResult.src, 'data:image/png;base64,watermarked', 'A stale render cannot replace the current preview');
  previewEffect();
  failPreview(new Error('image failed'));
  await new Promise(setImmediate);
  assert.equal(AsyncPreview(preview.props).props.role, 'alert');
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
  let requested = false;
  let cameraRequests = 0;
  const { useCamera: runCameraHook } = load('hooks/useCamera.ts', {
    react: {
      useState: initial => typeof initial === 'boolean' ? [requested, value => { requested = value; }] : [initial, () => {}],
      useRef: current => ({ current }),
      useEffect: effect => { cleanup = effect(); },
    },
  }, {
    navigator: { mediaDevices: { getUserMedia: constraints => {
      cameraRequests++;
      assert.equal(constraints.video, true);
      assert.equal(constraints.audio, false);
      return new Promise(resolve => { resolveCamera = resolve; });
    } } },
  });
  const camera = runCameraHook();
  assert.equal(cameraRequests, 0, 'Opening the booth must not request the camera');
  camera.enableCamera();
  runCameraHook();
  assert.equal(cameraRequests, 1);
  cleanup();
  resolveCamera({ getTracks: () => [{ stop() { stopped++; } }] });
  await new Promise(setImmediate);
  assert.equal(stopped, 1);
  runCameraHook();
  resolveCamera({ getTracks: () => [{ stop() { stopped++; } }] });
  await new Promise(setImmediate);
  cleanup();
  assert.equal(stopped, 2, 'Leaving an active camera must stop its tracks');

  const providerState = [];
  let stateIndex = 0;
  const { PhotoSessionProvider } = load('components/PhotoSession.tsx', {
    react: {
      ...React,
      useState(initial) {
        const index = stateIndex++;
        if (!(index in providerState)) providerState[index] = initial;
        return [providerState[index], value => {
          providerState[index] = typeof value === 'function' ? value(providerState[index]) : value;
        }];
      },
    },
    '@/constants/config': { PHOTO_COUNTS: [3, 4, 5] },
  });
  const renderProvider = () => {
    stateIndex = 0;
    return PhotoSessionProvider({ children: null });
  };
  let provider = renderProvider();
  provider.props.value.setPhotos(captured);
  provider = renderProvider();
  assert.equal(provider.props.value.photos.length, 4);
  const previousKey = provider.key;
  provider.props.value.endSession();
  provider = renderProvider();
  assert.equal(provider.props.value.photos.length, 0);
  assert.notEqual(provider.key, previousKey, 'Ending must remount the booth to clean up camera and countdown hooks');
  requested = false;
  const requestsBeforeReset = cameraRequests;
  const freshCamera = runCameraHook();
  assert.equal(freshCamera.requested, false);
  assert.equal(freshCamera.stream, null);
  assert.equal(freshCamera.error, '');
  assert.equal(cameraRequests, requestsBeforeReset, 'A fresh session must wait for Enable camera');
  freshCamera.enableCamera();
  runCameraHook();
  assert.equal(cameraRequests, requestsBeforeReset + 1, 'The camera can be enabled for another session');
  resolveCamera({ getTracks: () => [{ stop() { stopped++; } }] });
  await new Promise(setImmediate);
  cleanup();
  assert.equal(stopped, 3);
  console.log('Capture, routing, empty-session redirects, retake, cancellation, and camera cleanup checks passed.');
}

main().catch(error => { console.error(error); process.exitCode = 1; });
