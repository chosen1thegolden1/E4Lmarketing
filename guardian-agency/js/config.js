/* ==========================================================
   The Guardian Agency – one-file configuration
   Edit these values and the site updates itself.
   ========================================================== */
window.CONFIG = {
  agentName: "Michelle Sanders",          // shown in "Meet your agent" and the results screen
  phone: "(000) 000-0000",                // display format
  phoneHref: "tel:+10000000000",          // dial format
  email: "hello@example.com",
  emailHref: "mailto:hello@example.com",
  location: "City, State",

  // Where quiz leads go. Leave empty to only store locally (for the demo).
  // Works with GoHighLevel inbound webhooks, Zapier, Make, Formspree, etc.
  leadWebhookUrl: "",

  // Paste a scheduler URL and it replaces the placeholder box on the results screen.
  // Examples: "https://calendly.com/your-name/15min"  or a GoHighLevel calendar link.
  calendarUrl: "",

  // The brochure / packet PDF offered after the quiz (drop the file in /assets).
  brochureUrl: "assets/guardian-packet.pdf",

  // Illustration assumptions for the "own your bank" calculator (not a guarantee).
  illustration: { creditedRate: 0.06, loanToValue: 0.90 }
};
