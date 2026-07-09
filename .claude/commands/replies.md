---
description: Draft replies in Sebastian's voice for each "Needs Reply" email in the latest brief. Shows drafts; only creates Gmail drafts on explicit yes. Never sends.
---

# /replies — Draft Replies (in Sebastian's voice)

Draft responses to today's Needs-Reply emails. **You never send. You do not even
create a Gmail draft unless Sebastian explicitly says so.**

## Step 1 — Load context
1. Read `CLAUDE.md` — especially **My Reply Voice**: warm, concise, confident,
   delivery-driven; professional but plain-spoken ("corporate but layman's") so
   the everyday person isn't overwhelmed, while still thorough and meaningful.
   Direct and personal (e.g. "Copy that! Will follow up tomorrow.").
2. Find today's brief at `daily/YYYY-MM-DD.md` and take its **Needs Reply** list.
   If there's no brief for today, run `/brief` first (or ask if he wants you to).

## Step 2 — Get what you need to reply well (READ-ONLY)
For each Needs-Reply item, use the Gmail connector to READ the full thread
(`get_thread` / `get_message`) so the draft actually answers what was asked.
Do not send, label, archive, or modify anything while reading.

## Step 3 — Draft in his voice
For each email, write a ready-to-send reply that:
- Sounds like Sebastian: warm, concise, confident, plain-spoken, personal.
- Directly addresses the ask; if something needs a decision only he can make,
  leave a clearly marked `[[Sebastian: confirm X]]` placeholder rather than
  guessing.
- Notes when the right move is to hand off to Rozel or the team.
- Keeps it short. No corporate fluff.

## Step 4 — Show the drafts, then STOP
Present all drafts in chat like this:

```
## Draft 1 → [recipient] · Re: [subject]
[draft body]
—
## Draft 2 → …
```

After showing them, ASK:
> Want me to save any of these as Gmail drafts? Tell me which (e.g. "1 and 3",
> "all", or "none"). I will NOT send anything — you'd send from Gmail yourself.

## Step 5 — Only on explicit yes, create Gmail DRAFTS (never send)
- If (and only if) Sebastian names which ones to save, create them with the
  Gmail connector's **create draft** tool (`mcp__Gmail__create_draft`) — as
  DRAFTS in the correct thread. Never use any send action.
- Confirm which drafts were created and remind him they're sitting in his Gmail
  Drafts folder for him to review and send himself.
- If he says none, change nothing.

Hard rule: no message ever leaves the account through you. Sending is 100% his.
