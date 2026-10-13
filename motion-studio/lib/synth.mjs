// Tiny deterministic synthesizer: drums, bass, pads, plucks and UI sound effects, all in code.
// Every voice returns a mono Float32Array; a Mix places voices on a stereo timeline.
import { writeFileSync } from 'node:fs';

export const SR = 48000;
const TAU = Math.PI * 2;

export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let r = Math.imul(s ^ (s >>> 15), 1 | s);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
const buf = (sec) => new Float32Array(Math.max(1, Math.round(sec * SR)));

// State-variable filter, per-sample cutoff function. mode: 'lp' | 'bp' | 'hp'.
function svf(x, cutoff, q = 0.7, mode = 'lp') {
  const y = new Float32Array(x.length);
  let lp = 0, bp = 0;
  for (let i = 0; i < x.length; i++) {
    const fc = typeof cutoff === 'function' ? cutoff(i / SR) : cutoff;
    const f = 2 * Math.sin((Math.PI * Math.min(fc, SR / 6)) / SR);
    const hp = x[i] - lp - bp / q;
    bp += f * hp;
    lp += f * bp;
    y[i] = mode === 'lp' ? lp : mode === 'bp' ? bp : hp;
  }
  return y;
}

// ---------- drums ----------
export function kick({ punch = 1 } = {}) {
  const x = buf(0.5);
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    const f = 45 + 110 * Math.exp(-t * 28) * punch;
    ph += (TAU * f) / SR;
    const env = Math.exp(-t * 7.5);
    const click = t < 0.004 ? (1 - t / 0.004) * 0.5 : 0;
    x[i] = Math.tanh(1.6 * Math.sin(ph) * env) + click;
  }
  return x;
}

export function snare(seed = 1) {
  const r = rng(seed), x = buf(0.32);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    x[i] = (r() * 2 - 1) * Math.exp(-t * 16) * 0.9 + Math.sin(TAU * 190 * t) * Math.exp(-t * 30) * 0.5;
  }
  return svf(x, 3800, 0.8, 'bp').map((v, i) => v * 1.6 + x[i] * 0.25);
}

export function clap(seed = 2) {
  const r = rng(seed), x = buf(0.3);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    // three quick bursts then a tail: the classic hand-clap shape
    const bursts = [0, 0.011, 0.022].reduce((a, o) => a + (t >= o ? Math.exp(-(t - o) * 180) : 0), 0);
    x[i] = (r() * 2 - 1) * (bursts * 0.8 + Math.exp(-t * 14) * 0.5);
  }
  return svf(x, 1600, 1.2, 'bp').map((v) => v * 2.2);
}

export function hat(seed = 3, open = false) {
  const r = rng(seed), x = buf(open ? 0.28 : 0.06);
  const k = open ? 12 : 70;
  for (let i = 0; i < x.length; i++) x[i] = (r() * 2 - 1) * Math.exp((-i / SR) * k);
  return svf(x, 9000, 0.7, 'hp').map((v) => v * 0.5);
}

// ---------- tonal ----------
// Detuned-saw bass through a lowpass with a plucky filter envelope.
export function bass(freq, dur, { cutoff = 900 } = {}) {
  const x = buf(dur + 0.05);
  let p1 = 0, p2 = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    p1 = (p1 + freq / SR) % 1;
    p2 = (p2 + (freq * 1.004) / SR) % 1;
    const saw = (p1 * 2 - 1) * 0.5 + (p2 * 2 - 1) * 0.5;
    const sub = Math.sin(TAU * p1) * 0.8;
    const env = Math.min(1, t / 0.004) * (t < dur ? 1 : Math.exp(-(t - dur) * 60));
    x[i] = (saw * 0.6 + sub) * env;
  }
  return svf(x, (t) => 120 + cutoff * Math.exp(-t * 9), 0.9, 'lp');
}

export function pad(freqs, dur, { bright = 1600 } = {}) {
  const x = buf(dur + 0.6);
  const ph = freqs.flatMap((f) => [0, 0.33, 0.66].map((o) => ({ f: f * (1 + (o - 0.33) * 0.012), p: o })));
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    let s = 0;
    for (const v of ph) { v.p = (v.p + v.f / SR) % 1; s += v.p * 2 - 1; }
    const env = Math.min(1, t / 0.35) * (t < dur ? 1 : Math.exp(-(t - dur) * 5));
    x[i] = (s / ph.length) * env;
  }
  return svf(x, (t) => bright + 400 * Math.sin(t * 1.3), 0.6, 'lp');
}

export function pluck(freq, dur = 0.4, { bright = 1 } = {}) {
  const x = buf(dur);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    const env = Math.exp(-t * 9);
    x[i] = (Math.sin(TAU * freq * t) + 0.5 * bright * Math.sin(TAU * 2 * freq * t) * Math.exp(-t * 20)
      + 0.25 * Math.sin(TAU * 3 * freq * t) * Math.exp(-t * 35)) * env * Math.min(1, t / 0.002);
  }
  return x;
}

// ---------- sound effects ----------
export function whoosh(dur = 0.5, seed = 4, { up = true, lo = 300, hi = 6000 } = {}) {
  const r = rng(seed), x = buf(dur);
  for (let i = 0; i < x.length; i++) {
    const p = i / x.length;
    const env = Math.sin(Math.PI * Math.pow(up ? p : 1 - p, up ? 1.6 : 0.6));
    x[i] = (r() * 2 - 1) * env;
  }
  return svf(x, (t) => {
    const p = t / dur;
    return up ? lo * Math.pow(hi / lo, p) : hi * Math.pow(lo / hi, p);
  }, 2.2, 'bp').map((v) => v * 1.4);
}

export function riser(dur = 2, seed = 5) {
  const r = rng(seed), x = buf(dur);
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const p = i / x.length;
    ph += (TAU * (200 + 900 * p * p)) / SR;
    x[i] = ((r() * 2 - 1) * 0.6 + Math.sin(ph) * 0.25) * p * p;
  }
  return svf(x, (t) => 400 + 7000 * Math.pow(t / dur, 2), 1.4, 'bp').map((v) => v * 1.5);
}

export function click() {
  const x = buf(0.03);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    x[i] = Math.sin(TAU * 2400 * t) * Math.exp(-t * 400) + Math.sin(TAU * 900 * t) * Math.exp(-t * 250) * 0.6;
  }
  return x;
}

export function tick(seed = 6) {
  const r = rng(seed), x = buf(0.02);
  for (let i = 0; i < x.length; i++) x[i] = (r() * 2 - 1) * Math.exp((-i / SR) * 500) * 0.6;
  return svf(x, 5000, 1.5, 'bp').map((v) => v * 2);
}

export function pop(freq = 700) {
  const x = buf(0.12);
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    ph += (TAU * freq * (1 + 1.5 * Math.exp(-t * 60))) / SR;
    x[i] = Math.sin(ph) * Math.exp(-t * 38);
  }
  return x;
}

export function thump() {
  const x = buf(0.4);
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    ph += (TAU * (38 + 70 * Math.exp(-t * 18))) / SR;
    x[i] = Math.tanh(2.2 * Math.sin(ph) * Math.exp(-t * 6));
  }
  return x;
}

export function impact(seed = 7) {
  const k = thump(), r = rng(seed), x = buf(1.4);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    x[i] = (i < k.length ? k[i] : 0) + (r() * 2 - 1) * Math.exp(-t * 3.2) * 0.35;
  }
  return svf(x, (t) => 9000 * Math.exp(-t * 2.5) + 200, 0.7, 'lp');
}

// ---------- mixing ----------
export class Mix {
  constructor(seconds) {
    this.L = new Float32Array(Math.ceil(seconds * SR));
    this.R = new Float32Array(Math.ceil(seconds * SR));
    this.duck = new Float32Array(this.L.length).fill(1);
    this.cues = [];
  }

  // Place a voice at time t (seconds). pan -1..1. ducked voices pump under the kick.
  add(x, t, gain = 1, pan = 0, { ducked = false, label } = {}) {
    const s = Math.round(t * SR);
    const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4) * Math.SQRT2;
    const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4) * Math.SQRT2;
    const tgt = ducked ? (this.pumped ||= { L: new Float32Array(this.L.length), R: new Float32Array(this.L.length) }) : this;
    for (let i = 0; i < x.length; i++) {
      const j = s + i;
      if (j < 0 || j >= this.L.length) continue;
      tgt.L[j] += x[i] * gl;
      tgt.R[j] += x[i] * gr;
    }
    if (label) this.cues.push({ t: +t.toFixed(3), label });
    return this;
  }

  // Sidechain: dip the ducked bus at each time in `times`.
  sidechain(times, depth = 0.6, release = 0.18) {
    for (const t of times) {
      const s = Math.round(t * SR), n = Math.round(release * 4 * SR);
      for (let i = 0; i < n && s + i < this.duck.length; i++) {
        const g = 1 - depth * Math.exp(-(i / SR) / release);
        this.duck[s + i] = Math.min(this.duck[s + i], g);
      }
    }
    return this;
  }

  // Fade the master out over the last `sec` seconds (no click at the end).
  render(fadeOut = 0.08) {
    const n = this.L.length, L = new Float32Array(n), R = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const d = this.pumped ? this.duck[i] : 1;
      const tail = Math.min(1, (n - i) / (fadeOut * SR));
      L[i] = Math.tanh((this.L[i] + (this.pumped ? this.pumped.L[i] * d : 0)) * 0.9) * tail;
      R[i] = Math.tanh((this.R[i] + (this.pumped ? this.pumped.R[i] * d : 0)) * 0.9) * tail;
    }
    return { L, R };
  }
}

export function writeWav(file, { L, R }) {
  const n = L.length, data = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), i * 4);
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), i * 4 + 2);
  }
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8);
  h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22);
  h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34);
  h.write('data', 36); h.writeUInt32LE(data.length, 40);
  writeFileSync(file, Buffer.concat([h, data]));
}
