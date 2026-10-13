// node stills.mjs films/<name> [--format 9:16] [--at 0.5,2,4.25] [--every 0.5] [--strip 4.2]
// Review frames without a full render.
//   default : one frame per shot-list beat (window.FILM.beats) -> out/contact.png + out/phone.png
//   --at    : specific times
//   --every : one frame every N seconds
//   --strip : 12 consecutive frames (60 fps) starting at t -> out/strip.png, to catch glitches
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { args, filmDir, openFilm, grab, fmtTag } from './lib/studio.mjs';

const a = args();
const { dir, rel } = filmDir(a._[0]);
const format = a.format || '9:16';
const { page, film, w, h, close } = await openFilm(rel, { format });

let times;
let mode = 'contact';
if (a.strip !== undefined) {
  mode = 'strip';
  times = Array.from({ length: 12 }, (_, i) => +(a.strip + i / 60).toFixed(4));
} else if (a.at) {
  times = String(a.at).split(',').map(Number);
} else if (a.every) {
  times = [];
  for (let t = 0; t < film.duration; t += a.every) times.push(+t.toFixed(3));
} else {
  times = film.beats.length ? film.beats : [0, film.duration / 2, film.duration - 0.05];
}

const stillDir = join(dir, 'out', 'stills');
rmSync(stillDir, { recursive: true, force: true });
mkdirSync(stillDir, { recursive: true });
for (let i = 0; i < times.length; i++) {
  await page.evaluate((t) => window.seek(t), times[i]);
  writeFileSync(join(stillDir, `s_${String(i).padStart(3, '0')}.png`), await grab(page));
}
await close();

// Tile with ffmpeg. Labels are written under each tile by drawtext only if fonts are available,
// so keep it simple: tiles in time order, left to right, top to bottom.
const tag = fmtTag(format);
const cols = mode === 'strip' ? 12 : Math.min(6, times.length);
const rows = Math.ceil(times.length / cols);
const tile = (scaleW, file) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '1',
  '-i', join(stillDir, 's_%03d.png'), '-vf', `scale=${scaleW}:-1,tile=${cols}x${rows}:padding=6:color=0x222222`,
  '-frames:v', '1', join(dir, 'out', file)]);

if (mode === 'strip') {
  tile(320, `strip_${tag}.png`);
  console.log(`wrote out/strip_${tag}.png (${times[0]}s +12 frames)`);
} else {
  tile(w > h ? 480 : 270, `contact_${tag}.png`);
  tile(360, `phone_${tag}.png`);
  console.log(`wrote out/contact_${tag}.png and out/phone_${tag}.png`);
  console.log('frames at: ' + times.map((t) => t + 's').join(', '));
}
