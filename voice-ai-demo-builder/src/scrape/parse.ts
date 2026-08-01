import * as cheerio from "cheerio";
import type { ContactInfo, Heading, RawPage } from "../types.js";

const MAX_TEXT_PER_PAGE = 12000;

const SOCIAL_HOSTS: Record<string, string> = {
  "facebook.com": "facebook",
  "instagram.com": "instagram",
  "tiktok.com": "tiktok",
  "youtube.com": "youtube",
  "linkedin.com": "linkedin",
  "twitter.com": "x",
  "x.com": "x",
  "yelp.com": "yelp",
  "g.page": "google",
  "maps.app.goo.gl": "google",
};

export function parsePage(html: string, pageUrl: string): RawPage {
  const $ = cheerio.load(html);
  $("script, style, noscript, svg, iframe, template").remove();

  const origin = new URL(pageUrl).origin;

  const headings: Heading[] = [];
  $("h1, h2, h3, h4").each((_, el) => {
    const text = clean($(el).text());
    if (text) headings.push({ level: Number(el.tagName[1]), text });
  });

  const internalLinks = new Set<string>();
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    try {
      const abs = new URL(href, pageUrl);
      abs.hash = "";
      if (abs.origin === origin && /^https?:$/.test(abs.protocol)) {
        internalLinks.add(abs.href);
      }
    } catch {
      /* unparseable href */
    }
  });

  const text = clean($("body").text()).slice(0, MAX_TEXT_PER_PAGE);

  return {
    url: pageUrl,
    path: new URL(pageUrl).pathname || "/",
    title: clean($("title").first().text()),
    metaDescription: $('meta[name="description"]').attr("content")?.trim() ?? "",
    ogTitle: $('meta[property="og:title"]').attr("content")?.trim() || undefined,
    ogDescription: $('meta[property="og:description"]').attr("content")?.trim() || undefined,
    ogImage: $('meta[property="og:image"]').attr("content")?.trim() || undefined,
    headings,
    text,
    internalLinks: [...internalLinks],
  };
}

/** Pull phones/emails/socials/addresses/hours out of raw HTML + parsed text. */
export function extractContact(htmlPages: { html: string; page: RawPage }[]): ContactInfo {
  const phones = new Set<string>();
  const emails = new Set<string>();
  const addresses = new Set<string>();
  const socials: Record<string, string> = {};
  const hoursLines = new Set<string>();

  for (const { html, page } of htmlPages) {
    const $ = cheerio.load(html);

    $('a[href^="tel:"]').each((_, el) => {
      const v = decodeURIComponent($(el).attr("href")!.slice(4)).trim();
      if (v) phones.add(v);
    });
    $('a[href^="mailto:"]').each((_, el) => {
      const v = decodeURIComponent($(el).attr("href")!.slice(7)).split("?")[0]!.trim();
      if (v) emails.add(v.toLowerCase());
    });
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href")!;
      try {
        const host = new URL(href, page.url).hostname.replace(/^www\./, "");
        const platform = SOCIAL_HOSTS[host];
        if (platform && !socials[platform]) socials[platform] = new URL(href, page.url).href;
      } catch {
        /* ignore */
      }
    });

    // pattern-match the visible text too — plenty of sites skip tel:/mailto:
    for (const m of page.text.matchAll(/(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/g)) {
      phones.add(m[0].trim());
    }
    for (const m of page.text.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)) {
      emails.add(m[0].toLowerCase());
    }
    for (const m of page.text.matchAll(
      /\d{1,5}\s+[A-Za-z0-9.'\- ]{3,40}\b(?:St|Street|Ave|Avenue|Blvd|Boulevard|Rd|Road|Dr|Drive|Ln|Lane|Way|Ct|Court|Pkwy|Parkway|Hwy|Highway|Pl|Place|Suite|Ste)\b[^\n]{0,60}/g
    )) {
      addresses.add(clean(m[0]));
    }
    for (const line of page.text.split(/(?<=[.!?])\s+|\n/)) {
      if (
        /\b(mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday|open 24|24\/7)\b/i.test(line) &&
        /\d{1,2}(:\d{2})?\s?(am|pm)|24\/7|24 hours|closed/i.test(line) &&
        line.length < 200
      ) {
        hoursLines.add(clean(line));
      }
    }
  }

  return {
    phones: [...phones].slice(0, 10),
    emails: [...emails].filter((e) => !/\.(png|jpg|jpeg|webp|svg|gif)$/.test(e)).slice(0, 10),
    addresses: [...addresses].slice(0, 5),
    socials,
    hoursLines: [...hoursLines].slice(0, 10),
  };
}

function clean(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}
