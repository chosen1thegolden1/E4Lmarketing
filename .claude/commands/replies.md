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
Present all drafts in chat, NUMBERED so he can refer to them ("save 1 and 3"):

```
## Draft 1 → [recipient name] · Re: [subject]
[draft body]
—
## Draft 2 → …
```

After showing them, ASK exactly:
> Want me to save any of these as Gmail drafts? Tell me which (e.g. "save 1 and
> 3", "all", or "none") — or tell me to tweak one first. I will NOT send
> anything; you'd send from Gmail yourself.

Then STOP and wait. Do nothing to the mailbox until he replies.

## Step 5 — If he wants edits first, revise BEFORE saving
If he asks to change a draft ("make 2 warmer", "drop the last line", "add that
I'll call Friday"), revise that draft and re-show it. Do not save yet — loop back
to the Step 4 question until he tells you which to save. Never create a draft he
hasn't seen in its final form.

## Step 6 — On explicit approval, create Gmail DRAFTS (never send)
Only when Sebastian names which to save (e.g. "save 1 and 3", "all"):

For EACH approved draft:
1. **Pull the full thread again for accuracy** — use `mcp__Gmail__get_thread` /
   `get_message` to get the exact original message being replied to, so the
   draft attaches to the right thread and quotes correctly.
2. **Create it as a DRAFT** with `mcp__Gmail__create_draft`:
   - `replyToMessageId` = the ID of the message being replied to (so it lands in
     the correct thread, not a new email).
   - `to` = the sender's **plain email address only** (e.g.
     `rozel@gsgagency.com`) — the tool rejects the "Name <email>" format. Add
     `cc` only if the original thread clearly warrants it.
   - `subject` = "Re: [original subject]".
   - `body` = the approved reply text (with any `[[Sebastian: confirm X]]`
     placeholders left intact so he sees them in Gmail).
   - **Never** call any send tool. `create_draft` only drafts — keep it that way.
3. Note the returned draft ID.

If he says "none" / "not now", change nothing and end.

## Step 7 — Confirm exactly what was created
Report precisely, e.g.:
> ✅ Created 2 Gmail drafts (unsent, in your Drafts folder):
> 1. → WESTSTAR Relocation Inc · "Re: Invoice #…" (draft id …)
> 3. → American Express · "Re: …" (draft id …)
> Nothing was sent. Open Gmail → Drafts to review and send them yourself.
List any you did NOT save (e.g. "Draft 2 skipped per your call"). If a draft
failed to create, say so plainly and offer to retry — never pretend it saved.

Hard rule: no message ever leaves the account through you. Sending is 100% his.
