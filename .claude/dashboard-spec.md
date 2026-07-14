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
3.5. **Today's Moves** (only if the brief has them) — a checklist card right
   after the Top 3, styled as gold checkbox rows: an empty gold-outlined box, the
   task text, and a small muted tag for the goal it advances. Checked/carried
   items (from the daily note's `[x]`) render with a filled gold check and
   strikethrough. This is the "knock it down" list toward the weekly goals — keep
   it prominent but lighter than the Top 3 hero. Omit the section if none.
4. **Inbox — three columns** — Needs Reply / FYI / Ignore, each a column with a
   count pill in its header. Needs-Reply cards show sender · what they want ·
   suggested action, and use the accent color. FYI is neutral. Ignore is muted /
   condensed (grouped counts are fine). Columns stack vertically on mobile.
5. **Suggested time blocks** — the day's three blocks as a simple horizontal (or
   stacked) set of cards: time range + what to focus on.
6. **Footer** — "Generated at [timestamp] · Read-only · Nothing is sent without
   your yes." Use the real generation time; PST.

## Style direction — Eat 4 Life brand
- **Brand palette (use ONLY these, per the brand guidelines):**
  - **Gold** `#FFC200` — the single accent (priority, highlights, num badges,
    accent bars, wordmark). On light backgrounds use a darker gold for TEXT
    (`#8a6d00`) to stay legible; keep `#FFC200` for fills/borders/badges. On
    dark backgrounds `#FFC200` text is perfect.
  - **Black** `#000000` (near-black `#0a0a0a` for surfaces) and **White**
    `#FFFFFF`. Everything is black/white/gold — no blues, reds, greens, ambers.
  - For an "urgent/overdue" tag, stay on-brand: black pill with gold text (light
    mode) / gold pill with black text (dark mode). Do NOT introduce red.
  - Ignore/noise = muted gray only.
- **Dark mode is on-brand and premium:** black background, white ink, gold
  accent (mirrors the brand's dark-BG logo variant). Light mode: warm off-white
  bg, white cards, black ink, gold accents.
- Brand fonts are **Fineday** (display) and **Rethink Sans** (body) — NOT
  web-safe and we allow no external requests, so use a system stack:
  body `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  optionally a system serif (Georgia) for the big greeting/wordmark to nod at
  the display font. Never fetch a web font.
- Priority coding: 🔴 Needs Reply (gold accent), 🟡 FYI (neutral), ⚪ Ignore (muted).
- Use CSS custom properties for colors so light/dark stay consistent.
- Clean, modern, calm, card-based, generous whitespace. Tasteful and executive —
  the CEO's morning cockpit, not a toy.

## Title
`<title>` = "Command Center — [Weekday, Month D]".

Write the finished HTML to `dashboard.html` in the project root (overwrite).
