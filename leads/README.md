# Leads — sheet to GHL import

Turns the raw lead sheet (Google Sheets, one tab per vertical) into GHL-ready
CSVs. Sending plan and copy: `docs/COLD_START_KIT.md`.

## Regenerating after the sheet grows

1. Export the sheet — any tool that produces `{"fileContent": "<markdown tables>"}`,
   one markdown table per tab. (The Drive connector's `read_file_content` returns
   exactly this shape; save its output to a file.)
2. Run it:

```bash
python3 leads/prepare-import.py <sheet.json> --batch 2026-08-23
```

Writes one CSV per vertical to `leads/ghl-import/`, plus `<batch>-call-only.csv`
for any row with a phone but no email.

If you add or reorder tabs in the sheet, update `VERTICALS` at the top of
`prepare-import.py` to match — the script warns when the tab count disagrees but
it cannot tell that tab 3 became chiropractic.

## What the script does

- **Phones** → E.164 (`· \+1 510-616-9857` → `+15106169857`); drops anything
  that isn't a valid 10-digit US number
- **Websites** → strips `utm_*` and other query junk
- **Locations** → splits into City / State, normalizing full state names to
  two-letter codes
- **Names** → splits first/last, drops honorifics (`Nurse Wojton` → Wojton),
  bare initials (`Harry I` → Harry), and company names sitting in the person
  column. When there's no name and the mailbox is a single clean word
  (`lynn@…`), it uses that as the first name — `mpum@` and `j.smith@` are left
  blank rather than greeting someone as "Hi Mpum"
- **Emails** → validated, lowercased, deduped across every vertical, and
  classified `personal` vs `role` (`info@`, `office@`, `frontdesk@`, …)
- **Pipe-split rows** → a dozen company names contain a literal `|`
  (`FLOW HVAC NY | PTAC Installation & Repair NYC`) which the markdown export
  doesn't escape, shifting every column after it. Those get folded back into the
  company name — without this, twelve contacts import with a phone number in the
  name field
- **Tiers** → A (named person + personal email), B (named person + role
  mailbox), C (no name), written to a `Priority` column and a `priority:` tag

Nothing is silently dropped: the run prints a count for every rejected row and
why, plus any company appearing more than once so you don't email two people at
the same shop.

## Current batch — 2026-08-16

1,131 leads, zero dropped, no duplicates. 1,078 are tier A.

| Vertical | Leads | A | B | C |
|---|---:|---:|---:|---:|
| Roofing | 279 | 277 | 0 | 2 |
| Dental | 274 | 272 | 2 | 0 |
| HVAC | 256 | 226 | 1 | 29 |
| Med Spa & Aesthetics | 133 | 133 | 0 | 0 |
| Chiropractic | 118 | 118 | 0 | 0 |
| Dog Grooming | 71 | 52 | 6 | 13 |

Top states: FL (171), TX (163), NY (144), CA (91), GA (60). Heaviest single
city is New York at 109, mostly med spa and dental.

## Before you import

Run `npm run setup-outreach` from `voice-ai-demo-builder/` so the `cs_*` fields
the CSV maps into exist. Both setup scripts refuse to run outside E4L Services —
see `src/location-guard.js`.
