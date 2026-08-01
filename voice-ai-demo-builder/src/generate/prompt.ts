import type { RawSite } from "../types";

/** Build the generation prompt from a scraped site. */
export function buildPrompt(site: RawSite): string {
  const facts = {
    url: site.finalUrl,
    title: site.title,
    metaDescription: site.metaDescription,
    headings: site.headings,
    nav: site.nav,
    phones: site.phones,
    emails: site.emails,
    socials: site.socials,
    bodyText: site.bodyText.slice(0, 6000),
  };

  return [
    "You are building a personalized voice-AI receptionist demo for a prospect business, on behalf of Eat 4 Life (E4L), a marketing agency.",
    "",
    "You are given raw data scraped from the prospect's website. Produce a DemoSpec that:",
    "",
    "1. Identifies the real business name and its actual services (infer only from the data; do not invent offerings).",
    "2. Designs an AI RECEPTIONIST persona FOR THIS BUSINESS — its greeting, tone, and voice should match the prospect's own brand (warm, professional, on-brand for their industry). This is NOT E4L's voice. Give the receptionist a simple first name.",
    "3. Writes 4-6 FAQs a real caller to this business would ask, with accurate answers grounded in the scraped data (hours, services, booking, location, pricing if present). If a detail isn't in the data, keep the answer general and helpful rather than fabricating specifics.",
    "4. Writes demoCopy for the E4L-branded demo PAGE that pitches this receptionist to the business owner. This copy IS in E4L's voice: confident, direct, benefit-led, no corporate fluff. Headline + subhead + 4-6 short ROI bullets + a tap-to-talk CTA label that names the receptionist.",
    "",
    "Rules:",
    "- Never fabricate phone numbers, prices, or hours. Use what's provided; otherwise stay general.",
    "- ROI bullets are short (4-6 words), e.g. 'Never miss an after-hours call'.",
    "- Return ONLY the structured object.",
    "",
    "SCRAPED DATA:",
    JSON.stringify(facts, null, 2),
  ].join("\n");
}
