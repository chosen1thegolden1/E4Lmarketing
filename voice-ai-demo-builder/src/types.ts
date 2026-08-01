/**
 * Shared types across the pipeline:
 *   scrape(url) -> RawSite -> generate(RawSite) -> KnowledgeBase -> render(KnowledgeBase) -> demos/<slug>/index.html
 */

// ---------- Scrape output ----------

export interface RawSite {
  /** Normalized origin we scraped, e.g. https://joesplumbing.com */
  url: string;
  /** ISO timestamp of the scrape */
  scrapedAt: string;
  /** Which engine produced the HTML for the majority of pages */
  engine: "cheerio" | "playwright";
  /** Home page first, then priority internal pages (about, services, contact, ...) */
  pages: RawPage[];
  /** Contact signals aggregated across all scraped pages */
  contact: ContactInfo;
}

export interface RawPage {
  url: string;
  /** Path portion, "/" for home */
  path: string;
  title: string;
  metaDescription: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  headings: Heading[];
  /** Cleaned visible body text, whitespace-collapsed, capped per page */
  text: string;
  /** Absolute same-origin links discovered on the page */
  internalLinks: string[];
}

export interface Heading {
  level: number; // 1-6
  text: string;
}

export interface ContactInfo {
  phones: string[];
  emails: string[];
  /** Raw address-looking strings; the generator cleans these up */
  addresses: string[];
  /** platform -> profile URL (facebook, instagram, tiktok, youtube, linkedin, x, yelp, google) */
  socials: Record<string, string>;
  /** Raw lines that look like business hours */
  hoursLines: string[];
}

// ---------- Generator output (locked schema) ----------

export interface KnowledgeBase {
  businessName: string;
  services: string[];
  /** Voice AI receptionist persona/prompt for the GHL agent */
  persona: string;
  faqs: Faq[];
  demoCopy: DemoCopy;
}

export interface Faq {
  question: string;
  answer: string;
}

/** Copy slots for the branded demo page template */
export interface DemoCopy {
  headline: string;
  subheadline: string;
  /** The "tap to talk" prompt line above the widget */
  tapToTalkPrompt: string;
  /** Line items for the ROI strip, e.g. "Missed calls answered 24/7" */
  roiPoints: string[];
}

// ---------- Render input ----------

export interface DemoPageInput {
  slug: string;
  kb: KnowledgeBase;
  prospectUrl: string;
  /** GHL Voice AI Chat Widget embed snippet for this location/agent */
  ghlWidgetEmbed?: string;
}
