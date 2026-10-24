import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getPupilOffset } from './eyeTracking.ts'

test('pupil follows the pointer and stays within its iris', () => {
  assert.deepEqual(getPupilOffset(0, 0), { x: 0, y: 0 })
  assert.deepEqual(getPupilOffset(30, 0), { x: 6, y: 0 })
  assert.deepEqual(getPupilOffset(-600, 0), { x: -12, y: 0 })
  for (const [x, y] of [[600, 800], [-600, -800], [0, 10000]]) {
    const offset = getPupilOffset(x, y)
    assert.ok(Math.hypot(offset.x, offset.y) <= 12 + Number.EPSILON * 12)
    assert.equal(Math.sign(offset.x), Math.sign(x))
    assert.equal(Math.sign(offset.y), Math.sign(y))
  }
})
