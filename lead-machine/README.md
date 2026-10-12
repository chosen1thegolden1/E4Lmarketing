# E4L Lead Machine

Claude finds, qualifies, and researches ~10 small-business leads per weekday for Eat 4 Life Marketing's cold outreach, writes them to a dated Google Sheet in the **E4L Lead Machine** Drive folder, and keeps the machine's memory (who has been delivered, what was searched, which niches were judged) in this folder of the repo. Humans review the sheet and load approved rows into GoHighLevel. Nothing here contacts a prospect.

## Layout
| Path | What it is |
|---|---|
| `DAILY_RUN_PROMPT.md` | The operator prompt the scheduled daily session runs. Edit this to change how the machine behaves. |
| `playbook/context-pack.md` | Who E4L is, what it sells, the Service–Industry Matrix, voice rules, guardrails (ground truth for every agent). |
| `playbook/niche-playbook.md` | 59 niches scored for fit (core / extend / skip), entry offer, need signals, disqualifiers, decision-maker titles, find-them queries, plus the Niche Decision Rule for anything new (including ecommerce). |
| `playbook/rubric.md` | The 0–100 qualification rubric: hard disqualifiers, weighted dimensions, bands, minimum-evidence rule. |
| `playbook/owner-research.md` | How to learn everything public about the owner, with search tactics, verification rules, confidence labels, and a never-do list. |
| `playbook/attitude-model.md` | How to read a company's attitude from public signals and what to do about it. |
| `research/*.json` | The structured research the playbooks and sheet tabs are generated from. |
| `tools/hunt_workflow.js` | The reusable Workflow script: Scout → Deep research → Verify. |
| `tools/lead_schema.json` | The lead record every agent must return (= the sheet's columns). |
| `tools/make_spec.py`, `tools/build_sheet.py` | Generate the review workbook (README, Leads, GHL Import, playbook tabs, Suppression, Run Log, Niche Decisions). |
| `data/suppression.csv` | Clients + everyone already on an E4L outreach list (1,160 rows at creation). Add a row to block a company forever. |
| `data/seen.csv` | Every lead ever delivered (appended each run). |
| `data/targets.csv` | Niche × metro rotation plan with last-run dates. |
| `data/run-log.csv`, `data/niche-decisions.csv` | One row per run; one row per niche verdict. |
| `batches/YYYY-MM-DD.json` | The delivered lead records per run (the sheet is generated from these). |

## Daily loop
1. Scheduled session reads the playbooks and data files, picks 8–10 niche × metro targets (rotating, seasonal, ~75% core / ~25% extend).
2. `hunt_workflow.js` fans out: one scout per target → deep research of the top 1–2 → a skeptic verifies every deliverable lead against its cited pages.
3. Top 10 by score (min 55) become `batches/<date>.json` → workbook → Google Sheet "E4L Leads — <date>" in the Drive folder.
4. `seen.csv`, `run-log.csv`, `niche-decisions.csv`, `targets.csv` are appended; the batch is committed and pushed.
5. Final message = sheet link + one line per lead.

## Reviewing a batch (Chosen / Rozel)
Open the sheet's **Leads** tab, set **Review Decision** (Approve / Hold / Reject) and notes, then on the **GHL Import** tab filter column A to Approve and download CSV → GHL Contacts → Import. Columns map 1:1 to GHL fields; `Tags` carries `cold-outreach, lead-machine, status:drafted, industry:<niche>, city:<city>, entry:<offer>, attitude:<type>`; the `LM *` columns are optional custom fields (create once as single-line text, or skip and paste into a note).

## Changing the machine
- Block a company: add it to `data/suppression.csv` (or the Suppression tab of the master sheet and copy it over).
- Change what gets chased: edit `data/targets.csv` or the niche cards in `playbook/niche-playbook.md`.
- Change scoring: edit `playbook/rubric.md` (and `research/rubric.json` if you want the sheet's Rubric tab to match).
- Change the daily behavior: edit `DAILY_RUN_PROMPT.md` and update the Routine's prompt.

Rebuild the master sheet any time: `python3 tools/make_spec.py <all-leads.json> /tmp/master.json && python3 tools/build_sheet.py /tmp/master.json master.xlsx`.
