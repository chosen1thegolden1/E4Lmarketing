# Voice AI Demo Builder

Prospect's website URL in → personalized, branded voice-AI demo out. That's the whole game.

**The pipeline:**

```
scrape(url) ──> RawSite ──> generate() ──> KnowledgeBase ──> render() ──> demos/<slug>/index.html
                                                                └──> push to GHL Voice AI
```

1. **Scrape** — pulls the prospect's site (Cheerio first, headless Chromium fallback for
   JS-heavy sites): pages, headings, copy, phones, emails, socials, hours.
2. **Generate** — one LLM call, strict JSON schema:
   `{ businessName, services[], persona, faqs[], demoCopy{} }`. *(next up)*
3. **Render** — fills the E4L demo-page template (gold `#FFC200` on black, Rethink Sans,
   ROI strip, "tap to talk" hero) and writes a static page per prospect. *(waiting on template HTML)*
4. **GHL push** — loads the knowledge base into the GoHighLevel Voice AI agent. The
   "tap to talk" hero runs GHL's Voice AI Chat Widget (browser/WebRTC, embedded inline). *(last)*

End goal: an evergreen GHL snapshot service — one command per prospect, minimal manual work.

## Setup

```bash
npm install
cp .env.example .env   # fill in GHL_API_KEY, GHL_LOCATION_ID, LLM_API_KEY
```

`.env` is gitignored. Keep it that way — no keys in commits, ever.

## Usage

```bash
# Scrape a prospect
npm run scrape -- https://prospect-site.com

# Force the headless-browser engine / crawl more pages
npm run scrape -- https://prospect-site.com --playwright --max-pages=12

# No-network smoke test (local fixture sites, exercises both engines)
npm run test:smoke
```

Output lands in `out/<slug>.rawsite.json` (gitignored — it's regenerable).
Rendered demo pages land in `demos/<slug>/index.html` (committed — they're the deliverable).

## Layout

```
src/scrape/     url -> RawSite (Cheerio + Playwright fallback)
src/generate/   RawSite -> KnowledgeBase (LLM, strict schema)   [stub]
src/render/     KnowledgeBase -> branded demo page              [stub]
templates/      demo-page master HTML + Fineday font files      [needs drop-ins]
demos/          one folder per prospect, static, send the link
```
