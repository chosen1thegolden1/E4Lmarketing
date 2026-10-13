// Render contract (CLAUDE.md): every film is a pure function of time.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, openFilm, grab } from '../lib/studio.mjs';

const films = readdirSync(join(ROOT, 'films')).filter((f) => existsSync(join(ROOT, 'films', f, 'film.js')));

for (const f of films) {
  test(`${f}: no randomness or timers in film code`, () => {
    const src = readFileSync(join(ROOT, 'films', f, 'film.js'), 'utf8');
    for (const banned of ['Math.random', 'setTimeout', 'setInterval', 'requestAnimationFrame', 'Date.now', 'performance.now']) {
      assert.ok(!src.includes(banned), `${f}/film.js uses ${banned}`);
    }
  });

  test(`${f}: seek(t) paints the same frame whatever was drawn before`, async () => {
    const { page, film, close } = await openFilm(`films/${f}`, { format: '9:16' });
    try {
      assert.ok(film.duration > 0 && film.bpm > 0);
      const ts = [0.37, film.duration * 0.5, film.duration - 0.2];
      const forward = [];
      for (const t of ts) { await page.evaluate((x) => window.seek(x), t); forward.push(await grab(page)); }
      for (const [i, t] of [...ts.entries()].reverse()) {
        await page.evaluate((x) => window.seek(x), t);
        assert.ok(forward[i].equals(await grab(page)), `frame at ${t}s differs on re-seek`);
      }
    } finally {
      await close();
    }
  });
}
