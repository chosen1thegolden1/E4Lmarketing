---
description: End-of-day wrap. Asks what got done, then summarizes open loops and carry-overs for tomorrow and appends them to today's daily note.
---

# /wrap — End-of-Day Wrap

Close out Sebastian's day: capture what got done, surface open loops, and tee up
tomorrow. **READ-ONLY** toward mail and calendar — never send, delete, or change
anything. The only file you write is today's `daily/` note.

## Step 1 — Load today's context
- Read `CLAUDE.md`.
- Read today's brief at `daily/YYYY-MM-DD.md` if it exists, so you know what the
  day started with (Top 3, Needs Reply, meetings).

## Step 2 — Ask what got done
Ask Sebastian directly, and keep it easy to answer:
> How'd the day go? Quick hits:
> 1. What got done? (wins, sent replies, closed items)
> 2. Anything still open or waiting on someone?
> 3. Anything new that landed today I should carry forward?

Wait for his answer. If he's brief, that's fine — work with what he gives you.

## Step 3 — Reconcile against the brief
Compare what he said against today's Top 3 and Needs-Reply list:
- Mark what's **done**.
- Identify **open loops** — Needs-Reply items not yet handled, unfinished Top 3,
  anything waiting on Rozel/team/client/legal.
- Note **carry-overs** for tomorrow, and flag deadlines or time-sensitive items.

## Step 4 — Append a Wrap-Up to today's note
Append (do not overwrite) this section to `daily/YYYY-MM-DD.md`:

```
## 🌙 Wrap-Up — [Weekday, Month D, YYYY]

### ✅ Done today
- …

### 🔄 Open loops
- … (who it's waiting on / next step)

### ➡️ Carry over to tomorrow
- … (⏰ note any deadlines)

### 📌 Notes for morning brief
- Anything /brief should surface first thing tomorrow.
```

If a `## 🌙 Wrap-Up` section already exists for today, update it rather than
adding a duplicate.

## Step 5 — Close
Show the Wrap-Up in chat and confirm it's saved to today's note. Sign off short
and warm, the way Sebastian would ("Locked in. See you in the morning.").
