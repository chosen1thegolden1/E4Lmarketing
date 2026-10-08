# Deploying the E4L Marketing site to GoHighLevel

This folder builds six self-contained HTML pages that paste straight into
GoHighLevel (GHL) funnel pages, the same way the Revenue Leak Scorecard was
deployed. Nothing here needs a server. Follow the order below; the only
things you type are URLs.

Everything lives in the **E4L Services** sub-account. Never the school.
Every asset you create is prefixed `CS-` per the mission brief.

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

**Option A, GHL Media Library (recommended).** In E4L Services open
Media Storage, create a folder `CS-site`, and upload every file in
`assets/malik/` and `assets/brand/` (including the hero animation `malik-wall-loop.mp4` and
`malik-wall-loop.webm`, plus its poster `malik-wall-poster.jpg` and the still fallback `malik-wall-still.jpg`). Copy the URL of any one uploaded file;
everything before the filename is your base URL. It must end with a slash.

**Option B, GitHub Pages.** The `deploy-pages.yml` workflow already publishes
`assets/` to the Pages site. The base URL is then
`https://<your pages domain>/assets/` (for the default project site that is
`https://chosen1thegolden1.github.io/E4Lmarketing/assets/`).

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
3. **Calendar.** Calendars → the 20-minute *Game Plan Call* calendar. Copy
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
"SCHOOL_URL":        "https://...",                # the school's public site
"SHOW_PRICES":       True,                         # False hides every dollar figure
```

Then run:

```bash
python3 site/build.py
```

The six files in `site/dist/ghl/` are now ready. (No Python on your
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
   - Home: title `Eat 4 Life Marketing | Your AI Guy`, description
     `AI Marketing Made Easy. Malik and the E4L team install, run, and improve
     the systems that answer your phone, follow up with every lead, and keep
     you visible.`
   - Others: use the `<title>` inside each file.
   - Favicon: the EFL gold mark.
5. Funnel settings → set `/404` as the 404 page if your GHL plan offers it.
6. Attach the services domain (not the school's).
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
- [ ] Phone check: no sideways scroll, buttons are tappable, menu opens.

## 6. Things you may want to change later

- **Copy.** Edit the files in `site/src/pages/`, rebuild, re-paste. Keep the
  guardrails: "AI Marketing Made Easy" only (never "Everybody Eats"), no
  promised results, every estimate carries its disclaimer.
- **Prices.** Flip `SHOW_PRICES` to `False` to hide every dollar figure and
  keep pricing on the call. The pages still read correctly without them.
- **The words on the wall.** They're live text in `site/src/pages/home.html` (the `wall-track` list, written twice so the loop is seamless). Edit, rebuild, re-paste.
- **Adding FAQs.** Add a question to `site/src/data/faqs.json` (question, answer, and Malik's one-liner), rebuild, re-paste `/faq`.
- **Malik poses.** Drop new transparent PNGs into `assets/malik/` with the same
  names (`malik-lean`, `malik-point`, `malik-thumbs`, `malik-peek`,
  `malik-arms`) and re-upload to the Media Library. No rebuild needed if the
  names match.

## Why it's built this way

- One self-contained file per page is what GHL's Custom Code element accepts,
  and it's how the Scorecard already runs.
- All CSS is scoped under `.e4l` so GHL's own styles can't bleed in.
- Forms POST JSON to inbound webhooks, so leads land in the pipeline with the
  same tags and Slack alerts as the Scorecard.
- Images are referenced by URL, never embedded, to keep each paste small and
  fast and to let you swap a pose without touching code.
