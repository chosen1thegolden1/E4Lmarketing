import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Mix, kick, snare, whoosh, riser, SR } from '../lib/synth.mjs';

test('voices are deterministic (seeded noise)', () => {
  assert.deepEqual(snare(5), snare(5));
  assert.deepEqual(whoosh(0.3, 9), whoosh(0.3, 9));
  assert.deepEqual(riser(0.5, 2), riser(0.5, 2));
});

test('mix places a voice at the right sample and stays in [-1, 1]', () => {
  const m = new Mix(1);
  m.add(kick(), 0.5, 1, 0, { label: 'k' });
  const { L, R } = m.render();
  const first = L.findIndex((v) => v !== 0);
  assert.equal(first, Math.round(0.5 * SR));
  for (let i = 0; i < L.length; i++) assert.ok(Math.abs(L[i]) <= 1 && Math.abs(R[i]) <= 1);
  assert.deepEqual(m.cues, [{ t: 0.5, label: 'k' }]);
});
