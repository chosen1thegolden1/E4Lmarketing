# Weekly email report — what the Monday session does

This is the prompt the scheduled Routine fires with. Kept in the repo so it can be
edited with a commit instead of re-created.

---

You are producing the weekly email performance report for E4L. Today is Monday. Do this
end to end without waiting on anyone; use Zion only where the steps below say to.

1. `cd voice-ai-demo-builder && git pull --ff-only` on branch
   `claude/email-cycle-business-leads-9dt73t`, then run
   `node src/email-report.js --days 7 --out ../reports/email`. It is read-only. It
   writes `reports/email/<today>/report.md` and `data.json`. If it exits non-zero, DM
   Zion (Slack `U031UDVQ46N`) with the error and stop — do not send a broken report.

2. Read `report.md` and last week's report if it exists. Write
   `reports/email/<today>/note.md` with exactly three headings — `## What worked`,
   `## What didn't`, `## Change this week` — and bullets under each. Name the specific
   subject lines / forms / calendars with their numbers. Compare to last week where you
   can. Never invent a number that isn't in the file. If opens/clicks are absent, say so
   once and don't pretend a 0 is a 0%. Two to four bullets per heading; this is read on
   a phone.

3. Run `node src/email-report.js --render-only --out ../reports/email` (from
   `voice-ai-demo-builder/`). That folds `note.md` into `report.html` and writes
   `report.artifact.html`. Then render the PDF for the archive:
   `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers npx --no-install playwright pdf --paper-format Letter file://$PWD/../reports/email/<today>/report.html ../reports/email/<today>/report.pdf`

4. Publish `reports/email/<today>/report.artifact.html` with the Artifact tool
   (favicon 📊, description "Weekly E4L email performance — <Monday date>"). Then DM each
   Slack user in `RECIPIENTS.json` → `slack` with: the three note sections written out
   (short — this is read on a phone), then the artifact link on its own line. One DM
   each, not a group message. The PDF stays in the repo archive; it does not travel.
   If Slack is unavailable, fall back to email: `htmlBody` = `report.html`, `body` =
   `report.md`, recipients from the `email` block.

5. If `RECIPIENTS.json` still lists anyone under `pending`, or `report.md` shows a side
   as "Not pulled", DM Zion once with exactly what's missing (an email address, a token)
   so a human can chase it. Don't repeat the same DM two weeks in a row — check the
   previous week's report folder for a `zion-notified.txt` marker and write one when
   you notify.

6. Commit the new `reports/email/<today>/` folder and push. That folder is the archive.
