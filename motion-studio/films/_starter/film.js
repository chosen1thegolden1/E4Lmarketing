// Starter film: the smallest thing that follows the render contract in CLAUDE.md.
// Copy this folder to films/<name>, then replace the beats below with your shot list.
import { clamp, spring, track, rrect, preload, formatSize, grid } from '../../lib/motion.js';

const { w: W, h: H } = formatSize();
const canvas = document.getElementById('c');
canvas.width = W;
canvas.height = H;
const ctx = canvas.getContext('2d');
if (!new URLSearchParams(location.search).has('render')) document.body.classList.add('preview');

const C = { bg: '#0B0B0A', surface: '#F7F5EF', ink: '#111111', accent: '#FFC200', white: '#FFFFFF' };
const BPM = 120;
const { bar } = grid(BPM);
const DUR = 8;
const u = Math.min(W, H) / 1080;
const M = 80 * u;

// Type rises out of a mask line at its baseline. p: 0 -> 1 in, q: 0 -> 1 out.
function rise(str, x, y, size, color, p, q = 0) {
  if (p <= 0.001 || q >= 0.999) return;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, y - size * 1.02, W, size * 1.3);
  ctx.clip();
  ctx.font = `800 ${size}px "Rethink Sans"`;
  ctx.letterSpacing = `${-0.03 * size}px`;
  ctx.fillStyle = color;
  ctx.fillText(str, x, y + (1 - p) * size * 1.1 - q * size * 1.1);
  ctx.restore();
}
const tin = (t, at) => spring(t - at, 230, 2 * Math.sqrt(230));
const tout = (t, at) => spring(t - at, 560, 2 * Math.sqrt(560));

// One container, one state per bar. Each key: [time, value]; track() stacks a spring per change.
const states = [
  { x: M, y: H * 0.45, w: W - 2 * M, h: 160 * u, r: 80 * u },
  { x: M, y: H * 0.15, w: W - 2 * M, h: H * 0.5, r: 32 * u },
  { x: M, y: H * 0.62, w: W - 2 * M, h: 140 * u, r: 70 * u }
];
const keys = (prop) => states.map((s, i) => [i === 0 ? 0 : bar(i * 1.5) - 0.08, s[prop]]);

function seek(t) {
  t = clamp(t, 0, DUR);
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);

  const box = Object.fromEntries(['x', 'y', 'w', 'h', 'r'].map((p) => [p, track(t, keys(p), 210, 25)]));
  const grow = spring(t - 0.1, 300, 30);
  rrect(ctx, box.x, box.y, box.w * grow, box.h, box.r);
  ctx.fillStyle = t > bar(3) - 0.1 ? C.accent : C.surface;
  ctx.fill();

  rise('Replace me.', M, H * 0.3, 140 * u, C.white, tin(t, 0.2), tout(t, bar(1.5) - 0.2));
  rise('One state per bar.', M, H * 0.82, 90 * u, C.white, tin(t, bar(1.5)), tout(t, bar(3) - 0.2));
  rise('Your CTA here', box.x + 50 * u, box.y + box.h * 0.62, 56 * u, C.ink, tin(t, bar(3) + 0.1));
}

window.FILM = { duration: DUR, bpm: BPM, beats: [0.5, 2, 3.5, 5, 6.5, 7.5] };
window.ready = (async () => {
  await preload({}, ['800 100px "Rethink Sans"']);
  window.seek = seek;
  seek(Number(new URLSearchParams(location.search).get('t') || 0));
})();
