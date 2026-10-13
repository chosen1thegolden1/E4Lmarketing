// Shared Node plumbing for render.mjs / stills.mjs: CLI args, a static server, and a page
// that is loaded, sized and ready to seek.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

export const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

export const SIZES = { '9:16': [1080, 1920], '1:1': [1080, 1080], '16:9': [1920, 1080] };

export function args(argv = process.argv.slice(2)) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2), v = argv[i + 1];
      if (v === undefined || v.startsWith('--')) out[k] = true;
      else { out[k] = isNaN(Number(v)) ? v : Number(v); i++; }
    } else out._.push(a);
  }
  return out;
}

export function filmDir(p) {
  if (!p) throw new Error('usage: node <script> films/<name> [options]');
  const dir = resolve(p);
  const rel = relative(ROOT, dir);
  if (rel.startsWith('..')) throw new Error('film must live inside ' + ROOT);
  return { dir, rel: rel.split(sep).join('/') };
}

const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.css': 'text/css', '.wav': 'audio/wav'
};

// ES modules don't load over file://, so films are served from the studio root on localhost.
export function serve() {
  const server = createServer(async (req, res) => {
    try {
      const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const file = join(ROOT, path);
      if (!file.startsWith(ROOT)) throw new Error('outside root');
      const s = await stat(file);
      const body = await readFile(s.isDirectory() ? join(file, 'index.html') : file);
      res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404); res.end('not found');
    }
  });
  return new Promise((r) => server.listen(0, '127.0.0.1', () => r({ server, port: server.address().port })));
}

// Open a film at a given format and wait until fonts/images are in.
export async function openFilm(rel, { format = '9:16', scale = 1 } = {}) {
  const [w, h] = SIZES[format] || SIZES['9:16'];
  const { server, port } = await serve();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(`http://127.0.0.1:${port}/${rel}/index.html?format=${encodeURIComponent(format)}&render=1`);
  await page.waitForFunction(() => window.ready && window.FILM, null, { timeout: 30000 });
  await page.evaluate(() => window.ready);
  await page.evaluate(() => document.fonts.ready);
  if (errors.length) throw new Error('film errors:\n' + errors.join('\n'));
  const film = await page.evaluate(() => ({ duration: window.FILM.duration, bpm: window.FILM.bpm, beats: window.FILM.beats || [] }));
  const close = async () => { await browser.close(); server.close(); };
  return { page, film, w, h, close, errors };
}

// Grab the canvas as PNG bytes. toDataURL avoids a full compositor screenshot per frame.
export async function grab(page) {
  const b64 = await page.evaluate(() => document.getElementById('c').toDataURL('image/png').slice(22));
  return Buffer.from(b64, 'base64');
}

export const fmtTag = (f) => f.replace(':', 'x');
