---
description: Capture something you need from someone (Rozel, the team) and route it to them on Slack — drafted in your voice, sent only on your explicit yes. Tracks status in handoffs.md.
---

# /handoff — Delegate a Task to Someone

Sebastian says what he needs and from whom; you log it, draft a clear Slack
message in his voice, and — only on his explicit yes — send it. Then track it so
he can see what he's waiting on.

**Sending a Slack message is an outward action: NEVER send without an explicit
"yes." Default to showing the draft first. Nothing else is written except
`handoffs.md`.** Read-only toward mail/calendar.

## Step 1 — Understand the ask
The text after `/handoff` is the request. Common shapes:
- **"I need <X> from <person> [by <date>]"** → a new handoff.
- **"list" / "show" / nothing** → show open + sent handoffs from `handoffs.md`.
- **"done <X>" / "<person> finished <X>"** → mark that item Done.
- **"remind <person>" / "nudge <X>"** → draft a follow-up on an already-sent item.

If who or what is unclear, ask one quick question before doing anything.

## Step 2 — Resolve the person (Slack)
Map the named person to a Slack user. Use the VIP list in CLAUDE.md for their
email (e.g. Rozel = rozel@gsgagency.com, Wilbert = wilbertr@gsgagency.com), then
`slack_search_users` to find their Slack account. If it's meant for a channel,
find it with `slack_search_channels`. If there's any ambiguity (multiple
matches, unknown person, DM vs channel), ASK which before drafting.

## Step 3 — Log it as Open
Add the item to `handoffs.md` under **🔴 Open**:
`- [ ] <what you need> — @person · asked <today> · due <date or "—"> · status: Open`

## Step 4 — Draft the Slack message in Sebastian's voice
Warm, concise, confident, plain-spoken, direct — per CLAUDE.md ("My Reply
Voice"). Make it easy for the person to act:
- What he needs, in one or two lines.
- Any context they need to do it.
- The due date if given, and whether it can be handed further/asked-back.
Keep it short. Sign off the way he would ("Appreciate you — thanks!").

## Step 5 — Show the draft, then STOP
Present it clearly and ask:

```
Handoff → @Rozel (Slack DM)
"[drafted message]"
```
> Send this to @Rozel on Slack? (yes / edit / no) — I won't send until you say yes.

If he wants edits, revise and re-show. Never send an unseen version.

## Step 6 — On explicit yes, send via Slack
- Send with `slack_send_message` to the resolved DM/channel. (If he prefers to
  send it himself, use `slack_send_message_draft` instead so it sits as a draft.)
- Update that item in `handoffs.md`: move it to **📤 Sent (awaiting them)** and
  set `status: Sent <date>`.
- Confirm exactly what was sent and to whom. If he said no, leave it Open and
  send nothing.

## Step 7 — Closing the loop
When Sebastian says something's done (or `/wrap` surfaces it), move that item to
**✅ Done** in `handoffs.md`. `/brief` reads the Open + Sent items so he always
sees what he's waiting on.
