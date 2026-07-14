---
description: Set or update this week's goals (Lead Gen, Content, Admin, Agent Building, etc.). /brief turns them into small daily moves. Shows a diff and saves on your yes.
---

# /goals — Set This Week's Goals

Manage Sebastian's weekly goals in `goals/this-week.md`. `/brief` reads this file
and generates a short daily "Today's Moves" checklist that ladders up to it.

**The only file you write is `goals/this-week.md`, and only after he confirms.**
Read-only toward mail and calendar. Never send anything.

## Step 1 — Understand the request
The text after `/goals` is Sebastian's input. Handle these cases:
- **Pasting a new list of goals** → parse it into the category buckets.
- **"show" / nothing** → display the current `goals/this-week.md` and its progress
  (how many items checked vs. open), then ask if he wants to change anything.
- **"add …" / "drop …" / "done with …"** → make that targeted change.
- **New week / "start fresh"** → move any unfinished items forward and clear the
  rest (see Step 4).

## Step 2 — Structure the goals
Sort each goal under the right category (create/rename categories to match how he
talks — Lead Gen, Content Creation, Admin, Agent Building, Sales, Ops, etc.).
Keep each goal **specific and finishable within the week**. If something is huge
("build the whole agent"), note it — `/brief` will still slice small daily moves
from it, but a right-sized weekly goal works best. If a goal is vague, ask one
quick clarifying question rather than guessing.

Set the week header to the current Mon→Sun range (use today's date).

## Step 3 — Show a before/after diff and ask
Do NOT save yet. Show what will change:

```
Weekly Goals — proposed
## 🧲 Lead Gen
+ [ ] 50 cold DMs to e-comm founders
## ✍️ Content Creation
+ [ ] 3 short-form videos scripted + posted
...
```

Then ask:
> Save these as this week's goals? (yes / adjust / no)

## Step 4 — Save on confirmation
- On yes, write `goals/this-week.md`. Preserve the checkbox state of any goal
  that's carrying over. On a fresh week, keep unfinished `[ ]` items, drop
  completed `[x]` ones, and update the week header.
- Confirm what's now set, and remind him the next `/brief` will turn these into
  today's moves.

## Step 5 — Offer to commit
Ask if he wants it committed/pushed. Never push without a yes.
