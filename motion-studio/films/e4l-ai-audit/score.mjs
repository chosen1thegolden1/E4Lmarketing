// Original score for the E4L AI Audit reel, synthesized in code. 120 BPM, A minor, 18 s.
// Every sound effect is placed on the same grid the film animates on (see docs/shotlist.md).
import { Mix, kick, clap, hat, bass, pad, pluck, whoosh, riser, click, tick, pop, thump, impact, midi } from '../../lib/synth.mjs';
import { spring } from '../../lib/motion.js';

export const meta = { bpm: 120, duration: 18 };
const SPB = 60 / meta.bpm;
const beat = (n) => n * SPB;

// Am - F - C - G, one chord per bar (2 s).
const CHORDS = [
  { root: 33, pad: [57, 60, 64] },
  { root: 29, pad: [53, 57, 60] },
  { root: 36, pad: [55, 60, 64] },
  { root: 31, pad: [55, 59, 62] }
];
const chordAt = (bar) => CHORDS[bar % 4];

export default function score() {
  const m = new Mix(meta.duration);
  const K = kick(), Kp = kick({ punch: 1.4 }), CL = clap(), HH = hat(3), OH = hat(9, true), TH = thump();
  const kicks = [];

  // ---- bar 0: the hook. One hit per word, sub boom on "AI." ----
  for (let i = 0; i < 3; i++) {
    m.add(Kp, beat(i), 0.95, 0, { label: 'word slam' });
    m.add(TH, beat(i), 0.5);
    kicks.push(beat(i));
  }
  m.add(impact(11), beat(3), 0.85, 0, { label: '"AI." slam' });
  kicks.push(beat(3));
  m.add(pad(CHORDS[0].pad.map(midi), 2), 0, 0.12, 0, { ducked: true });
  m.add(whoosh(0.22, 21, { up: true, lo: 800, hi: 7000 }), 1.44 - 0.12, 0.3, -0.3, { label: 'gold wipe' });
  m.add(whoosh(0.4, 22), 2 - 0.4, 0.35, 0.3, { label: 'morph -> pill' });

  // ---- bars 1-7: the groove ----
  for (let bar = 1; bar < 8; bar++) {
    const t0 = bar * 2, ch = chordAt(bar);
    const build = bar >= 3;
    for (let b = 0; b < 4; b++) {
      const t = t0 + beat(b);
      m.add(K, t, 0.9);
      kicks.push(t);
      if (b % 2 === 1) m.add(CL, t, 0.4, 0.05);
      m.add(b === 3 && bar % 2 ? OH : HH, t + SPB / 2, 0.16, 0.25);
      if (build) m.add(HH, t + SPB / 4, 0.07, -0.25), m.add(HH, t + (3 * SPB) / 4, 0.07, -0.25);
      // Eighth-note bass, octave jump on the "and" of beat 4.
      for (let e = 0; e < 2; e++) {
        const n = ch.root + (b === 3 && e === 1 ? 12 : 0);
        m.add(bass(midi(n), SPB / 2 - 0.03), t + e * SPB / 2, 0.42, 0, { ducked: true });
      }
    }
    m.add(pad(ch.pad.map(midi), 2), t0, 0.16, 0, { ducked: true });
    if (build) {
      // Sixteenth-note pluck arpeggio, up an octave, quiet.
      const notes = [...ch.pad, ch.pad[0] + 12].map((n) => n + 12);
      for (let s = 0; s < 16; s++) m.add(pluck(midi(notes[(s * 3) % 4]), 0.25), t0 + s * SPB / 4, 0.07, s % 2 ? 0.4 : -0.4, { ducked: true });
    }
  }

  // ---- bar 1: typing and the send click ----
  for (let i = 0; i < 4; i++) {
    const start = 2.1 + i * 0.5;
    for (let c = 0; c < 9; c++) m.add(tick(100 + i * 10 + c), start + c * 0.031, 0.28, 0.2);
  }
  m.add(click(), 3.75, 0.6, 0.2, { label: 'send click' });
  m.add(whoosh(0.4, 31), 4 - 0.4, 0.35, -0.2, { label: 'morph -> answer card' });

  // ---- bar 2: Gemini card slides over ----
  m.add(whoosh(0.3, 41, { up: false, lo: 400, hi: 5000 }), 5 - 0.12, 0.3, 0.5);
  m.add(pop(620), 5, 0.3, 0.5, { label: 'gemini card lands' });
  m.add(whoosh(0.4, 42), 6 - 0.4, 0.35, 0, { label: 'morph -> report' });

  // ---- bar 3: row scan, one pop per row on 8ths, rising ----
  const scale = [69, 72, 74, 76, 79, 81, 84];
  for (let i = 0; i < 7; i++) m.add(pop(midi(scale[i])), 6 + i * 0.25, 0.22, -0.1, { label: i === 0 ? 'row scan' : undefined });

  // ---- bar 4: camera push, one pop per platform column ----
  m.add(whoosh(0.5, 51, { up: true, lo: 200, hi: 3000 }), 8 - 0.35, 0.3, 0, { label: 'camera push' });
  for (let i = 0; i < 3; i++) m.add(pop(midi(81 + i * 3)), 8 + i * 0.5, 0.3, i - 1, { label: i === 0 ? 'column scan' : undefined });
  m.add(whoosh(0.4, 52), 10 - 0.4, 0.35, 0, { label: 'morph -> receipts' });

  // ---- bar 5: receipts pop in on 16ths, cursor picks one, riser into the metric ----
  for (let i = 0; i < 14; i++) m.add(tick(200 + i), 10 + i * 0.0625, 0.3, ((i % 4) - 1.5) / 2);
  m.add(click(), 11, 0.6, 0, { label: 'receipt pick' });
  m.add(pop(520), 11.02, 0.25);
  m.add(riser(2, 61), 10, 0.4, 0, { label: 'riser' });
  for (let s = 0; s < 8; s++) m.add(clap(70 + s), 11 + s * SPB / 4, 0.12 + s * 0.03, 0);

  // ---- bar 6: the metric. Impact on the downbeat, a tick on every count step ----
  m.add(impact(81), 12, 0.95, 0, { label: 'gold takeover' });
  let last = 0;
  for (let t = 12; t < 13.2; t += 1 / 240) {
    const n = Math.round(21 * spring(t - 12, 60, 2 * Math.sqrt(60)) + 0.0001);
    if (n !== last) { m.add(tick(300 + n), t, 0.3, 0); last = n; }
  }
  m.add(whoosh(0.4, 62, { up: false }), 14 - 0.3, 0.35, 0);

  // ---- bars 7-8: lockup, CTA press, final chord ----
  m.add(impact(91), 14, 0.7, 0, { label: 'lockup' });
  m.add(click(), 16, 0.65, 0.2, { label: 'CTA press' });
  m.add(Kp, 16, 0.9);
  kicks.push(16);
  m.add(pad(CHORDS[0].pad.map(midi), 1.6, { bright: 2400 }), 16, 0.3, 0, { label: 'final chord' });
  m.add(bass(midi(33), 1.2), 16, 0.45);
  for (const [i, n] of [69, 72, 76, 81].entries()) m.add(pluck(midi(n), 1.2), 16 + i * SPB / 4, 0.12, i % 2 ? 0.4 : -0.4);

  m.sidechain(kicks, 0.55, 0.16);
  return m;
}
