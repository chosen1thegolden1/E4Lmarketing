# Voice AI Demo Builder

Turn any local-business website into a personalized Voice AI receptionist demo — page + live callable agent — in one command or one browser click. Built to scale to multiple reps/affiliates sending demos to leads daily.

## Pipeline

1. **Scrape** — crawls up to 6 same-origin pages (browser UA, cheerio): titles, headings, copy, phones, emails.
2. **Generate** — Claude turns the scrape into a business profile, demo-page copy, a sample call transcript, and a production-quality voice-agent prompt (custom per lead).
3. **Render** — writes a standalone branded page to `demos/<slug>/index.html`. Slugs are deterministic (from the lead's domain), so the public URL is knowable up front.
4. **Push** (`--push`) — creates the GHL Voice AI agent and attaches a click-to-call number from the **number pool**.
5. **CRM** (`--email=`) — upserts the GHL contact with `Voice Demo URL` + `Voice Demo Phone` custom fields, a `voice-demo` tag, and a `rep:<name>` attribution tag. A GHL workflow takes it from there (see `EMAIL_TEMPLATE.md`).

## For reps & affiliates (no code)

Go to the repo's **Actions → Build Voice AI Demo → Run workflow** and fill in:

- **website_url** — the lead's site
- **lead_email** — the lead's email (optional but recommended; powers the automated email)
- **rep** — your rep ID (this is how your commission is tracked)

The workflow builds everything, commits it, and GitHub Pages publishes the demo at `<DEMO_BASE_URL>/<slug>/`. The GHL workflow emails the lead automatically.

## CLI

```bash
npm install
npm run demo -- https://lead-website.com/ --push --email=owner@lead.com --rep=alex
npm run pool                    # pool status: which number is on which demo
npm run pool -- recycle         # free numbers from demos older than maxAgeDays
npm run pool -- release <slug>  # manually free one demo's number
```

## Number pool

`pool.json` lists the demo phone numbers (bought once in GHL: Settings → Phone Numbers) and `maxAgeDays`. Assignment state lives in `demos/registry.json`.

- New demo → first free number in the pool.
- Pool exhausted → the **oldest** active demo's number is recycled automatically; its page is re-rendered without call buttons (page stays live, line goes quiet).
- Scale = add a line to `pool.json`. That's it.

## One-time setup (already done for E4L, documented for reference)

1. **Repo secrets** (Settings → Secrets → Actions): `ANTHROPIC_API_KEY`, `GHL_API_TOKEN`, `GHL_LOCATION_ID`.
2. **Repo variable**: `DEMO_BASE_URL` (e.g. `https://<user>.github.io/<repo>`).
3. **GitHub Pages**: Settings → Pages → Source: **GitHub Actions**.
4. **GHL custom fields** `Voice Demo URL` + `Voice Demo Phone` (created via API).
5. **GHL workflow**: tag `voice-demo` → wait 10 min → send `EMAIL_TEMPLATE.md` email.

## Environment

| Variable | Purpose |
| --- | --- |
| `ANTHROPIC_API_KEY` (or `LLM_API_KEY`) | Claude API key |
| `GHL_API_TOKEN` | GHL private-integration token (`pit-…`) — Voice AI + contacts + custom-fields scopes |
| `GHL_LOCATION_ID` | GHL sub-account the agents/contacts live in |
| `DEMO_BASE_URL` | Public base URL demos deploy under (used for the CRM write-back) |

## Privacy note

`demos/registry.json` (lead emails) and `demos/*/data.json` (raw generated content) are excluded from the public Pages deploy by `deploy-pages.yml`.
