// node sound.mjs films/<name>
// 1. Builds the soundtrack from films/<name>/score.mjs (or uses films/<name>/audio/track.wav as-is).
// 2. Masters it to -14 LUFS / -1 dBTP with a two-pass loudnorm.
// 3. Muxes it onto every out/silent_<fmt>.mp4 -> out/final_<fmt>.mp4 (9:16 also copied to out/final.mp4).
// 4. If librosa is installed, measures the beats of the final mix and checks them against FILM.bpm.
import { existsSync, readdirSync, copyFileSync, writeFileSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { args, filmDir, ROOT } from './lib/studio.mjs';
import { writeWav } from './lib/synth.mjs';

const a = args();
const { dir } = filmDir(a._[0]);
const out = join(dir, 'out');
const raw = join(out, 'music_raw.wav');
const mixed = join(out, 'mix.wav');
const track = join(dir, 'audio', 'track.wav');

let meta = {};
if (existsSync(track)) {
  copyFileSync(track, raw);
  console.log('using supplied track ' + track);
} else {
  const score = await import(pathToFileURL(join(dir, 'score.mjs')).href);
  const mix = score.default();
  meta = score.meta || {};
  writeWav(raw, mix.render());
  writeFileSync(join(dir, 'docs', 'cues.json'), JSON.stringify(mix.cues.sort((x, y) => x.t - y.t), null, 1));
  console.log(`synthesized ${raw} (${mix.cues.length} cues -> docs/cues.json)`);
}

// Two-pass loudnorm: measure, then apply with the measured values (linear, accurate).
const ff = (argv) => spawnSync('ffmpeg', ['-hide_banner', '-nostats', ...argv], { encoding: 'utf8' });
const m = ff(['-i', raw, '-af', 'loudnorm=I=-14:TP=-1:LRA=9:print_format=json', '-f', 'null', '-']).stderr;
const j = JSON.parse(m.slice(m.lastIndexOf('{'), m.lastIndexOf('}') + 1));
ff(['-y', '-i', raw, '-af',
  `loudnorm=I=-14:TP=-1:LRA=9:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true`,
  '-ar', '48000', mixed]);
const check = ff(['-i', mixed, '-af', 'loudnorm=print_format=json', '-f', 'null', '-']).stderr;
const cj = JSON.parse(check.slice(check.lastIndexOf('{'), check.lastIndexOf('}') + 1));
console.log(`mastered ${mixed}: ${cj.input_i} LUFS, ${cj.input_tp} dBTP`);

const silents = readdirSync(out).filter((f) => /^silent_.*\.mp4$/.test(f));
for (const s of silents) {
  const tag = s.slice(7, -4);
  const dest = join(out, `final_${tag}.mp4`);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', join(out, s), '-i', mixed, '-map', '0:v', '-map', '1:a',
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-shortest', '-movflags', '+faststart', dest]);
  if (tag === '9x16') copyFileSync(dest, join(out, 'final.mp4'));
  console.log('wrote ' + dest);
}
if (!silents.length) console.log('no out/silent_*.mp4 yet: run node render.mjs first, then re-run this.');

// Sync check against the film's own grid.
const py = spawnSync('python3', [join(ROOT, 'beats.py'), mixed], { encoding: 'utf8' });
if (py.status === 0) {
  writeFileSync(join(out, 'beats_measured.json'), py.stdout);
  const b = JSON.parse(py.stdout);
  const bpm = meta.bpm;
  const drift = bpm ? b.beats.map((t) => { const g = 60 / bpm; return Math.abs(t - Math.round(t / g) * g); }) : [];
  const worst = drift.length ? Math.max(...drift) : 0;
  console.log(`measured ${b.bpm.toFixed(1)} BPM, ${b.beats.length} beats` + (bpm ? `; worst offset from the ${bpm} BPM grid: ${(worst * 1000).toFixed(0)} ms` : ''));
} else {
  console.log('beats.py skipped (pip install numpy librosa soundfile to enable the sync check)');
}
