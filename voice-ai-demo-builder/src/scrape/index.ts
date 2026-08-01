import * as cheerio from "cheerio";
import type { RawSite, SiteLink } from "../types";

const BODY_TEXT_LIMIT = 8000;
const JS_HEAVY_THRESHOLD = 250; // if cleaned text is shorter than this, try Playwright
const FETCH_TIMEOUT_MS = 20000;

const SOCIAL_HOSTS = [
  "facebook.com", "instagram.com", "twitter.com", "x.com",
  "linkedin.com", "youtube.com", "tiktok.com",
];

export function normalizeUrl(input: string): string {
  const url = input.trim();
  return /^https?:\/\//i.test(url) ? url : "https://" + url;
}

function collapse(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function uniq(arr: string[]): string[] {
  return [...new Set(arr.map((s) => s.trim()).filter(Boolean))];
}

/** Collapse phone candidates by their last 10 digits, preferring an E.164 (+…) form. */
function dedupePhones(cands: string[]): string[] {
  const byKey = new Map<string, string>();
  for (const raw of cands) {
    const digits = raw.replace(/\D/g, "");
    if (digits.length < 10) continue;
    const key = digits.slice(-10);
    const prev = byKey.get(key);
    if (!prev) {
      byKey.set(key, raw);
    } else if (raw.startsWith("+") && !prev.startsWith("+")) {
      byKey.set(key, raw);
    }
  }
  return [...byKey.values()];
}

async function fetchHtml(url: string): Promise<{ html: string; finalUrl: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; E4L-DemoBuilder/0.1; +https://eat4life.com)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    const html = await res.text();
    return { html, finalUrl: res.url || url };
  } finally {
    clearTimeout(timer);
  }
}

function extract(
  $: cheerio.CheerioAPI,
  url: string,
  finalUrl: string,
  fetchedWith: "cheerio" | "playwright"
): RawSite {
  const warnings: string[] = [];

  // Pull metadata that lives in <head> BEFORE we strip anything.
  const ogTitle = collapse($('meta[property="og:title"]').attr("content") || "");
  const metaDescription =
    collapse($('meta[name="description"]').attr("content") || "") ||
    collapse($('meta[property="og:description"]').attr("content") || "");
  const ogImage = $('meta[property="og:image"]').attr("content") || undefined;
  const title = collapse($("title").first().text()) || ogTitle;

  // Strip noise before pulling visible text.
  $("script, style, noscript, template, svg").remove();

  const headings = {
    h1: uniq($("h1").map((_, el) => collapse($(el).text())).get()),
    h2: uniq($("h2").map((_, el) => collapse($(el).text())).get()),
    h3: uniq($("h3").map((_, el) => collapse($(el).text())).get()),
  };

  const bodyRaw = $("body").text();
  const bodyText = collapse(bodyRaw).slice(0, BODY_TEXT_LIMIT);

  const nav = uniq($("nav a, header a").map((_, el) => collapse($(el).text())).get())
    .filter((t) => t.length > 1 && t.length < 40);

  const links: SiteLink[] = [];
  const emails: string[] = [];
  const phones: string[] = [];
  const socials: string[] = [];

  $("a[href]").each((_, el) => {
    const href = ($(el).attr("href") || "").trim();
    if (!href) return;
    const text = collapse($(el).text());
    if (href.toLowerCase().startsWith("mailto:")) {
      emails.push(href.slice(7).split("?")[0]);
    } else if (href.toLowerCase().startsWith("tel:")) {
      phones.push(href.slice(4));
    } else if (/^https?:\/\//i.test(href)) {
      links.push({ text, href });
      const host = href.replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
      if (SOCIAL_HOSTS.some((h) => host === h || host.endsWith("." + h))) socials.push(href);
    }
  });

  // Regex sweep for contact info the anchors missed.
  emails.push(...(bodyRaw.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || []));
  phones.push(...((bodyRaw.match(/\+?\d[\d\s().-]{7,}\d/g) || []).map(collapse)));

  if (!title) warnings.push("No <title> found.");
  if (bodyText.length < JS_HEAVY_THRESHOLD)
    warnings.push("Very little text extracted — page may be JS-rendered.");

  return {
    url,
    finalUrl,
    fetchedWith,
    title,
    metaDescription,
    headings,
    bodyText,
    nav,
    links: links.slice(0, 100),
    emails: uniq(emails),
    phones: dedupePhones(phones),
    socials: uniq(socials),
    ogImage,
    warnings,
  };
}

/** Render a JS-heavy page with a real browser, if Playwright is available. */
async function renderWithPlaywright(
  url: string
): Promise<{ html: string; finalUrl: string } | null> {
  let chromium: typeof import("playwright").chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    return null; // playwright not installed
  }

  // Route Chromium through the same egress proxy Node uses, if one is set.
  const proxyServer = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  const launchOpts = {
    headless: true,
    ...(proxyServer ? { proxy: { server: proxyServer } } : {}),
  };

  let browser;
  try {
    browser = await chromium.launch(launchOpts);
  } catch {
    try {
      browser = await chromium.launch({
        ...launchOpts,
        executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || "/opt/pw-browsers/chromium",
      });
    } catch {
      return null;
    }
  }

  try {
    // ignoreHTTPSErrors: the agent proxy re-signs TLS, which Chromium won't trust by default.
    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    const html = await page.content();
    return { html, finalUrl: page.url() };
  } finally {
    await browser.close();
  }
}

/** Scrape a prospect's site into a RawSite. Cheerio first; Playwright for JS-heavy pages. */
export async function scrape(input: string): Promise<RawSite> {
  const url = normalizeUrl(input);
  const { html, finalUrl } = await fetchHtml(url);

  // Detect the egress-allowlist rejection so it reads as a network-policy issue,
  // not a mysteriously empty page — and don't waste a Playwright launch on it.
  if (/not in allowlist/i.test(html) && html.length < 300) {
    return {
      url, finalUrl, fetchedWith: "cheerio",
      title: "", metaDescription: "",
      headings: { h1: [], h2: [], h3: [] },
      bodyText: "", nav: [], links: [], emails: [], phones: [], socials: [],
      warnings: [`Blocked by network egress allowlist — add this host to the environment's allowed hosts. Proxy said: ${collapse(html)}`],
    };
  }

  let result = extract(cheerio.load(html), url, finalUrl, "cheerio");

  // Fall back to a real browser for JS-heavy sites — but never let its failure
  // kill the scrape; degrade to the Cheerio result with a warning.
  if (result.bodyText.length < JS_HEAVY_THRESHOLD) {
    try {
      const rendered = await renderWithPlaywright(url);
      if (rendered) {
        const pw = extract(cheerio.load(rendered.html), url, rendered.finalUrl, "playwright");
        if (pw.bodyText.length > result.bodyText.length) result = pw;
      } else {
        result.warnings.push("Playwright fallback unavailable; returning Cheerio result.");
      }
    } catch (err) {
      result.warnings.push(
        `Playwright fallback failed: ${(err as Error)?.message || err}`
      );
    }
  }

  return result;
}
