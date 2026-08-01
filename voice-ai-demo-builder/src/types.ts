export interface SiteLink {
  text: string;
  href: string;
}

/** Raw, un-interpreted signal pulled from a prospect's site. Feeds the generator. */
export interface RawSite {
  /** URL we were asked to scrape (normalized). */
  url: string;
  /** Final URL after redirects. */
  finalUrl: string;
  /** Which engine produced this result. */
  fetchedWith: "cheerio" | "playwright";
  title: string;
  metaDescription: string;
  headings: { h1: string[]; h2: string[]; h3: string[] };
  /** Cleaned, whitespace-collapsed visible text (truncated). */
  bodyText: string;
  /** Nav/menu link labels, de-duped. */
  nav: string[];
  links: SiteLink[];
  emails: string[];
  phones: string[];
  socials: string[];
  ogImage?: string;
  /** Non-fatal problems encountered while scraping. */
  warnings: string[];
}
