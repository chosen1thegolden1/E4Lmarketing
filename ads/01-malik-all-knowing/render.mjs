// Renders every ad size to PNG. Run: node render.mjs   (needs Playwright + Chromium)
const { chromium } = await import(process.env.PW_PATH ? process.env.PW_PATH + '/index.mjs' : 'playwright');
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const here = path.dirname(new URL(import.meta.url).pathname);
const out = path.join(here, 'export');
fs.mkdirSync(out, { recursive: true });
const sizes = { feed: 1350, square: 1080, story: 1920 };
const hero = process.argv[2] || 'm2';

const browser = await chromium.launch();
for (const [fmt, h] of Object.entries(sizes)) {
  for (const logos of ['1', '0']) {
    const page = await browser.newPage({ viewport: { width: 1080, height: h } });
    const url = pathToFileURL(path.join(here, 'ad.html')).href + `?fmt=${fmt}&logos=${logos}&hero=${hero}`;
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const name = `malik-99-problems_${fmt}${logos === '0' ? '_no-logos' : ''}.png`;
    await page.locator('#ad').screenshot({ path: path.join(out, name) });
    console.log('wrote', name);
    await page.close();
  }
}
await browser.close();
