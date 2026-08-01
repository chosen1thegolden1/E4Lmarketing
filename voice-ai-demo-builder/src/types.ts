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

/** The Voice AI receptionist persona for the prospect's business. */
export interface DemoPersona {
  /** Receptionist's name, e.g. "Ava". */
  name: string;
  /** Role line, e.g. "AI receptionist for All Things Roofing". */
  role: string;
  /** Tone/personality guidance for the voice — the prospect's brand, not E4L's. */
  voice: string;
  /** The opening line the receptionist says when the caller taps to talk. */
  greeting: string;
}

export interface DemoFaq {
  question: string;
  answer: string;
}

/** Pitch copy shown on the E4L-branded demo page (E4L's confident, direct voice). */
export interface DemoCopy {
  headline: string;
  subhead: string;
  /** Short ROI-strip bullets (e.g. "Never miss an after-hours call"). */
  roi: string[];
  /** Label on the tap-to-talk button, e.g. "Tap to talk to Ava". */
  ctaLabel: string;
}

/** The generator's output: everything needed to build a prospect's demo + GHL KB. */
export interface DemoSpec {
  businessName: string;
  /** Services the business offers — seeds the receptionist's knowledge. */
  services: string[];
  persona: DemoPersona;
  faqs: DemoFaq[];
  demoCopy: DemoCopy;
}
