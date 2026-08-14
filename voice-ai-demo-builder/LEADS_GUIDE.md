# Lead List Generator — Ops Guide

This tool pulls a list of businesses from Google Places, drafts a personalized cold email for each, and stages them in GHL as contacts tagged `status:drafted`. A human (Rozel) reviews the batch in a spreadsheet, then Sebastian fires the approved ones.

## For Sebastian: pulling a batch

```bash
npm run leads -- --industry="roofing" --city="Austin" --count=20
```

Options:
- `--industry` — required. Any keyword Google Places understands (roofing, dental, med spa, real estate, HVAC, salon, gym, etc.)
- `--city` — required. City or metro name
- `--count` — how many drafts to produce (default 20, max 60 per query)
- `--scorecard-url` — override the CTA link (default: `https://e4lmarketingdemos.com/scorecard`)
- `--no-push` — skip GHL upsert, only write the CSV (rare — for dry runs)

Output: a CSV at `leads-out/YYYY-MM-DD-<industry>-<city>.csv` and a corresponding set of GHL contacts tagged `cold-outreach` + `industry:X` + `city:Y` + `status:drafted`, each with the drafted email attached as a Note.

## Which verticals work best today

Hit rate depends on how often the vertical's businesses put an email on their homepage:

| Vertical | Hit rate | Notes |
|---|---|---|
| **Roofing / HVAC / plumbing** | 60–80% | Trades want direct email for RFQs. Easiest wins. |
| **Real estate agents** | 70–80% | Personal branding = personal email. |
| **Law firms** | 50–60% | |
| **Dental / medical** | 40–50% | |
| **Restaurants / cafés** | 30–40% | |
| **Med spa / salon / aesthetics** | ~15% | Most hide behind contact forms. Consider Hunter.io integration for these — see `src/leads/hunter.js`. |

Pull med-spa clients through the demo builder pipeline (personalized voice AI demo) instead — that path doesn't need pre-existing email.

## For Rozel: reviewing a batch

You'll get a message with a CSV file or Google Sheet link and a note like *"20 roofing leads Austin — review please"*.

### What to do

1. **Open the sheet.** Each row is one potential client. Read the draft email in the "Body" column.

2. **For each row, ONE of these:**
   - ✅ **Looks good** → type `TRUE` or `yes` in the "Send?" column
   - ✏️ **Almost good** → edit the "Body" text however you want, then mark `TRUE`
   - 🚫 **Skip** → leave "Send?" blank. Optionally note why in "Notes"

3. **Ping Sebastian:** *"Sheet is ready."*

### What to skip

- Wrong industry (Google occasionally returns adjacent businesses)
- National chains or franchises (25+ locations)
- No obvious personalization in the draft (the opening line should reference something specific)
- Sketchy-looking email addresses (weird domain, gibberish)

### Time budget

Aim for **30–45 seconds per row**. Twenty leads = ~15 minutes. Speed up if the draft is obviously good.

### After sends go out

Sent contacts land in GHL tagged `status:sent`. If anyone replies, it flows into Conversations like any other email thread — that's when Sebastian takes over.

## For Sebastian: sending the approved batch

Once Rozel signs off:

```bash
npm run leads -- --send --file=leads-out/2026-08-14-roofing-austin.csv
```

The tool reads the sheet, sends only rows with `Send?` = `TRUE`/`yes`/`1`/`x` (any truthy value), and updates each contact's tag from `status:drafted` → `status:sent`. Failures are reported per-row without stopping the batch.

## Deliverability discipline (until Abdullah finishes Task 3)

Cold email volume from a new sending domain gets throttled by mail providers. Warm-up schedule:

- **Week 1:** ≤10 sends/day
- **Week 2:** ≤20 sends/day
- **Week 3:** ≤40 sends/day
- **Week 4+:** scale to demand

Once the E4L Services dedicated sending domain is verified in GHL (Abdullah's Task 3), these numbers can climb. Until then, send from Sebastian's personal Gmail for high-priority prospects — better deliverability than the shared GHL infrastructure for one-off outreach.
