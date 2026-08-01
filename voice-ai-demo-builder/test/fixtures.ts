import type { DemoSpec, RawSite } from "../src/types";

/** A realistic scraped site, so generate() can be tested without live network. */
export const MEDSPA_SITE: RawSite = {
  url: "https://luxyoumedspa.example",
  finalUrl: "https://luxyoumedspa.example/",
  fetchedWith: "cheerio",
  title: "Lux You Med Spa — Botox, Fillers & Facials in Austin, TX",
  metaDescription:
    "Lux You Med Spa offers Botox, dermal fillers, HydraFacials, and laser treatments in Austin. Book your free consultation today.",
  headings: {
    h1: ["Look Like You, Only Luxed."],
    h2: ["Our Services", "Why Lux You"],
    h3: ["Hours"],
  },
  bodyText:
    "Our Services Botox & Dysport Dermal Fillers HydraFacial Laser Hair Removal Microneedling. " +
    "Why Lux You: Board-certified injectors. 5,000+ treatments performed. Same-week appointments. " +
    "Hours Mon–Sat 9am–6pm. Call (512) 555-0142 or email hello@luxyoumedspa.com.",
  nav: ["Home", "Services", "About", "Contact"],
  links: [],
  emails: ["hello@luxyoumedspa.com"],
  phones: ["+15125550142"],
  socials: ["https://instagram.com/luxyoumedspa"],
  ogImage: "https://luxyou.example/og.jpg",
  warnings: [],
};

/** A hand-authored spec so the RENDERER can be tested with no API key. */
export const FALLBACK_SPEC: DemoSpec = {
  businessName: "Lux You Med Spa",
  services: ["Botox & Dysport", "Dermal Fillers", "HydraFacial", "Laser Hair Removal", "Microneedling"],
  persona: {
    name: "Ava",
    role: "AI receptionist for Lux You Med Spa",
    voice: "Warm, polished, and reassuring — like a friendly front-desk concierge at a high-end spa.",
    greeting: "Thanks for calling Lux You Med Spa, this is Ava! Are you looking to book a treatment or ask a question?",
  },
  faqs: [
    { question: "What are your hours?", answer: "We're open Monday through Saturday, 9am to 6pm." },
    { question: "Do you offer free consultations?", answer: "Yes — your first consultation is complimentary. I can get you booked right now." },
    { question: "What treatments do you offer?", answer: "Botox and Dysport, dermal fillers, HydraFacials, laser hair removal, and microneedling." },
    { question: "How soon can I be seen?", answer: "We keep same-week appointments open — I can usually find you a spot in the next few days." },
  ],
  demoCopy: {
    headline: "Your front desk just stopped missing calls.",
    subhead: "Ava answers every caller for Lux You Med Spa — books consults, quotes hours, and never sends anyone to voicemail.",
    roi: [
      "Never miss an after-hours call",
      "Books consults 24/7",
      "Answers FAQs instantly",
      "Zero hold time",
    ],
    ctaLabel: "Tap to talk to Ava",
  },
};
