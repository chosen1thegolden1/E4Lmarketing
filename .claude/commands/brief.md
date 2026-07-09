---
description: Run inbox + calendar analysts in parallel and write Sebastian's Morning Brief (also saved to daily/).
---

# /brief — Morning Brief

Produce Sebastian's Morning Brief. Everything here is **READ-ONLY**: you gather
and summarize, you never send, draft, archive, delete, or change a calendar
event.

## Step 1 — Read the profile
Read `CLAUDE.md` so the brief reflects his VIPs, importance rules, and voice.

## Step 2 — Run both analysts IN PARALLEL
In a SINGLE message, spawn BOTH sub-agents at once (two Task/Agent tool calls in
one turn) so they run concurrently:
- `inbox-analyst` — triage unread + last-24h mail into Needs Reply / FYI / Ignore.
- `calendar-analyst` — today + tomorrow morning, with conflicts and prep flags.

Wait for both to return before writing the brief. If one fails (e.g. connector
not authorized), note it in the brief and continue with what you have.

## Step 3 — Write the Morning Brief
Use today's date from the environment. Format:

```
# ☀️ Morning Brief — [Weekday, Month D, YYYY]

## 1. Top 3 Things That Matter Today
1. …
2. …
3. …
(Pull from the highest-priority Needs-Reply emails + most important meetings.
Money, client needs, deadlines, compliance, and VIPs win. Be specific and
action-oriented.)

## 2. Calendar at a Glance
[calendar-analyst output: today's timeline in PST, tomorrow-morning peek,
conflict ⚠️ / back-to-back 🔁 / prep 📋 warnings.]

## 3. Inbox
### 🔴 Needs Reply (N)
- …
### 🟡 FYI (N)
- …
### ⚪ Ignore (N)
- [grouped counts]

## 4. Suggested Time Blocks
Three concrete blocks for today, fitted AROUND the calendar (don't schedule over
meetings). Tie each to a real priority, e.g.:
- **[9:00–10:00 PST] Deep work:** …
- **[13:00–13:45 PST] Replies:** clear the Needs-Reply queue (run /replies)
- **[16:00–16:30 PST] …**
```

## Step 4 — Save a copy
Write the same brief to `daily/YYYY-MM-DD.md` (use today's date). If the file
already exists, overwrite the brief section but preserve any `## Wrap-Up` section
already appended by `/wrap`. Create the `daily/` folder if it doesn't exist.

## Step 5 — Close
Show the brief in chat. Then remind Sebastian he can run **`/replies`** to draft
responses to the Needs-Reply items, and **`/wrap`** at end of day.

Reminder: never act on the mailbox or calendar. Draft nothing here — that's
`/replies`, and even then only with his explicit yes.
