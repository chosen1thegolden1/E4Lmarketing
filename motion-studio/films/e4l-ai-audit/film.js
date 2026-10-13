// "Is AI recommending you?" — E4L Free AI Audit reel. 18 s, 120 BPM.
// A pure function of time: window.seek(t) paints frame t. See docs/shotlist.md for the beat plan.
import { clamp, lerp, spring, track, prog, mix, rrect, preload, formatSize, grid } from '../../lib/motion.js';

const { w: W, h: H } = formatSize();
const canvas = document.getElementById('c');
canvas.width = W;
canvas.height = H;
const ctx = canvas.getContext('2d');
if (!new URLSearchParams(location.search).has('render')) document.body.classList.add('preview');

const C = { bg: '#0B0B0A', paper: '#F7F5EF', ink: '#111111', dim: '#8F897C', white: '#FFFFFF', gold: '#FFC200' };
const BPM = 120;
const { beat: B } = grid(BPM);
const DUR = 18;
const EARLY = 0.08; // morphs start just before the downbeat so they land on it

// ---------- layout ----------
const portrait = H > W * 1.2;
const u = portrait ? W / 1080 : Math.min(W, H) / 1350;
const M = 80 * u;
// Container column and type column. Portrait stacks them; square/landscape puts them side by side.
const BOX = portrait ? { x: M, w: W - 2 * M } : { x: W * 0.5, w: W * 0.5 - M };
const TYP = portrait ? { x: M, w: W - 2 * M } : { x: M, w: W * 0.5 - 2 * M };

// Real questions from geo/money-questions/*.json, [city] = Los Angeles.
const QUESTIONS = [
  { q: 'emergency roofer near Los Angeles', niche: 'Roofing' },
  { q: 'best dentist in Los Angeles', niche: 'Dental' },
  { q: 'emergency AC repair near Los Angeles', niche: 'HVAC' },
  { q: 'best med spa in Los Angeles', niche: 'Med Spa' }
];

let IMG = {};
let A = {}; // anchors, computed once images are known

function layout() {
  const pillH = 170 * u;
  const hdrH = BOX.w * IMG.header.height / IMG.header.width;
  const tblH = BOX.w * IMG.table.height / IMG.table.width;
  const repH = hdrH + tblH;
  const cols = portrait || W <= H ? 4 : 5;
  const gap = 14 * u, pad = 22 * u;
  const tw = (BOX.w - pad * 2 - gap * (cols - 1)) / cols, th = tw * 1.3;
  const rows = Math.ceil(14 / cols);
  const gridH = pad * 2 + rows * th + (rows - 1) * gap;
  const ctaH = 140 * u;
  A = {
    pill: { x: BOX.x, y: portrait ? H * 0.27 : H * 0.44, w: BOX.w, h: pillH, r: pillH / 2 },
    card: portrait ? { x: BOX.x, y: H * 0.085, w: BOX.w, h: H * 0.58, r: 34 * u } : { x: BOX.x, y: H * 0.08, w: BOX.w, h: H * 0.84, r: 30 * u },
    report: { x: BOX.x, y: portrait ? H * 0.14 : (H - repH) / 2, w: BOX.w, h: repH, r: 18 * u, hdrH, tblH },
    grid: { x: BOX.x, y: portrait ? H * 0.09 : (H - gridH) / 2, w: BOX.w, h: gridH, r: 26 * u, cols, gap, pad, tw, th },
    full: { x: 0, y: 0, w: W, h: H, r: 0 },
    cta: { x: portrait ? M : BOX.x, y: portrait ? H * 0.62 : H * 0.44, w: portrait ? W - 2 * M : BOX.w, h: ctaH, r: ctaH / 2 }
  };
  // "AI." block, sized from the hook type.
  const aiSize = Math.min(fitSize('AI.', 800, 'Rethink Sans', -0.04, 520 * u, (portrait ? W : W * 0.6) - 2 * M), portrait ? Infinity : H * 0.40);
  ctx.font = font(aiSize, 800);
  ctx.letterSpacing = `${-0.04 * aiSize}px`;
  const aiW = ctx.measureText('AI.').width;
  const aiBase = portrait ? H * 0.70 : H * 0.86;
  A.ai = { size: aiSize, base: aiBase, block: { x: M - 24 * u, y: aiBase - aiSize * 0.80, w: aiW + 60 * u, h: aiSize * 0.92, r: 14 * u } };
}

// ---------- type helpers ----------
const font = (size, weight = 800, fam = 'Rethink Sans') => `${weight} ${size}px "${fam}"`;
function setFont(size, weight, fam, trk) {
  ctx.font = font(size, weight, fam);
  ctx.letterSpacing = `${trk * size}px`;
}
function fitSize(str, weight, fam, trk, size, maxW) {
  setFont(size, weight, fam, trk);
  const w = ctx.measureText(str).width;
  return w > maxW ? size * maxW / w : size;
}
function text(str, x, y, { size, weight = 800, fam = 'Rethink Sans', color = C.white, trk = -0.03, align = 'left' }) {
  setFont(size, weight, fam, trk);
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(str, x, y);
}
function textW(str, size, weight = 800, fam = 'Rethink Sans', trk = -0.03) {
  setFont(size, weight, fam, trk);
  return ctx.measureText(str).width;
}
// Type rises out of a mask line at its baseline (p: 0 -> 1 in) and keeps rising out (q: 0 -> 1 out).
function rise(str, x, y, opts, p, q = 0) {
  if (p <= 0.001 || q >= 0.999) return;
  const s = opts.size;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, y - s * 1.02, W, s * 1.3);
  ctx.clip();
  text(str, x, y + (1 - p) * s * 1.1 - q * s * 1.1, opts);
  ctx.restore();
}
// Rich line: segments [{t, color}] laid out left to right, rising together.
function riseRich(segs, x, y, opts, p, q = 0) {
  let cx = x;
  for (const s of segs) {
    rise(s.t, cx, y, { ...opts, color: s.color || opts.color }, p, q);
    cx += textW(s.t, opts.size, opts.weight, opts.fam, opts.trk ?? -0.03);
  }
}
const typeIn = (t, at) => spring(t - at, 230, 2 * Math.sqrt(230));
// Exits are quicker than entrances: get off the stage before the next state lands.
const typeOut = (t, at) => spring(t - at, 560, 2 * Math.sqrt(560));
// Mono kicker line. Shrinks to fit maxW (default: to the right edge of the frame).
const kicker = (str, x, y, color = C.gold, size = 32 * u, maxW = W - x - M) =>
  ({ str, x, y, opts: { size: fitSize(str, 700, 'Space Mono', 0.12, size, maxW), weight: 700, fam: 'Space Mono', color, trk: 0.12 } });

// ---------- the container: one shape for the whole film ----------
function keysFor(prop) {
  const s = [
    [0, A.ai.block], [1.44, A.ai.block], [2 - EARLY, A.pill], [4 - EARLY, A.card], [6 - EARLY, A.report],
    [10 - EARLY, A.grid], [12 - EARLY, A.full], [14 - EARLY, A.cta]
  ];
  return s.map(([t, r]) => [t, r[prop]]);
}
let KX, KY, KW, KH, KR;
function container(t) {
  const k = 210, d = 25;
  let w = track(t, KW, k, d);
  // The opening wipe: the gold block grows from the left edge of "AI." at 1.44.
  if (t < 1.9) w = A.ai.block.w * spring(t - 1.44, 300, 30);
  return {
    x: track(t, KX, k, d), y: track(t, KY, k, d), w, h: track(t, KH, k, d), r: Math.max(0, track(t, KR, k, d)),
    gold: track(t, [[0, 1], [2 - EARLY, 0], [12 - EARLY, 1]], 260, 30)
  };
}

// ---------- cursor ----------
function cursorPos(t) {
  const off = [W + 120 * u, H * 0.9];
  const p = A.pill, r = A.report, c = A.cta;
  const send = [p.x + p.w - p.h / 2, p.y + p.h / 2];
  const row = (i) => [r.x + r.w * 0.42, r.y + r.hdrH + r.tblH * (ROWS[i + 1] + ROWS[i + 2]) / 2];
  const keys = [
    [0, off], [3.2, off], [3.45, send], [4.15, [W + 120 * u, p.y - 200 * u]],
    [6.05, row(0)]
  ];
  for (let i = 1; i < 7; i++) keys.push([6.05 + i * 0.25, row(i)]);
  keys.push([8.0, colPoint(0)], [8.5, colPoint(1)], [9.0, colPoint(2)], [9.75, off]);
  keys.push([10.75, gridCell(9)], [11.6, off]);
  keys.push([15.1, [c.x + c.w * 0.78, c.y + c.h * 0.62]], [16.6, [c.x + c.w * 0.86, c.y + c.h * 1.6]], [17.2, off]);
  const k = 240, d = 30;
  return [track(t, keys.map(([tt, v]) => [tt, v[0]]), k, d), track(t, keys.map(([tt, v]) => [tt, v[1]]), k, d)];
}
const CLICKS = [3.75, 11.0, 16.0];
function drawCursor(t) {
  const [x, y] = cursorPos(t);
  if (x > W + 40 * u) return;
  let press = 1;
  for (const c of CLICKS) press -= 0.18 * (spring(t - (c - 0.06), 900, 30) - spring(t - (c + 0.06), 500, 30));
  const s = 1.25 * u * press;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(0, 46); ctx.lineTo(11, 35); ctx.lineTo(19, 53); ctx.lineTo(27, 49);
  ctx.lineTo(19, 32); ctx.lineTo(34, 32); ctx.closePath();
  ctx.fillStyle = C.white; ctx.fill();
  ctx.lineWidth = 3; ctx.strokeStyle = C.ink; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.restore();
}

// Table row boundaries (fraction of table height), measured from the real report crop.
const ROWS = [0, 60, 118, 177, 236, 328, 387, 446, 506].map((v) => v / 506);
// Platform column centers (fraction of table width): ChatGPT, Gemini, Perplexity.
const COLS = [[0.587, 0.726], [0.726, 0.863], [0.863, 1.0]];
function zoomAt(t) {
  // Push into the platform columns 8 -> 10 s, then pull back as the container leaves.
  return track(t, [[0, 0], [8 - EARLY, 1], [10 - EARLY - 0.25, 0]], 150, 2 * Math.sqrt(150));
}
function colPoint(i) {
  // Matches reportContent's map() at full zoom.
  const r = A.report, s = 1 / (1 - 0.56);
  const cx = r.x + r.w * (COLS[i][0] + COLS[i][1]) / 2;
  return [r.x + (cx - (r.x + r.w * 0.56)) * s, r.y + r.tblH * ROWS[1] * 0.5 * s + 30 * u];
}
function gridCell(i) {
  const g = A.grid;
  const cx = g.x + g.pad + (i % g.cols) * (g.tw + g.gap) + g.tw * 0.5;
  const cy = g.y + g.pad + Math.floor(i / g.cols) * (g.th + g.gap) + g.th * 0.45;
  return [cx, cy];
}

// ---------- container contents ----------
// Container content swaps behind a short blur, overlapping so the container is never empty.
function swapA(t, a, b) {
  const inA = a <= 0 ? 1 : clamp((t - (a - 0.05)) / 0.11);
  const outA = clamp(((b + 0.03) - t) / 0.11);
  return Math.min(inA, outA);
}
function swapBegin(alpha) {
  ctx.globalAlpha = alpha;
  if (alpha < 1) ctx.filter = `blur(${((1 - alpha) * 14 * u).toFixed(1)}px)`;
}
function swapEnd() {
  ctx.globalAlpha = 1;
  ctx.filter = 'none';
}

function pillContent(t, box) {
  const a = swapA(t, 2, 4);
  if (a <= 0) return;
  swapBegin(a);
  const p = A.pill, cy = box.y + box.h / 2;
  // Gold spark dot, then the typed question.
  ctx.fillStyle = C.gold;
  ctx.beginPath(); ctx.arc(box.x + 62 * u, cy, 17 * u, 0, Math.PI * 2); ctx.fill();
  const idx = clamp(Math.floor((t - 2.1) / 0.5), 0, 3);
  const q = QUESTIONS[idx].q;
  const start = 2.1 + idx * 0.5;
  const n = Math.floor(clamp((t - start) / 0.28) * q.length);
  const swap = idx < 3 ? clamp(1 - Math.abs(t - (start + 0.5)) / 0.06) : 0;
  const size = fitSize(q, 500, 'Rethink Sans', -0.01, 50 * u, p.w - 104 * u - p.h - 24 * u);
  const base = ctx.filter;
  if (swap > 0) ctx.filter = `blur(${(swap * 8 * u).toFixed(1)}px)`;
  text(q.slice(0, n), box.x + 104 * u, cy + size * 0.36, { size, weight: 500, color: C.ink, trk: -0.01 });
  ctx.filter = base;
  if (n < q.length || Math.floor(t * 4) % 2 === 0) {
    const cw = textW(q.slice(0, n), size, 500, 'Rethink Sans', -0.01);
    ctx.fillStyle = C.ink;
    ctx.fillRect(box.x + 108 * u + cw, cy - size * 0.5, 3 * u, size * 1.0);
  }
  // Send button, pressed by the cursor at 3.75.
  const press = 1 - 0.12 * (spring(t - 3.7, 900, 30) - spring(t - 3.82, 400, 30));
  const bx = box.x + box.w - p.h / 2, br = (p.h / 2 - 18 * u) * press;
  ctx.fillStyle = C.ink;
  ctx.beginPath(); ctx.arc(bx, cy, br, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = C.gold; ctx.lineWidth = 7 * u; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(bx, cy + 20 * u); ctx.lineTo(bx, cy - 20 * u); ctx.moveTo(bx - 16 * u, cy - 4 * u); ctx.lineTo(bx, cy - 20 * u); ctx.lineTo(bx + 16 * u, cy - 4 * u); ctx.stroke();
  swapEnd();
}

function answerContent(t, box) {
  const a = swapA(t, 4, 6);
  if (a <= 0) return;
  swapBegin(a);
  const im = IMG.chatgpt, s = box.w / im.width, ih = im.height * s;
  const scroll = prog(t, 4.3, 6.0) * Math.max(0, ih - box.h) * 0.55;
  ctx.drawImage(im, box.x, box.y - scroll, box.w, ih);
  // Gemini's answer slides over at 5.0: a second, real answer to the same question.
  const g = IMG.gemini, gw = box.w * 0.62, gh = g.height * gw / g.width;
  const gp = spring(t - (5 - EARLY), 300, 28);
  const gx = lerp(box.x + box.w + 40 * u, box.x + box.w - gw - 28 * u, gp), gy = box.y + box.h * 0.2;
  if (gp > 0.001) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.28)'; ctx.shadowBlur = 40 * u; ctx.shadowOffsetY = 12 * u;
    rrect(ctx, gx, gy, gw, Math.min(gh, box.h * 0.75), 22 * u);
    ctx.fillStyle = C.white; ctx.fill();
    ctx.restore();
    ctx.save();
    rrect(ctx, gx, gy, gw, Math.min(gh, box.h * 0.75), 22 * u);
    ctx.clip();
    ctx.drawImage(g, gx, gy, gw, gh);
    ctx.restore();
  }
  // Platform tags on each answer.
  tag('ChatGPT', box.x + 26 * u, box.y + box.h - 40 * u, clamp((t - 4.2) * 6));
  tag('Gemini', gx + 20 * u, gy + Math.min(gh, box.h * 0.75) - 34 * u, gp);
  swapEnd();
}
function tag(str, x, y, p) {
  if (p <= 0) return;
  const size = 26 * u, w = textW(str.toUpperCase(), size, 700, 'Space Mono', 0.1) + 34 * u;
  ctx.save();
  ctx.globalAlpha *= clamp(p);
  rrect(ctx, x, y - size * 1.25, w, size * 1.7, 8 * u);
  ctx.fillStyle = C.ink; ctx.fill();
  text(str.toUpperCase(), x + 17 * u, y - size * 0.1, { size, weight: 700, fam: 'Space Mono', color: C.gold, trk: 0.1 });
  ctx.restore();
}

function reportContent(t, box) {
  const a = swapA(t, 6, 10);
  if (a <= 0) return;
  swapBegin(a);
  const r = A.report, z = zoomAt(t), s = 1 / (1 - 0.56 * z);
  // Draw with an explicit mapping instead of nested transforms: report point (px, py) -> screen.
  // Report point (px, py) -> screen. Zoomed, the platform columns fill the container width.
  const ax = r.x + r.w * 0.56 * z;
  const map = (px, py) => [box.x + (px - ax) * s, box.y + (py - r.y - r.hdrH * z) * s];
  const [hx, hy] = map(r.x, r.y);
  ctx.drawImage(IMG.header, hx, hy, r.w * s, r.hdrH * s);
  const [tx, ty] = map(r.x, r.y + r.hdrH);
  ctx.drawImage(IMG.table, tx, ty, r.w * s, r.tblH * s);
  // Row scan: one row per 8th note, 6.0 -> 7.5.
  for (let i = 0; i < 7; i++) {
    const off = i < 6 ? 6.0 + (i + 1) * 0.25 - 0.03 : 7.9;
    const on = spring(t - (6.0 + i * 0.25 - 0.03), 500, 30) - spring(t - off, 500, 30);
    if (on <= 0.01) continue;
    const [rx, ry] = map(r.x, r.y + r.hdrH + r.tblH * ROWS[i + 1]);
    const [, ry2] = map(r.x, r.y + r.hdrH + r.tblH * ROWS[i + 2]);
    ctx.fillStyle = `rgba(255,194,0,${0.22 * on})`;
    ctx.fillRect(rx, ry, r.w * s, ry2 - ry);
    ctx.fillStyle = C.gold;
    ctx.fillRect(rx, ry, 10 * u * on, ry2 - ry);
  }
  // Column scan: one platform per beat, 8.0 -> 9.0, underline stays.
  for (let i = 0; i < 3; i++) {
    const on = spring(t - (8.0 + i * 0.5 - 0.04), 420, 28) * clamp((10 - EARLY - t) * 10);
    if (on <= 0.01) continue;
    const [cx0, cy0] = map(r.x + r.w * COLS[i][0], r.y + r.hdrH);
    const [cx1, cy1] = map(r.x + r.w * COLS[i][1], r.y + r.hdrH + r.tblH);
    ctx.fillStyle = `rgba(255,194,0,${0.16 * on})`;
    ctx.fillRect(cx0, cy0, cx1 - cx0, cy1 - cy0);
    const [, hb] = map(0, r.y + r.hdrH + r.tblH * ROWS[1]);
    ctx.fillStyle = C.gold;
    const uw = (cx1 - cx0) * on;
    ctx.fillRect(cx0, hb - 10 * u, uw, 10 * u);
  }
  swapEnd();
}

function gridContent(t, box) {
  const a = swapA(t, 10, 12);
  if (a <= 0) return;
  swapBegin(a);
  const g = A.grid;
  const ox = box.x - g.x, oy = box.y - g.y;
  for (let i = 0; i < 14; i++) {
    // Tiles pop in on 16ths starting at 10.0; tile 9 is picked by the cursor at 11.0.
    const p = spring(t - (10.0 + i * 0.0625), 380, 26);
    if (p <= 0.001) continue;
    const pick = i === 9 ? spring(t - 11.0, 300, 26) : 0;
    const cx = ox + g.x + g.pad + (i % g.cols) * (g.tw + g.gap), cy = oy + g.y + g.pad + Math.floor(i / g.cols) * (g.th + g.gap);
    const sc = p * (1 + pick * 0.55);
    ctx.save();
    ctx.translate(cx + g.tw / 2, cy + g.th / 2);
    ctx.scale(sc, sc);
    rrect(ctx, -g.tw / 2, -g.th / 2, g.tw, g.th, 10 * u);
    ctx.fillStyle = C.white; ctx.fill();
    ctx.save(); ctx.clip();
    ctx.drawImage(IMG.sprite, (i % 7) * 300, Math.floor(i / 7) * 390, 300, 390, -g.tw / 2, -g.th / 2, g.tw, g.th);
    ctx.restore();
    ctx.lineWidth = (pick > 0.01 ? 6 : 2) * u / sc;
    ctx.strokeStyle = pick > 0.01 ? C.gold : '#DDD8CC';
    rrect(ctx, -g.tw / 2, -g.th / 2, g.tw, g.th, 10 * u);
    ctx.stroke();
    ctx.restore();
  }
  // Draw the picked tile last so it sits on top.
  const pick = spring(t - 11.0, 300, 26);
  if (pick > 0.01) {
    const i = 9, cx = ox + g.x + g.pad + (i % g.cols) * (g.tw + g.gap), cy = oy + g.y + g.pad + Math.floor(i / g.cols) * (g.th + g.gap);
    const sc = 1 + pick * 0.55;
    ctx.save();
    ctx.translate(cx + g.tw / 2, cy + g.th / 2);
    ctx.scale(sc, sc);
    ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 30 * u; ctx.shadowOffsetY = 10 * u;
    rrect(ctx, -g.tw / 2, -g.th / 2, g.tw, g.th, 10 * u);
    ctx.fillStyle = C.white; ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.save(); ctx.clip();
    ctx.drawImage(IMG.sprite, (i % 7) * 300, Math.floor(i / 7) * 390, 300, 390, -g.tw / 2, -g.th / 2, g.tw, g.th);
    ctx.restore();
    ctx.lineWidth = 6 * u / sc; ctx.strokeStyle = C.gold;
    rrect(ctx, -g.tw / 2, -g.th / 2, g.tw, g.th, 10 * u); ctx.stroke();
    ctx.restore();
  }
  swapEnd();
}

function ctaContent(t, box) {
  const a = clamp((t - 14.25) * 6);
  if (a <= 0) return;
  const press = 1 - 0.06 * (spring(t - 15.94, 900, 30) - spring(t - 16.08, 380, 26));
  const str = 'Get your Free AI Audit';
  const size = fitSize(str, 800, 'Rethink Sans', -0.02, 56 * u, box.w - 190 * u) * press;
  ctx.save();
  ctx.beginPath(); rrect(ctx, box.x, box.y, box.w, box.h, box.r); ctx.clip();
  const p = spring(t - 14.3, 230, 2 * Math.sqrt(230));
  text(str, box.x + 64 * u, box.y + box.h / 2 + size * 0.36 + (1 - p) * box.h, { size, weight: 800, color: C.ink, trk: -0.02 });
  // Arrow, nudged right by the press.
  const ax = box.x + box.w - 84 * u + 10 * u * (1 - press) / 0.06, ay = box.y + box.h / 2 + (1 - p) * box.h;
  ctx.strokeStyle = C.ink; ctx.lineWidth = 8 * u; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(ax - 28 * u, ay); ctx.lineTo(ax + 22 * u, ay); ctx.moveTo(ax + 4 * u, ay - 18 * u); ctx.lineTo(ax + 22 * u, ay); ctx.lineTo(ax + 4 * u, ay + 18 * u); ctx.stroke();
  ctx.restore();
}

// ---------- type layer (outside the container) ----------
function hook(t) {
  if (t > 2.3) return;
  const lines = ['YOUR', 'CUSTOMERS', 'ASK'];
  const maxW = (portrait ? W : W * 0.62) - 2 * M;
  // Three lines must sit above the "AI." block: cap height ~0.72, line gap 0.9.
  const room = A.ai.block.y - M - 30 * u;
  const size = Math.min(fitSize('CUSTOMERS', 800, 'Rethink Sans', -0.04, 190 * u, maxW), room / (0.72 + 0.9 * 2));
  const lead = size * 0.9;
  const top = A.ai.block.y - 30 * u - lead * 2 - size * 0.22;
  lines.forEach((w, i) => {
    const p = typeIn(t, B(i) - 0.22);
    const q = typeOut(t, 1.86 + i * 0.03);
    rise(w, M, top + lead * i, { size, weight: 800, color: C.white, trk: -0.04 }, p, q);
  });
  // "AI." slams in on beat 3, turns ink when the gold block wipes behind it, leaves before the morph.
  const p = spring(t - (B(3) - 0.12), 420, 2 * Math.sqrt(420));
  const q = typeOut(t, 1.86);
  const onGold = clamp((t - 1.44) * 4);
  rise('AI.', M, A.ai.base, { size: A.ai.size, weight: 800, color: mix(C.gold, C.ink, onGold), trk: -0.04 }, p, q);
}

function sectionType(t) {
  const big = portrait ? 104 * u : 92 * u;
  const tx = TYP.x;
  // Bar 1: kicker above the pill; the trade being asked about swaps in huge type on every beat.
  if (t > 2 && t < 4.3) {
    const k = kicker('WHAT YOUR CUSTOMERS ASK AI', A.pill.x, A.pill.y - 52 * u);
    rise(k.str, k.x, k.y, k.opts, typeIn(t, 2.0), typeOut(t, 3.95));
    const gy = portrait ? A.pill.y + A.pill.h + 420 * u : H * 0.60;
    const maxW = TYP.w;
    QUESTIONS.forEach((qq, i) => {
      const at = 2.1 + i * 0.5 - 0.1;
      const out = i < 3 ? at + 0.5 : 3.92;
      const word = qq.niche.toUpperCase() + '.';
      const size = fitSize('MED SPA.', 800, 'Rethink Sans', -0.04, portrait ? 230 * u : 190 * u, maxW);
      rise(word, tx, gy, { size, color: i % 2 ? C.gold : C.white, trk: -0.04 }, spring(t - at, 420, 2 * Math.sqrt(420)), typeOut(t, out));
    });
    const k2 = kicker('REAL QUESTIONS FROM OUR AUDITS', tx, gy + 80 * u, C.dim, 32 * u, TYP.w);
    rise(k2.str, k2.x, k2.y, k2.opts, typeIn(t, 2.2), typeOut(t, 3.95));
  }
  // Bar 2: the answer.
  if (t > 4 && t < 6.3) {
    const y1 = portrait ? A.card.y + A.card.h + 150 * u : H * 0.42;
    const size = fitSize('AI picks a few names.', 800, 'Rethink Sans', -0.03, big, TYP.w);
    rise('AI picks a few names.', tx, y1, { size, color: C.white }, typeIn(t, 4.1), typeOut(t, 5.9));
    riseRich([{ t: 'Is ' }, { t: 'yours', color: C.gold }, { t: ' one?' }], tx, y1 + size * 1.08, { size, weight: 800, color: C.white, trk: -0.03 }, typeIn(t, 4.6), typeOut(t, 5.93));
  }
  // Bars 3-4: the big number rolls 7 -> 3.
  if (t > 6 && t < 10.3) {
    const r = A.report;
    const ny = portrait ? r.y + r.h + 560 * u : H * 0.56;
    // Number + label must fit the type column.
    const want = (portrait ? 520 : 400) * u, wantL = (portrait ? 76 : 64) * u;
    const fitK = Math.min(1, TYP.w / (textW('7', want, 800, 'Rethink Sans', -0.05) + 40 * u + textW('questions', wantL)));
    const nsize = want * fitK;
    const roll = spring(t - (8 - EARLY), 300, 2 * Math.sqrt(300));
    const pin = typeIn(t, 6.05), pout = typeOut(t, 9.9);
    ctx.save();
    ctx.beginPath(); ctx.rect(0, ny - nsize * 0.8, W, nsize * 0.86); ctx.clip();
    text('7', tx, ny + (1 - pin) * nsize - roll * nsize * 0.9 - pout * nsize, { size: nsize, color: C.gold, trk: -0.05 });
    text('3', tx, ny + nsize * 0.9 * (1 - roll) + (1 - pin) * nsize - pout * nsize, { size: nsize, color: C.gold, trk: -0.05 });
    ctx.restore();
    const lx = tx + textW('7', nsize, 800, 'Rethink Sans', -0.05) + 40 * u;
    const ls = wantL * fitK;
    const l1 = ['money', 'questions'], l2 = ['AI', 'platforms'];
    for (let i = 0; i < 2; i++) {
      rise(l1[i], lx, ny - nsize * 0.38 + i * ls * 1.02, { size: ls, color: C.white }, typeIn(t, 6.15 + i * 0.05), typeOut(t, 7.86 + i * 0.03));
      rise(l2[i], lx, ny - nsize * 0.38 + i * ls * 1.02, { size: ls, color: C.white }, typeIn(t, 8.05 + i * 0.05), typeOut(t, 9.9));
    }
    const k1 = kicker('THE ONES BUYERS ACTUALLY TYPE', tx, ny + 70 * u, C.dim, 32 * u, TYP.w);
    rise(k1.str, k1.x, k1.y, k1.opts, typeIn(t, 6.3), typeOut(t, 7.86));
    const names = ['CHATGPT', 'GEMINI', 'PERPLEXITY'];
    let nx = tx;
    const nsz = fitSize(names.join('   '), 700, 'Space Mono', 0.12, 32 * u, TYP.w);
    names.forEach((n, i) => {
      const k = kicker(n, nx, ny + 70 * u, C.gold, nsz, Infinity);
      rise(k.str, k.x, k.y, k.opts, typeIn(t, 8.0 + i * 0.5), typeOut(t, 9.9));
      nx += textW(n + '   ', nsz, 700, 'Space Mono', 0.12);
    });
  }
  // Bar 5: receipts.
  if (t > 10 && t < 12.3) {
    const y1 = portrait ? A.grid.y + A.grid.h + 170 * u : H * 0.44;
    const size = Math.min(fitSize('every answer.', 800, 'Rethink Sans', -0.03, big * 1.1, TYP.w), fitSize('A screenshot of', 800, 'Rethink Sans', -0.03, big * 1.1, TYP.w));
    rise('A screenshot of', tx, y1, { size, color: C.white }, typeIn(t, 10.1), typeOut(t, 11.9));
    rise('every answer.', tx, y1 + size * 1.04, { size, color: C.gold }, typeIn(t, 10.5), typeOut(t, 11.93));
  }
}

function metric(t, box) {
  if (t < 11.9 || t > 14.3) return;
  // Count 0 -> 21 on a spring from the downbeat at 12.0. 21 = 7 questions x 3 platforms per audit.
  const n = Math.round(21 * spring(t - 12.0, 60, 2 * Math.sqrt(60)) + 0.0001);
  const size = portrait ? 700 * u : 620 * u;
  const x = portrait ? M - 20 * u : M;
  const y = portrait ? H * 0.50 : H * 0.62;
  const pin = spring(t - 11.95, 300, 2 * Math.sqrt(300)), pout = typeOut(t, 13.88);
  ctx.save();
  ctx.beginPath(); ctx.rect(box.x, box.y, box.w, box.h); ctx.clip();
  rise(String(n), x, y, { size, color: C.ink, trk: -0.06 }, pin, pout);
  const lx = portrait ? M : M + textW('21', size, 800, 'Rethink Sans', -0.06) + 50 * u;
  const ly = portrait ? y + 150 * u : H * 0.42;
  const ls = portrait ? 100 * u : 84 * u;
  rise('AI answers', lx, ly, { size: ls, color: C.ink }, typeIn(t, 12.1), typeOut(t, 13.9));
  rise('checked.', lx, ly + ls * 1.02, { size: ls, color: C.ink }, typeIn(t, 12.15), typeOut(t, 13.92));
  const k = kicker('7 QUESTIONS × 3 PLATFORMS · EVERY AUDIT', lx, ly + ls * 1.02 + 80 * u, C.ink);
  rise(k.str, k.x, k.y, k.opts, typeIn(t, 12.5), typeOut(t, 13.9));
  ctx.restore();
}

function lockup(t) {
  if (t < 13.9) return;
  const tx = M;
  const colW = portrait ? W - 2 * M : W * 0.5 - 2 * M;
  // Brand lockup: wordmark in the display face, the report's brand line under it.
  const ws = fitSize('Eat 4 Life', 800, 'Rethink Sans', -0.04, portrait ? 240 * u : 170 * u, colW);
  const wy = portrait ? H * 0.20 : H * 0.30;
  rise('Eat 4 Life', tx, wy, { size: ws, color: C.white, trk: -0.04 }, spring(t - 13.98, 300, 2 * Math.sqrt(300)));
  const k = kicker('MARKETING · AI MARKETING MADE EASY', tx + 6 * u, wy + 72 * u, C.gold, 34 * u, colW);
  rise(k.str, k.x, k.y, k.opts, typeIn(t, 14.15));
  // Gold rule under the lockup, drawn left to right.
  const rw = colW * spring(t - 14.25, 200, 2 * Math.sqrt(200));
  ctx.fillStyle = '#2A2823';
  ctx.fillRect(tx, wy + 120 * u, rw, 3 * u);
  const size = fitSize('recommends you?', 800, 'Rethink Sans', -0.035, portrait ? 124 * u : 96 * u, colW);
  const y1 = portrait ? H * 0.43 : H * 0.58;
  rise('Find out if AI', tx, y1, { size, color: C.white, trk: -0.035 }, typeIn(t, 14.5));
  riseRich([{ t: 'recommends ' }, { t: 'you.', color: C.gold }], tx, y1 + size * 1.04, { size, weight: 800, color: C.white, trk: -0.035 }, typeIn(t, 14.75));
}

// ---------- frame ----------
function seek(t) {
  t = clamp(t, 0, DUR);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.filter = 'none';
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);

  const box = container(t);
  sectionType(t);
  lockup(t);

  // The container.
  if (box.w > 1 && box.h > 1) {
    ctx.save();
    rrect(ctx, box.x, box.y, box.w, box.h, box.r);
    ctx.fillStyle = mix(C.paper, C.gold, box.gold);
    ctx.fill();
    ctx.clip();
    pillContent(t, box);
    answerContent(t, box);
    reportContent(t, box);
    gridContent(t, box);
    ctx.restore();
    metric(t, box);
    ctaContent(t, box);
  }
  hook(t);
  drawCursor(t);
}

window.FILM = {
  duration: DUR,
  bpm: BPM,
  beats: [0.3, 0.8, 1.3, 1.75, 2.4, 2.9, 3.4, 3.8, 4.5, 5.5, 6.3, 7.3, 8.3, 9.3, 10.4, 11.4, 12.4, 13.4, 14.5, 15.5, 16.1, 17.5]
};

window.ready = (async () => {
  IMG = await preload({
    header: 'assets/report-header.png', table: 'assets/report-table.png',
    chatgpt: 'assets/receipt-chatgpt.png', gemini: 'assets/receipt-gemini.png', sprite: 'assets/receipts-sprite.png'
  }, ['800 100px "Rethink Sans"', '500 40px "Rethink Sans"', '700 40px "Rethink Sans"', '700 30px "Space Mono"']);
  layout();
  KX = keysFor('x'); KY = keysFor('y'); KW = keysFor('w'); KH = keysFor('h'); KR = keysFor('r');
  window.seek = seek;
  seek(Number(new URLSearchParams(location.search).get('t') || 0));
})();
