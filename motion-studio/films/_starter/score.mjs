// Starter score: four-on-the-floor at 120 BPM with a bass line and one hit per state change.
import { Mix, kick, clap, hat, bass, pad, whoosh, impact, midi } from '../../lib/synth.mjs';

export const meta = { bpm: 120, duration: 8 };
const SPB = 60 / meta.bpm;

export default function score() {
  const m = new Mix(meta.duration);
  const K = kick(), CL = clap(), HH = hat();
  const roots = [33, 29, 36, 31]; // Am F C G
  const kicks = [];
  for (let b = 0; b < 16; b++) {
    const t = b * SPB;
    m.add(K, t, 0.9);
    kicks.push(t);
    if (b % 2 === 1) m.add(CL, t, 0.4);
    m.add(HH, t + SPB / 2, 0.15, 0.2);
    m.add(bass(midi(roots[Math.floor(b / 4) % 4]), SPB - 0.05), t, 0.4, 0, { ducked: true });
  }
  for (let bar = 0; bar < 4; bar++) m.add(pad([57, 60, 64].map(midi), 2), bar * 2, 0.15, 0, { ducked: true });
  // A whoosh into each state change, an impact on it (state changes at bar 1.5 and bar 3).
  for (const t of [3, 6]) {
    m.add(whoosh(0.4), t - 0.4, 0.35, 0, { label: 'morph' });
    m.add(impact(), t, 0.6, 0, { label: 'state change' });
  }
  m.sidechain(kicks);
  return m;
}
