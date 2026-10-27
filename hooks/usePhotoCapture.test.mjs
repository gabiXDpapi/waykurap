import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

const source = ts.transpileModule(readFileSync(new URL('./usePhotoCapture.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText

function setup() {
  const states = []
  const updates = []
  const timers = []
  const shots = []
  const drawing = []
  let now = 0
  let cleanup
  const exports = {}
  runInNewContext(source, {
    exports,
    require: () => ({
      useState(initial) {
        const index = states.push(initial) - 1
        return [initial, value => {
          states[index] = value
          updates.push({ index, value, time: now })
        }]
      },
      useRef: current => ({ current }),
      useEffect: effect => { cleanup = effect() },
    }),
    document: { createElement: () => ({
      getContext: () => ({
        translate: (...args) => drawing.push(['translate', ...args]),
        scale: (...args) => drawing.push(['scale', ...args]),
        drawImage: (_video, ...args) => { drawing.push(['drawImage', ...args]); shots.push(now) },
      }),
      toDataURL: () => `photo-${shots.length}`,
    }) },
    setTimeout: (callback, delay) => timers.push({ callback, time: now + delay }),
  })
  const capture = exports.usePhotoCapture({ current: { videoWidth: 640, videoHeight: 480 } })
  return {
    capture, states, updates, shots, drawing,
    unmount: () => cleanup(),
    async drain() {
      while (timers.length) {
        timers.sort((a, b) => a.time - b.time)
        const timer = timers.shift()
        now = timer.time
        timer.callback()
        await Promise.resolve()
      }
    },
  }
}

test('shows GET READY, counts 10 seconds for the first shot and 5 for each remaining shot', async () => {
  const session = setup()
  const result = session.capture.handleTakePhoto(3)
  assert.equal(session.states[1], 'GET READY')
  assert.equal(session.states[2], true)
  await session.drain()
  assert.deepEqual(Array.from(await result), ['photo-1', 'photo-2', 'photo-3'])
  assert.deepEqual(session.shots, [11000, 16500, 22000])
  assert.deepEqual(session.drawing, Array.from({ length: 3 }, () => [
    ['drawImage', 0, 0, 640, 480],
  ]).flat())
  assert.deepEqual(session.updates.filter(update => update.index === 1).map(update => update.value), [
    'GET READY', 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, null,
    5, 4, 3, 2, 1, null, 5, 4, 3, 2, 1, null,
  ])
  assert.equal(session.states[2], false)
  assert.equal(session.states[3], false)
})

test('leaving during GET READY stops countdown updates and photo capture', async () => {
  const session = setup()
  const result = session.capture.handleTakePhoto(3)
  const updateCount = session.updates.length
  session.unmount()
  await session.drain()
  assert.equal(await result, undefined)
  assert.equal(session.updates.length, updateCount)
  assert.deepEqual(session.shots, [])
})
