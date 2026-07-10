---
description: Turn plain-English feedback about the last brief into concrete rule changes in CLAUDE.md — with a before/after diff and your confirmation before anything saves.
---

# /tune — Teach the Command Center

Sebastian pastes plain-English feedback about what the last brief got wrong (or
right). You translate each note into a concrete, minimal change to `CLAUDE.md` —
either a **Sender Rule** (Always ignore / Always surface) or a tweak to the
**importance rules** — then show a diff and wait for his explicit yes.

**The only file you may write is `CLAUDE.md`, and only after he confirms. Never
send, delete, or touch the mailbox. Never rewrite the profile silently.**

## Step 1 — Gather the feedback
The feedback is whatever Sebastian typed after `/tune`. If he ran `/tune` with
nothing, ask:
> What did the last brief get wrong? Plain English is perfect — e.g. "stop
> surfacing Amex offers", "always show me anything from Stripe", "meeting recaps
> should be FYI not ignore".

Read the latest `daily/` note and current `CLAUDE.md` for context so you map
feedback to the right senders and the right section.

## Step 2 — Translate each note into a concrete change
For each piece of feedback, decide the smallest correct edit:

- **"Ignore X / stop surfacing X"** → add `X` to **Always ignore** in Sender
  Rules. Prefer the specific address; use a whole `@domain.com` only if he means
  everyone there.
- **"Always show me X / never let me miss X"** → add `X` to **Always surface**.
- **"X should be FYI / not urgent / not noise"** → adjust the importance rules
  (🔴/🟡/⚪ lists) — e.g. move a category between buckets — rather than a sender
  rule, when it's about a *type* of mail, not one sender.
- **A new judgment principle** (e.g. "anything mentioning a chargeback is
  urgent") → add a bullet to the SURFACE-NOW / CAN-WAIT / IGNORE list it fits.

Rules of thumb:
- Make the **minimal** change that captures the intent. Don't refactor his
  profile or reword unrelated lines.
- Reuse existing structure/format exactly (e.g. `- sender@x.com — reason`).
- If a note is ambiguous (which sender? domain or just this address? which
  bucket?), ASK a quick clarifying question before writing anything.
- If feedback conflicts with an existing rule, point out the conflict and
  propose how to resolve it.

## Step 3 — Show a before/after diff and ask
Do NOT save yet. Present each proposed change clearly:

```
Proposed change 1 — Sender Rules › Always ignore
- BEFORE:  (none yet — add via /tune)
+ AFTER:   - offers@americanexpress.com — promo offers, never surface

Why: you said "stop surfacing Amex offers."
```

List every proposed change this way. Then ask exactly:
> Save these changes to CLAUDE.md? Reply **yes** to save all, or tell me which
> to keep/drop/adjust.

## Step 4 — Save only what he confirms
- On explicit **yes** (or "save 1 and 3", etc.), apply ONLY the confirmed edits
  to `CLAUDE.md` using precise, surgical edits. Replace the `_(none yet …)_`
  placeholder the first time a list gets its first real entry.
- If he says no / not now, change nothing.
- After saving, show a short recap of what's now in each list, and remind him the
  next `/brief` will apply the updated rules (inbox-analyst reads them first and
  cites which rule fired in each item's "why" line).

## Step 5 — Offer to commit
Ask if he wants the profile change committed/pushed. Never push without a yes.
