# Deploying the E4L Marketing site to GoHighLevel

This folder builds eight self-contained HTML pages that paste straight into
GoHighLevel (GHL) funnel pages, the same way the Revenue Leak Scorecard was
deployed. Nothing here needs a server. Follow the order below; the only
things you type are URLs.

Everything lives in the **E4L Services** sub-account. Never the school.
Every asset you create is prefixed `CS-` per the mission brief.

**Domain:** `e4lagency.com` (with `www`). It attaches to the `CS-Website`
funnel in step 4. The school link is intentionally blank for now (the footer hides
it until a URL is added), the calendar is already wired, prices are approved
as shown, and Malik's chat agent is already built. Budget about an hour.

**Order of work:** 1 → 2 → 3 → 4 → 5, then 7 (Malik's webhook) last.

## 0. What you are deploying

| Page | GHL path | File to paste |
|---|---|---|
| Home | `/` | `site/dist/ghl/home.html` |
| Systems | `/systems` | `site/dist/ghl/systems.html` |
| Creative | `/creative` | `site/dist/ghl/creative.html` |
| Questions (FAQ) | `/faq` | `site/dist/ghl/faq.html` |
| How pricing works | `/pricing` | `site/dist/ghl/pricing.html` |
| Book a Game Plan Call | `/book` | `site/dist/ghl/book.html` |
| Booking thank-you | `/thanks` | `site/dist/ghl/thanks.html` |
| 404 | `/404` | `site/dist/ghl/404.html` |

The Scorecard stays at `/scorecard` as already deployed. The site links to it.

## 1. Host the images (10 minutes)

The pages load Malik and the wordmark from a URL. Pick one:

**Option A, GHL Media Library (use this one).** In E4L Services open
Media Storage, create a folder `CS-site`, and upload every file in
`assets/malik/` and `assets/brand/` (including the hero animation `malik-wall-loop.mp4` and
`malik-wall-loop.webm`, plus its poster `malik-wall-poster.jpg` and the still fallback `malik-wall-still.jpg`). Copy the URL of any one uploaded file;
everything before the filename is your base URL. It must end with a slash.

**Option B, GitHub Pages (not live yet).** The `deploy-pages.yml` workflow
publishes `assets/` to the Pages site, but Pages only deploys from the repo's
default branch and this work is still on its own branch. Until it is merged,
the Pages URLs return 404. Use Option A, and if the branch is merged later
the base URL becomes
`https://chosen1thegolden1.github.io/E4Lmarketing/assets/`.

Note the base URL. You will paste it in step 3.

## 2. Create the GHL pieces the site talks to

1. **Lead webhook.** Workflows → create `CS-Site-Lead-Intake` → trigger
   *Inbound Webhook*. Copy the webhook URL. (Used by any contact form you add
   later; leave blank if unused.)
2. **Audit webhook.** Workflows → create `CS-AI-Audit-Intake` → trigger
   *Inbound Webhook*. Copy the URL. Payload keys sent by the site:
   `business, city, trade, first_name, phone, email, source, page,
   submitted_at`. Map them to the contact, tag `cs-audit-request`, add to
   `CS-Agency-Pipeline` → *New Lead*, post to `#cs-sales-leads`, and (when
   the GEO loop is wired) append the business to `geo/clients.json`.
3. **Malik chat webhook.** Workflows → create `CS-Malik-Intake` → trigger
   *Inbound Webhook*. Copy the URL. This one is pasted into ElevenLabs, not
   into the build (see section 7).
4. **Calendar.** Calendars → the 20-minute *Game Plan Call* calendar. Copy
   the **public booking link** and the **embed link** (Calendar → Share →
   Embed code; take only the `src` URL of the iframe). Set the calendar's
   confirmation redirect to `/thanks`.

## 3. Put the URLs into the build and rebuild (2 minutes)

Open `site/build.py` and fill in the `CONFIG` block:

```python
"ASSET_BASE":        "https://.../CS-site/",      # from step 1, ends with /
"LEAD_WEBHOOK_URL":  "https://services.leadconnectorhq.com/hooks/...",
"AUDIT_WEBHOOK_URL": "https://services.leadconnectorhq.com/hooks/...",
"CALENDAR_URL":      "https://api.leadconnectorhq.com/widget/booking/...",
"CALENDAR_EMBED_URL":"https://api.leadconnectorhq.com/widget/booking/...",
"SCORECARD_URL":     "/scorecard",
"SCHOOL_URL":        "",                           # leave blank; Chosen adds the school link later
"SHOW_PRICES":       True,                         # False hides every dollar figure
"ELEVENLABS_AGENT_ID": "agent_3601m4czfzgrf8b9cnynhjzjqj8g",  # Malik the chat agent; "" removes the widget
```

Then run:

```bash
python3 site/build.py
```

The eight files in `site/dist/ghl/` are now ready. (No Python on your
machine? Open any file in `site/dist/ghl/`, find the line that starts with
`window.E4L_CONFIG=` near the top, and edit the values by hand. Do the same
find-and-replace for the image base URL. It works, it's just more typing.)

## 4. Create the funnel and paste the pages (20 minutes)

1. Funnels → New Funnel → `CS-Website`.
2. Add eight blank steps with the paths in the table above. Home is `/`.
3. On each step: one full-width section, padding 0, background `#FFFFFF`.
   Add one **Custom Code** element. Paste the ENTIRE matching file from
   `site/dist/ghl/`.
4. Page SEO for each step:
   - Home: title `Eat 4 Life Marketing | Your AI Guide`, description
     `AI Marketing Made Easy. Malik and the E4L team install, run, and improve
     the systems that answer your phone, follow up with every lead, and keep
     you visible.`
   - Others: use the `<title>` inside each file.
   - Favicon: the EFL gold mark.
5. Funnel settings → set `/404` as the 404 page if your GHL plan offers it.
6. Attach `e4lagency.com` (and `www.e4lagency.com`) to the funnel. Set `www`
   to redirect to the bare domain, or the other way round, but pick one.
7. Publish.

## 5. Test before anyone sees it

- [ ] Every nav link lands on the right step. The "What we fix" dropdown opens Systems and Creative as two separate pages.
- [ ] On `/faq`, opening a question closes the others and Malik's bubble changes.
- [ ] The hero Malik animates (a short silent loop). On phones with Low Power Mode or "reduce motion" on, the still image shows instead.
- [ ] Malik appears on every page and his bubble shows on hover/tap.
- [ ] On the home page, tap each term under *Ask Malik*. The answer changes.
- [ ] Submit the free audit form with `Test Lead` and a real email. The contact
      appears in E4L Services with tag `cs-audit-request` and the Slack alert fires.
- [ ] *Book a call* opens the calendar. The `/book` page shows the embedded calendar.
- [ ] Book a test slot. You land on `/thanks`.
- [ ] Visit `/nothing-here`. You get Malik's 404.
- [ ] Malik's chat bubble sits bottom-right on every page. Open it, type
      "how much is the front desk", and he answers with "from $500 a month"
      and no promised results.
- [ ] In the chat, say "run the audit" and give a test email. The contact
      lands in E4L Services with tag `cs-malik-lead` (section 7).
- [ ] Phone check: no sideways scroll, buttons are tappable, menu opens, and
      the chat bubble does not cover the *Book a call* button.

## 6. Things you may want to change later

- **Copy.** Edit the files in `site/src/pages/`, rebuild, re-paste. Keep the
  guardrails: "AI Marketing Made Easy" only (never "Everybody Eats"), no
  promised results, every estimate carries its disclaimer.
- **Prices.** Flip `SHOW_PRICES` to `False` to hide every dollar figure and
  keep pricing on the call. The pages still read correctly without them.
- **The words on the wall.** They're live text in `site/src/pages/home.html` (the `wall-track` list, written twice so the loop is seamless). Edit, rebuild, re-paste.
- **Adding FAQs.** Add a question to `site/src/data/faqs.json` (question, answer, and Malik's one-liner), rebuild, re-paste `/faq`.
- **What Malik says in the chat.** His persona and rules are in
  `site/malik-agent/system-prompt.md`. Edit there, then paste into the agent's
  *System prompt* in ElevenLabs. When `site/src/data/faqs.json` or the price
  sheet changes, update the two knowledge-base documents too (section 7).
- **Malik poses.** Drop new transparent PNGs into `assets/malik/` with the same
  names (`malik-lean`, `malik-point`, `malik-thumbs`, `malik-peek`,
  `malik-arms`) and re-upload to the Media Library. No rebuild needed if the
  names match.

## 7. Malik chat agent (ElevenLabs) — do this last

Malik also lives in a chat bubble on every page. He is a text-only
chatbot built as an ElevenLabs agent; the site only carries a two-line embed, so nothing
here changes when his answers change. He answers questions from a knowledge
base built from the site copy, the FAQ, and the price sheet, and he hands
leads to GHL through one webhook. Until that webhook is wired he still
chats, he just cannot save a lead.

**Where things are**

| Thing | Where |
|---|---|
| Agent | ElevenLabs → Agents → *Malik — Your AI Guide (E4L website)*, id `agent_3601m4czfzgrf8b9cnynhjzjqj8g` |
| Test link (no site needed) | `https://elevenlabs.io/app/talk-to?agent_id=agent_3601m4czfzgrf8b9cnynhjzjqj8g` |
| His persona and rules | `site/malik-agent/system-prompt.md` (same text as the agent's System prompt) |
| Knowledge base | two text docs: *E4L Marketing - Services, pricing, and how it works* and *E4L Marketing - FAQ and plain-English AI glossary* |
| Lead tool | webhook tool `capture_lead` on the agent |
| Embed on the site | `site/src/partials/malik-chat.html`, switched on by `ELEVENLABS_AGENT_ID` in `site/build.py` |

**Step 1. Create the GHL workflow (5 minutes).** In E4L Services:
Workflows → create `CS-Malik-Intake` → trigger *Inbound Webhook* → copy the
URL. The payload Malik sends is JSON with these keys:

```
email        always present, exactly as the visitor typed it
interest     one of: audit, callback, book_call, systems, creative, other
first_name   if given
phone        if given
business     if given
city         city and state, if given (always asked for an audit)
trade        what the business does, if given (always asked for an audit)
summary      one or two sentences on what they asked about
source       always "website-malik-chat"
```

Map `email`, `first_name`, `phone` to the contact; put `business` in
Company Name; `city` and `trade` in the custom fields the audit form already
uses; `summary` in a note on the contact. Then:

- Tag every contact `cs-malik-lead`, plus `cs-audit-request` when `interest`
  is `audit` and `cs-callback` when it is `callback` or `book_call`.
- Add to `CS-Agency-Pipeline` → *New Lead*.
- Post to `#cs-sales-leads` with the summary line so whoever picks it up knows
  what Malik already told them.
- If `interest` is `audit`, run the same steps as `CS-AI-Audit-Intake`.

**Step 2. Paste the webhook URL into the agent (2 minutes).** ElevenLabs →
Agents → Malik → *Tools* → `capture_lead` → *URL*. Replace the placeholder
(`https://services.leadconnectorhq.com/hooks/REPLACE-WITH-CS-MALIK-INTAKE-WEBHOOK`)
with the URL from step 1. Save. Method stays `POST`, body stays JSON.

**Step 3. Domain lock (already done, 1 minute to check).** The agent's
allowlist already holds `e4lagency.com` and `www.e4lagency.com`, with
*Enable authentication* off (the widget needs the agent public; the allowlist
is what stops other sites from embedding him). If you test the chat on a GHL
preview link before the domain is attached, add that preview hostname in
ElevenLabs → Agents → Malik → *Security* → *Allowlist*, then remove it after.
In *Widget*, replace the avatar URL with the Media Library URL of
`malik-thumbs.png` from section 1 (the GitHub Pages URL it holds now is not
live, so the bubble shows a blank avatar until you do this).

**Step 4. Confirm the embed is on the pages.** Every file in
`site/dist/ghl/` already ends with the two embed lines (the
`<elevenlabs-convai>` tag and the widget script). If the agent id ever
changes, update `ELEVENLABS_AGENT_ID` in `site/build.py`, rebuild, re-paste.
Setting it to `""` removes the bubble from every page.

**Step 5. Test (5 minutes).** On the live site:

1. Open the bubble. The first line is Malik's. Type "what's the difference
   between systems and creative". He keeps them separate and ends with one
   next step. There is no call button and no mic: Malik is text only.
2. Say "I want the free audit". He asks for business, city, trade, name and
   email. Give test values and a real email. He says "Done. A real person on the team will follow up." The contact
   appears in E4L Services with `cs-malik-lead` and `cs-audit-request`, in
   the pipeline, with the Slack alert.
3. Ask "will this double my revenue". He must not promise results.
4. Ask "are you a real person". He says he is an AI and a real person reads
   the chat.
5. Read his replies for tone. He should sound like a professional
   consultant: plain English, no slang. If slang creeps in, the fix is the
   "How you talk" section of `site/malik-agent/system-prompt.md`.

If anything in 2 fails, check the tool URL (step 2) first, then the
workflow's trigger is published.

**Costs to know.** Malik is text only (the agent's *Text only* setting is
on), so chats are billed at the text rate and never as voice minutes. Keep it
that way. The agent's conversation log in
ElevenLabs → Agents → Malik → *Conversations* shows every chat and whether
`capture_lead` fired, which is the first place to look when a lead is missing.

## Why it's built this way

- One self-contained file per page is what GHL's Custom Code element accepts,
  and it's how the Scorecard already runs.
- All CSS is scoped under `.e4l` so GHL's own styles can't bleed in.
- Forms POST JSON to inbound webhooks, so leads land in the pipeline with the
  same tags and Slack alerts as the Scorecard.
- Images are referenced by URL, never embedded, to keep each paste small and
  fast and to let you swap a pose without touching code.
