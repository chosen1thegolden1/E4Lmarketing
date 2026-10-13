// node render.mjs films/<name> [--format 9:16|1:1|16:9|all] [--fps 60] [--sub 4] [--dur <s>]
//                               [--from <s>] [--to <s>] [--draft]
// Steps through time, calls window.seek(t), grabs the canvas, and pipes PNGs into ffmpeg.
// --sub renders N subframes per frame and blends them: real motion blur.
// --from/--to re-render only part of the film (out/part_<from>-<to>_<fmt>.mp4).
// --draft = 30 fps, no subframes: fast pacing checks.
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { args, filmDir, openFilm, grab, fmtTag, SIZES } from './lib/studio.mjs';

const a = args();
const { dir, rel } = filmDir(a._[0]);
const FPS = a.draft ? 30 : a.fps || 60;
const SUB = a.draft ? 1 : a.sub || 4;
const formats = a.format === 'all' ? Object.keys(SIZES) : [a.format || '9:16'];
const outDir = join(dir, 'out');
mkdirSync(outDir, { recursive: true });

for (const format of formats) {
  const { page, film, close } = await openFilm(rel, { format });
  const DUR = a.dur || film.duration;
  const from = a.from || 0, to = a.to || DUR;
  const part = a.from !== undefined || a.to !== undefined;
  const name = part ? `part_${from}-${to}_${fmtTag(format)}.mp4` : `silent_${fmtTag(format)}.mp4`;
  const outFile = join(outDir, name);

  // Blend SUB subframes into one output frame (tmix), keep every SUB-th blended frame.
  const vf = SUB > 1
    ? `tmix=frames=${SUB},select='eq(mod(n\\,${SUB})\\,${SUB - 1})',setpts=N/${FPS}/TB`
    : `setpts=N/${FPS}/TB`;
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS * SUB), '-i', '-',
    '-vf', vf, '-r', String(FPS), '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', outFile], { stdio: ['pipe', 'inherit', 'inherit'] });

  const t0 = Date.now();
  const first = Math.round(from * FPS * SUB), last = Math.round(to * FPS * SUB);
  for (let i = first; i < last; i++) {
    await page.evaluate((t) => window.seek(t), i / (FPS * SUB));
    const png = await grab(page);
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % (FPS * SUB) === 0) {
      const s = i / (FPS * SUB), el = (Date.now() - t0) / 1000;
      process.stdout.write(`[${format}] rendered ${s}s / ${to}s  (${el.toFixed(0)}s elapsed)\n`);
    }
  }
  ff.stdin.end();
  const code = await new Promise((r) => ff.on('close', r));
  await close();
  if (code !== 0) throw new Error('ffmpeg exited with ' + code);
  console.log(`[${format}] wrote ${outFile} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
