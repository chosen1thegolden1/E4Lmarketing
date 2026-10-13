// node films/e4l-ai-audit/prep-assets.mjs
// Crops the real E4L audit UI into ./assets. Everything here comes from E4L's own audit of itself
// (geo/audits/eat-4-life-marketing/2026-08-14-3), never from a lead's audit.
// Competitor names in the AI answers are blurred: the ad shouldn't advertise other agencies.
import { chromium } from 'playwright';
import { writeFileSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = resolve(fileURLToPath(new URL('.', import.meta.url)));
const REPO = resolve(HERE, '../../..');
const AUDIT = join(REPO, 'geo/audits/eat-4-life-marketing/2026-08-14-3');
const ASSETS = join(HERE, 'assets');
const font = (f) => 'data:font/woff2;base64,' + readFileSync(join(ASSETS, f)).toString('base64');

const browser = await chromium.launch();

// 1. Report crops, rendered at 3x with the report's intended fonts (Rethink Sans + Space Mono).
{
  const page = await browser.newPage({ viewport: { width: 720, height: 1400 }, deviceScaleFactor: 3 });
  await page.goto('file://' + join(AUDIT, 'report.html'));
  await page.addStyleTag({ content: `
    @font-face { font-family: 'Rethink Sans'; src: url(${font('RethinkSans.woff2')}); font-weight: 100 900; }
    @font-face { font-family: 'Space Mono'; src: url(${font('SpaceMono-400.woff2')}); font-weight: 400; }
    @font-face { font-family: 'Space Mono'; src: url(${font('SpaceMono-700.woff2')}); font-weight: 700; }
    header { margin-bottom: 0 !important; }` });
  await page.evaluate(() => document.fonts.ready);
  await page.locator('header').screenshot({ path: join(ASSETS, 'report-header.png') });
  // The question-by-question table: the 7 money questions x 3 platforms.
  await page.locator('table').first().screenshot({ path: join(ASSETS, 'report-table.png') });
  await page.close();
}

// 2. Receipts: real answer screenshots, question bubble kept sharp, answer text blurred.
async function receipt(src, out, crop, sharpH) {
  const page = await browser.newPage();
  const data = 'data:image/jpeg;base64,' + readFileSync(join(AUDIT, 'screenshots', src)).toString('base64');
  const png = await page.evaluate(async ({ data, crop, sharpH }) => {
    const im = new Image();
    im.src = data;
    await im.decode();
    const [x, y, w, h] = crop;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d');
    g.fillStyle = '#fff';
    g.fillRect(0, 0, w, h);
    g.filter = 'blur(7px)';
    g.drawImage(im, x, y + sharpH, w, h - sharpH, 0, sharpH, w, h - sharpH);
    g.filter = 'none';
    g.drawImage(im, x, y, w, sharpH, 0, 0, w, sharpH);
    return c.toDataURL('image/png').slice(22);
  }, { data, crop, sharpH });
  writeFileSync(join(ASSETS, out), Buffer.from(png, 'base64'));
  await page.close();
}
await receipt('eat-4-life-marketing_chatgpt_q2_2026-08-14.jpg', 'receipt-chatgpt.png', [446, 50, 808, 1200], 82);
await receipt('eat-4-life-marketing_gemini_q2_2026-08-14.jpg', 'receipt-gemini.png', [380, 120, 740, 1200], 100);

// 3. Sprite of all 14 real ChatGPT + Gemini receipts (7 questions each), 7 x 2 tiles of 300 x 390.
//    (The Perplexity captures in this audit hit a sign-in wall, so they are left out.)
{
  const page = await browser.newPage();
  const files = [];
  for (const p of ['chatgpt', 'gemini']) for (let q = 1; q <= 7; q++) {
    files.push({ p, data: 'data:image/jpeg;base64,' + readFileSync(join(AUDIT, 'screenshots', `eat-4-life-marketing_${p}_q${q}_2026-08-14.jpg`)).toString('base64') });
  }
  const png = await page.evaluate(async (files) => {
    const TW = 300, TH = 390, c = document.createElement('canvas');
    c.width = TW * 7; c.height = TH * 2;
    const g = c.getContext('2d');
    for (let i = 0; i < files.length; i++) {
      const im = new Image();
      im.src = files[i].data;
      await im.decode();
      const crop = files[i].p === 'chatgpt' ? [446, 50, 808, 1050] : [380, 120, 740, 962];
      const x = (i % 7) * TW, y = Math.floor(i / 7) * TH;
      g.save();
      g.beginPath(); g.rect(x, y, TW, TH); g.clip();
      g.filter = 'blur(2.5px)';
      g.drawImage(im, crop[0], crop[1], crop[2], crop[3], x, y, TW, TH);
      g.restore();
    }
    return c.toDataURL('image/png').slice(22);
  }, files);
  writeFileSync(join(ASSETS, 'receipts-sprite.png'), Buffer.from(png, 'base64'));
  await page.close();
}

await browser.close();
console.log('assets written to ' + ASSETS);
