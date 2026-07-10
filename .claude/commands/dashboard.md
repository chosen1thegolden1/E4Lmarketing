---
description: Regenerate dashboard.html from the latest daily note and open it in the browser. Read-only, visual.
---

# /dashboard — Regenerate & Open the Visual Dashboard

Rebuild the Command Center's visual face from the most recent brief, then open
it. **Read-only and visual** — never sends, deletes, or archives anything.

## Step 1 — Find the latest brief
Look in `daily/` for the most recent `YYYY-MM-DD.md` note (prefer today's). Read
it — that's your data source: greeting/date, Top 3, calendar, the three inbox
buckets with counts, and time blocks.

- If there is **no** daily note yet, tell Sebastian there's nothing to visualize
  and offer to run `/brief` first. Do not invent data.

## Step 2 — Build the HTML
Read `.claude/dashboard-spec.md` and follow it exactly. Write a single
self-contained `dashboard.html` to the project root with the daily note's data
inlined (all CSS/JS inline, no external requests). Overwrite the existing file.

## Step 3 — Open it in the browser
Open the file with the OS default browser:
- macOS: `open dashboard.html`
- Linux: `xdg-open dashboard.html`
- Windows: `start dashboard.html`

Pick the command that matches the environment. If opening fails (e.g. a headless
/ remote session with no browser), say so and tell Sebastian the file is ready
at `dashboard.html` to double-click locally — and offer to show a preview.

## Step 4 — Confirm
Tell Sebastian the dashboard was regenerated from `[the note's date]` and
opened. Note it reflects that brief — to refresh with new mail/calendar data,
run `/brief` again.
