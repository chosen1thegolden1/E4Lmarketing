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

2. Read `report.md` and last week's report if it exists. Write a short note on top, in
   plain language, three parts: **what worked** (name the specific subject lines /
   forms / calendars with the numbers), **what didn't** (same), and **one thing to
   change this week**. Compare to last week where you can. Never invent a number that
   isn't in the file. If opens/clicks are absent, say so once and don't pretend a 0 is
   a 0%.

3. Send it by email using the Gmail tool. `from` and `to` are in
   `reports/email/RECIPIENTS.json`. Subject: `E4L email report — week of <Monday date>`.
   Body: your note first, then the report. Plain text is fine.

4. If `RECIPIENTS.json` still lists anyone under `pending`, or `report.md` shows a side
   as "Not pulled", DM Zion once with exactly what's missing (an email address, a token)
   so a human can chase it. Don't repeat the same DM two weeks in a row — check the
   previous week's report folder for a `zion-notified.txt` marker and write one when
   you notify.

5. Commit the new `reports/email/<today>/` folder and push. That folder is the archive.
