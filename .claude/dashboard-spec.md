# Dashboard Spec — dashboard.html

Shared build spec for the Command Center's visual face. Both `/brief` and
`/dashboard` use this so the dashboard always looks the same.

## Hard rules
- **One file, fully self-contained.** All CSS and JS inlined. No external
  requests — no CDNs, no web fonts, no remote images, no fetch/XHR. Must open by
  double-click as `file://` with zero network.
- **Read-only and visual.** NO forms, NO buttons that send/reply/delete/archive.
  It only displays the brief. Links to open an email thread in Gmail (regular
  `https://mail.google.com/...` `target="_blank"`) are fine — those just view.
- **Data is inlined**, not loaded. Bake the brief's values straight into the
  HTML you write. Never reference the daily note file at runtime.
- **Theme-aware & responsive.** Support light and dark via
  `prefers-color-scheme`. Mobile-friendly: columns stack on narrow screens, no
  horizontal page scroll.

## Data source
Pull every value from the current brief (today's `daily/YYYY-MM-DD.md` and the
analyst outputs): the greeting/date, Top 3, calendar timeline, the three inbox
buckets with their items and counts, and the suggested time blocks. If a section
is empty, render a friendly empty state ("Inbox zero 🎉", "No meetings — clear
runway for deep work"). If a connector wasn't authorized, show a subtle notice
card in that section instead of faking data.

## Layout (top to bottom)
1. **Header** — big greeting keyed to time of day ("Good morning, Sebastian"),
   today's full date, and a small "Eat 4 Life · Command Center" wordmark.
2. **Top 3 hero** — three numbered cards, visually the loudest thing on the page.
   Each: a short bold headline + one line of context. This is the "if you do
   nothing else" row.
3. **Calendar timeline** — today's events as a vertical timeline (time on the
   left, event on the right), times in **PST**. Badge conflicts (⚠️),
   back-to-backs (🔁), and prep-needed (📋). Include a small "tomorrow morning"
   subsection if present.
4. **Inbox — three columns** — Needs Reply / FYI / Ignore, each a column with a
   count pill in its header. Needs-Reply cards show sender · what they want ·
   suggested action, and use the accent color. FYI is neutral. Ignore is muted /
   condensed (grouped counts are fine). Columns stack vertically on mobile.
5. **Suggested time blocks** — the day's three blocks as a simple horizontal (or
   stacked) set of cards: time range + what to focus on.
6. **Footer** — "Generated at [timestamp] · Read-only · Nothing is sent without
   your yes." Use the real generation time; PST.

## Style direction
- Clean, modern, calm. Card-based on a soft background. Generous whitespace.
- A single accent color for priority/Needs-Reply (a confident blue or emerald).
  Red only for genuine conflicts/urgent. Muted gray for Ignore/noise.
- System font stack (e.g. `-apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, sans-serif`) — no web fonts.
- Priority coding consistent with the brief: 🔴 Needs Reply, 🟡 FYI, ⚪ Ignore.
- Use CSS custom properties for colors so light/dark stay consistent.
- Keep it tasteful and executive — this is the CEO's morning cockpit, not a toy.

## Title
`<title>` = "Command Center — [Weekday, Month D]".

Write the finished HTML to `dashboard.html` in the project root (overwrite).
