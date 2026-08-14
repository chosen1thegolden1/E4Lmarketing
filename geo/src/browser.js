// Browser adapters for the GEO audit: ask one question on ChatGPT, Gemini,
// or Perplexity in a logged-out session and capture the answer + screenshot.
//
// Session hygiene per the brief: every question gets a FRESH browser context
// (new cookies/storage — no history, no personalization from prior asks).
//
// Environment notes (Claude Code remote container):
// - Outbound HTTPS goes through the agent proxy (HTTPS_PROXY). Chromium's
//   TLS 1.3 handshake is reset by the egress terminator, so we cap at
//   TLS 1.2 (--ssl-version-max=tls1.2). Certificates are still fully
//   verified against the proxy CA in the NSS store.
// - Chromium binary comes from PLAYWRIGHT_BROWSERS_PATH (/opt/pw-browsers).

import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

// Prefer an explicitly provided binary, then the container's pre-installed
// Chromium (its version may not match this Playwright's registry), then
// whatever Playwright itself has installed.
function chromiumPath() {
  if (process.env.GEO_CHROMIUM_PATH) return process.env.GEO_CHROMIUM_PATH;
  if (existsSync('/opt/pw-browsers/chromium')) return '/opt/pw-browsers/chromium';
  return undefined;
}

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const DISMISS_TEXTS = [
  'Stay logged out', 'No thanks', 'Got it', 'Accept all', 'I agree',
  'Reject all', 'Maybe later', 'Not now', 'Okay',
];

export async function launchBrowser() {
  const args = ['--no-sandbox', '--disable-blink-features=AutomationControlled'];
  if (process.env.HTTPS_PROXY) args.push('--ssl-version-max=tls1.2');
  return chromium.launch({
    executablePath: chromiumPath(),
    headless: true,
    args,
    ...(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {}),
  });
}

async function freshPage(browser) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1600 },
    userAgent: UA,
    locale: 'en-US',
    timezoneId: 'America/Los_Angeles',
  });
  return { ctx, page: await ctx.newPage() };
}

async function dismissDialogs(page) {
  for (const t of DISMISS_TEXTS) {
    const btn = page.locator(`button:has-text("${t}")`).first();
    if (await btn.isVisible().catch(() => false)) {
      await btn.click().catch(() => {});
      await page.waitForTimeout(600);
    }
  }
  await page.keyboard.press('Escape').catch(() => {});
}

// Google One Tap / sign-in iframes hijack focus on Perplexity — remove them.
async function killGoogleOneTap(page) {
  await page
    .evaluate(() => {
      document
        .querySelectorAll('iframe[src*="accounts.google.com"], #credential_picker_container')
        .forEach((el) => el.remove());
    })
    .catch(() => {});
}

// Poll until the watched element's text stops changing (answer finished
// streaming), then return it.
async function waitStable(page, selector, { timeout = 150000, stableFor = 7000, minChars = 40 } = {}) {
  const start = Date.now();
  let last = '';
  let lastChange = Date.now();
  while (Date.now() - start < timeout) {
    const text = await page.locator(selector).last().innerText().catch(() => '');
    if (text !== last) {
      last = text;
      lastChange = Date.now();
    } else if (text.length >= minChars && Date.now() - lastChange > stableFor) {
      return text;
    }
    await page.waitForTimeout(1000);
  }
  if (!last) throw new Error(`no answer text appeared in ${selector}`);
  return last; // timed out but has content — return what we saw
}

async function assertNotBlocked(page) {
  const body = await page.locator('body').innerText().catch(() => '');
  if (/verify you are human|unusual activity|are you a robot|access denied/i.test(body.slice(0, 2000))) {
    throw new Error('bot challenge page');
  }
}

const PLATFORMS = {
  chatgpt: {
    label: 'ChatGPT',
    async ask(page, question) {
      await page.goto('https://chatgpt.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(4000);
      await assertNotBlocked(page);
      await dismissDialogs(page);
      const editor = page.locator('#prompt-textarea');
      await editor.waitFor({ timeout: 25000 });
      await editor.click();
      await editor.fill(question);
      await page.keyboard.press('Enter');
      await page.waitForSelector('[data-message-author-role="assistant"]', { timeout: 90000 });
      return waitStable(page, '[data-message-author-role="assistant"]');
    },
  },
  gemini: {
    label: 'Gemini',
    async ask(page, question) {
      await page.goto('https://gemini.google.com/app', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(4000);
      await assertNotBlocked(page);
      await dismissDialogs(page);
      const editor = page
        .locator('rich-textarea [contenteditable="true"], [contenteditable="true"]')
        .first();
      await editor.waitFor({ timeout: 25000 });
      await editor.click();
      await page.keyboard.type(question, { delay: 15 });
      await page.keyboard.press('Enter');
      await page.waitForSelector('model-response, message-content', { timeout: 90000 });
      return waitStable(page, 'model-response, message-content');
    },
  },
  perplexity: {
    label: 'Perplexity',
    async ask(page, question) {
      await page.goto('https://www.perplexity.ai/', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(5000);
      await assertNotBlocked(page);
      await killGoogleOneTap(page);
      await dismissDialogs(page);
      if (/accounts\.google\.com/.test(page.url())) {
        await page.goto('https://www.perplexity.ai/', { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(4000);
        await killGoogleOneTap(page);
      }
      const editor = page.locator('main [contenteditable="true"], main textarea').first();
      await editor.waitFor({ timeout: 25000 });
      await editor.click();
      await page.keyboard.type(question, { delay: 15 });
      await page.waitForTimeout(500);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(5000);
      await killGoogleOneTap(page);
      const text = await waitStable(page, 'main', { minChars: 200 });
      return text;
    },
  },
};

export const PLATFORM_KEYS = Object.keys(PLATFORMS);
export const platformLabel = (key) => PLATFORMS[key].label;

// Ask one question in a fresh context; capture answer text + screenshot.
// Returns { ok, answerText?, error? }. Never throws.
export async function askQuestion(browser, platformKey, question, screenshotPath, { retries = 1 } = {}) {
  const platform = PLATFORMS[platformKey];
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const { ctx, page } = await freshPage(browser);
    try {
      const answerText = await platform.ask(page, question);
      await page
        .screenshot({ path: screenshotPath, fullPage: true, type: 'jpeg', quality: 75 })
        .catch(() => page.screenshot({ path: screenshotPath, type: 'jpeg', quality: 75 }));
      await ctx.close();
      return { ok: true, answerText };
    } catch (err) {
      lastErr = err;
      await page
        .screenshot({ path: screenshotPath, type: 'jpeg', quality: 75 })
        .catch(() => {});
      await ctx.close();
      if (attempt < retries) await new Promise((r) => setTimeout(r, 8000));
    }
  }
  return { ok: false, error: lastErr.message.split('\n')[0] };
}
