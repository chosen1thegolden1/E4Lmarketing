import type { RawPage, RawSite } from "../types.js";
import { fetchHtml, fetchHtmlRendered, type FetchResult } from "./fetch.js";
import { extractContact, parsePage } from "./parse.js";

/** Home page + up to this many priority internal pages */
const MAX_PAGES = 8;
/** Static HTML with less visible text than this = probably a JS-rendered shell -> Playwright */
const MIN_TEXT_FOR_STATIC = 400;

/** Internal paths worth crawling for knowledge-base material, in priority order */
const PRIORITY_PATTERNS: RegExp[] = [
  /about/i,
  /service|what-we-do|treatment|procedure|practice-area/i,
  /menu|pricing|price|rates|packages?|plans?/i,
  /faq|questions/i,
  /contact|location|find-us|directions|hours/i,
  /team|staff|our-people|doctors?|providers?/i,
  /book|appointment|schedule|reservation/i,
];

export interface ScrapeOptions {
  maxPages?: number;
  /** Force the rendering engine instead of auto-detecting */
  engine?: "cheerio" | "playwright";
  log?: (msg: string) => void;
}

/**
 * scrape(url) -> RawSite
 * Fetches the home page (Cheerio-first, Playwright fallback for JS-heavy or bot-walled sites),
 * follows a handful of high-value internal links, and aggregates contact signals.
 */
export async function scrape(inputUrl: string, opts: ScrapeOptions = {}): Promise<RawSite> {
  const log = opts.log ?? (() => {});
  const maxPages = opts.maxPages ?? MAX_PAGES;
  const startUrl = normalizeUrl(inputUrl);

  // --- home page: decide the engine ---
  let engine: "cheerio" | "playwright" = opts.engine ?? "cheerio";
  let home: FetchResult | undefined;

  if (engine === "cheerio") {
    try {
      home = await fetchHtml(startUrl);
    } catch (err) {
      log(`static fetch failed (${(err as Error).message}) — falling back to Playwright`);
    }
    if (home) {
      const parsed = parsePage(home.html, home.finalUrl);
      const blocked = home.status === 403 || home.status === 503;
      const thin = parsed.text.length < MIN_TEXT_FOR_STATIC;
      if (blocked || thin) {
        log(
          blocked
            ? `got HTTP ${home.status} — retrying with Playwright`
            : `only ${parsed.text.length} chars of text in static HTML — retrying with Playwright`
        );
        home = undefined;
      }
    }
    if (!home) engine = "playwright";
  }
  if (!home) {
    home = await fetchHtmlRendered(startUrl);
    if (home.status >= 400) {
      throw new Error(`Site returned HTTP ${home.status} even with a real browser: ${startUrl}`);
    }
  }
  if (home.status >= 400) {
    throw new Error(`Site returned HTTP ${home.status}: ${startUrl}`);
  }

  const origin = new URL(home.finalUrl).origin;
  const homePage = parsePage(home.html, home.finalUrl);
  log(`home ok via ${engine} (${homePage.text.length} chars, ${homePage.internalLinks.length} internal links)`);

  const htmlPages: { html: string; page: RawPage }[] = [{ html: home.html, page: homePage }];
  const visited = new Set<string>([dedupeKey(home.finalUrl), dedupeKey(startUrl)]);

  // --- pick priority internal pages ---
  for (const target of pickPriorityLinks(homePage.internalLinks, origin)) {
    if (htmlPages.length >= maxPages) break;
    if (visited.has(dedupeKey(target))) continue;
    visited.add(dedupeKey(target));
    try {
      const res = engine === "playwright" ? await fetchHtmlRendered(target) : await fetchHtml(target);
      if (res.status >= 400) {
        log(`skip ${target} (HTTP ${res.status})`);
        continue;
      }
      const page = parsePage(res.html, res.finalUrl);
      htmlPages.push({ html: res.html, page });
      log(`+ ${page.path} (${page.text.length} chars)`);
    } catch (err) {
      log(`skip ${target} (${(err as Error).message})`);
    }
  }

  return {
    url: origin,
    scrapedAt: new Date().toISOString(),
    engine,
    pages: htmlPages.map((p) => p.page),
    contact: extractContact(htmlPages),
  };
}

function normalizeUrl(input: string): string {
  const withProto = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  return new URL(withProto).href;
}

/** Trailing-slash/protocol-insensitive key so /about and /about/ don't get scraped twice */
function dedupeKey(url: string): string {
  const u = new URL(url);
  return `${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/+$/, "")}${u.search}`;
}

function pickPriorityLinks(links: string[], origin: string): string[] {
  const scored: { url: string; score: number }[] = [];
  for (const link of links) {
    const u = new URL(link);
    if (u.origin !== origin) continue;
    const path = u.pathname.toLowerCase();
    if (/\.(pdf|jpg|jpeg|png|webp|svg|gif|zip|mp4|css|js)$/.test(path)) continue;
    const idx = PRIORITY_PATTERNS.findIndex((re) => re.test(path));
    if (idx === -1) continue;
    // shallow pages beat deep ones within the same category
    const depth = path.split("/").filter(Boolean).length;
    scored.push({ url: link, score: idx * 10 + depth });
  }
  scored.sort((a, b) => a.score - b.score);
  return scored.map((s) => s.url);
}
