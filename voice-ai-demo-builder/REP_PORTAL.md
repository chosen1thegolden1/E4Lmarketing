# Rep Portal — GHL Form → Demo Builder

Reps and affiliates submit leads through a branded GHL form. They never see
GitHub. No webhook, no tokens: a scheduled GitHub workflow polls GHL for new
submissions every 10 minutes and processes them with the secrets already
configured.

```
Rep fills form → (≤10 min) poller builds demo → page live + agent + number
  → contact tagged with rep code → outreach email sent to the lead
```

## The one thing to build (GHL → Sites → Forms → Builder)

Create a form named exactly: **Voice AI Demo Request**
(the poller finds it by this name — or set a different name in the
`DEMO_FORM_NAME` repo variable)

| Field label | Type | Required |
| --- | --- | --- |
| Lead Website | Single line / URL | yes |
| Lead Email | Email | yes |
| Rep Code | Dropdown — one option per rep (e.g. `alex`, `jordan`) | yes |

Field labels should contain the words **website**, **email**, and **rep** —
that's how the poller maps answers. Adding a new rep = adding a dropdown
option. The form's public link is the rep portal — share it, bookmark it,
embed it on a funnel page.

> Heads-up: GHL forms may also create a contact from the submission (the
> rep-entered lead email). That's fine — the builder upserts the same contact
> with the demo fields and tags.

## First-time verification

After building the form, submit one test entry (your own email as the lead).
Then either wait for the next 10-minute poll, or run it immediately:
GitHub → Actions → **Poll Demo Requests** → Run workflow. Watch the run:
it should build the demo, deploy the page, and email the "lead."

## How processing works

- `demos/processed-submissions.json` tracks handled submission IDs, so
  nothing is ever built twice. Failed builds (e.g. a site that blocks
  scrapers) are marked failed and not retried — resubmit with a corrected
  URL if needed.
- Lead emails are never written to the repo (it's public); they live only
  in GHL.
- Pool numbers assign/recycle automatically (see README).

## Rep accountability

- Filter contacts by `rep:<code>` tags for pipeline and commissions
- Form submissions list in GHL is the raw activity log
- `demos/registry.json` shows which rep's demo holds which pool number
