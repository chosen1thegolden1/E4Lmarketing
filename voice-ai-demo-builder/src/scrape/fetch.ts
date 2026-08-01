const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

export interface FetchResult {
  html: string;
  finalUrl: string;
  status: number;
}

/** Plain HTTP fetch of a page's HTML. Throws on network failure; returns non-2xx statuses for the caller to judge. */
export async function fetchHtml(url: string, timeoutMs = 15000): Promise<FetchResult> {
  const res = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      "user-agent": UA,
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.9",
    },
  });
  const html = await res.text();
  return { html, finalUrl: res.url || url, status: res.status };
}

/**
 * Render the page in headless Chromium and return the settled DOM.
 * Used when static HTML comes back thin (JS-rendered site) or blocked.
 * Playwright is an optional dep — throws a clear error if it isn't installed.
 */
export async function fetchHtmlRendered(url: string, timeoutMs = 30000): Promise<FetchResult> {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    throw new Error(
      "This site needs JS rendering, but Playwright isn't installed. Run: npm install playwright"
    );
  }
  // CHROMIUM_PATH (optional, .env) points at a system Chromium when Playwright's
  // own browser download isn't present — e.g. remote/CI environments.
  const executablePath = process.env.CHROMIUM_PATH || undefined;
  const browser = await chromium.launch({ headless: true, executablePath });
  try {
    const page = await browser.newPage({ userAgent: UA });
    const response = await page.goto(url, { timeout: timeoutMs, waitUntil: "domcontentloaded" });
    // let client-side frameworks paint
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    const html = await page.content();
    return { html, finalUrl: page.url(), status: response?.status() ?? 200 };
  } finally {
    await browser.close();
  }
}
