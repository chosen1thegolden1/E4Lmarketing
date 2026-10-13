// Motion helpers. Everything here is a pure function of its inputs, so any frame can be drawn
// instantly without replaying the frames before it.

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, p) => a + (b - a) * p;

// Damped spring from 0 to 1, as a pure function of time
export function spring(t, k = 170, d = 26) {
  if (t <= 0) return 0;
  const w0 = Math.sqrt(k), z = d / (2 * w0);
  if (z < 1) {
    const wd = w0 * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + (z * w0 / wd) * Math.sin(wd * t));
  }
  return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
}

// keys: [[time, value], ...]. One spring per change, stacked.
export function track(t, keys, k = 170, d = 26) {
  let v = keys[0][1];
  for (let i = 1; i < keys.length; i++)
    v += (keys[i][1] - keys[i - 1][1]) * spring(t - keys[i][0], k, d);
  return v;
}

// Spring presets. UI gets a hair of overshoot; type gets none (critically damped).
export const UI = [320, 26];
export const SNAP = [520, 34];
export const TYPE = [160, 2 * Math.sqrt(160)];
export const HEAVY = [90, 2 * Math.sqrt(90)];

// Spring in at `a`, spring out at `b` (0 -> 1 -> 0). Used for anything that lives inside a window.
export function life(t, a, b, k = TYPE[0], d = TYPE[1]) {
  return spring(t - a, k, d) - spring(t - b, k, d);
}

// Linear 0..1 progress through [a, b]. For things that should move at constant speed (scroll, typing).
export const prog = (t, a, b) => clamp((t - a) / (b - a));

// Seeded PRNG (mulberry32). Same seed, same numbers, every render.
export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let r = Math.imul(s ^ (s >>> 15), 1 | s);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// Deterministic 1D value noise in [-1, 1].
function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
export function noise(x, seed = 0) {
  const i = Math.floor(x), f = x - i;
  const u = f * f * (3 - 2 * f);
  return lerp(hash(i + seed * 1000), hash(i + 1 + seed * 1000), u) * 2 - 1;
}

// Beat grid: beat(n) -> seconds. bar(n) -> seconds of the downbeat of bar n.
export function grid(bpm, offset = 0) {
  const spb = 60 / bpm;
  return { spb, beat: (n) => offset + n * spb, bar: (n) => offset + n * 4 * spb };
}

// Hex color mix. p=0 -> a, p=1 -> b.
export function mix(a, b, p) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (v, s) => (v >> s) & 255;
  const c = (s) => Math.round(lerp(ch(pa, s), ch(pb, s), clamp(p)));
  return `rgb(${c(16)},${c(8)},${c(0)})`;
}

// Rounded rectangle path.
export function rrect(ctx, x, y, w, h, r) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Load images and fonts before the first seek. Returns a promise for window.ready.
export async function preload(srcs, fontSpecs = []) {
  const imgs = {};
  await Promise.all(Object.entries(srcs).map(([k, src]) => new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => { imgs[k] = im; res(); };
    im.onerror = () => rej(new Error('failed to load ' + src));
    im.src = src;
  })));
  await Promise.all(fontSpecs.map((f) => document.fonts.load(f)));
  await document.fonts.ready;
  return imgs;
}

// Canvas size for a format query (?format=9:16|1:1|16:9).
export function formatSize(search = location.search) {
  const f = new URLSearchParams(search).get('format') || '9:16';
  const sizes = { '9:16': [1080, 1920], '1:1': [1080, 1080], '16:9': [1920, 1080] };
  const [w, h] = sizes[f] || sizes['9:16'];
  return { format: sizes[f] ? f : '9:16', w, h };
}
