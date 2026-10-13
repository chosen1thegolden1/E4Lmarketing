import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spring, track, life, rng, noise, grid, mix, clamp } from '../lib/motion.js';

test('spring starts at 0, settles at 1, is 0 before its start', () => {
  assert.equal(spring(-1), 0);
  assert.equal(spring(0), 0);
  assert.ok(Math.abs(spring(3) - 1) < 1e-4);
});

test('critically damped spring never overshoots (type preset)', () => {
  const k = 160, d = 2 * Math.sqrt(k);
  for (let t = 0; t < 2; t += 0.001) assert.ok(spring(t, k, d) <= 1 + 1e-9);
});

test('underdamped spring overshoots only a hair (UI preset)', () => {
  let max = 0;
  for (let t = 0; t < 2; t += 0.001) max = Math.max(max, spring(t, 320, 26));
  assert.ok(max > 1 && max < 1.05, `overshoot ${max}`);
});

test('track stacks one spring per change and lands on every target', () => {
  const keys = [[0, 10], [1, 50], [2, -20]];
  assert.equal(track(0, keys), 10);
  assert.ok(Math.abs(track(1.99, keys) - 50) < 0.5);
  assert.ok(Math.abs(track(5, keys) + 20) < 1e-3);
});

test('life goes 0 -> 1 -> 0', () => {
  assert.equal(life(0, 1, 3), 0);
  assert.ok(life(2.5, 1, 3) > 0.99);
  assert.ok(life(6, 1, 3) < 1e-3);
});

test('seeded rng and noise are deterministic', () => {
  const a = rng(42), b = rng(42);
  for (let i = 0; i < 100; i++) assert.equal(a(), b());
  assert.equal(noise(3.7, 1), noise(3.7, 1));
  for (let x = 0; x < 20; x += 0.13) assert.ok(Math.abs(noise(x)) <= 1);
});

test('grid, mix and clamp', () => {
  const g = grid(120);
  assert.equal(g.beat(4), 2);
  assert.equal(g.bar(2), 4);
  assert.equal(mix('#000000', '#FFFFFF', 0.5), 'rgb(128,128,128)');
  assert.equal(clamp(2), 1);
});
