# The Guardian Agency PLLC – website

Single-page marketing site with a 10-step quiz funnel, an interactive "own your bank" calculator, and a results screen that hands off to a PDF packet and a calendar booking.

Plain HTML, CSS and JavaScript. No build step. Host it anywhere (Netlify, Vercel, GitHub Pages, GoHighLevel custom code, cPanel).

## Files

```
guardian-agency/
├── index.html          the whole page (hero → coverage → own your bank → how it works → quiz → about → FAQ → CTA)
├── css/styles.css      palette tokens at the top, everything else below
├── js/config.js        ← the only file you need to edit to go live
├── js/main.js          nav, tilt cards, count-up numbers, reveal on scroll, bank calculator + chart
├── js/quiz.js          quiz steps, live age line, estimate model, lead submit, results
└── assets/             logo placeholder now; brochure PDF and agent photo later
```

## Go-live checklist (all in `js/config.js` unless noted)

1. **Agent name, phone, email, city** – `agentName`, `phone`, `phoneHref`, `email`, `emailHref`, `location`.
2. **Where leads go** – set `leadWebhookUrl` to a GoHighLevel inbound webhook, Zapier/Make hook or Formspree endpoint. Leads post as JSON with every quiz answer plus the estimate.
3. **Calendar** – set `calendarUrl` to a Calendly / GoHighLevel / Acuity link. The placeholder box on the results screen becomes the live scheduler.
4. **Brochure** – save the packet as `assets/guardian-packet.pdf` (or change `brochureUrl`). Until it exists the download button explains that instead of 404ing.
5. **Logo** – replace `assets/logo-placeholder.svg` (referenced twice in `index.html`).
6. **Agent photo** – replace the `.photo-placeholder` block in the About section with an `<img>`.
7. **Legal** – add license numbers and real Privacy / Terms links in the footer.

## Quiz questions (in order)

Goal → Date of birth → Gender → Tobacco → Health → Coverage amount → Monthly budget → Own-your-bank interest → State → Contact + consent.

The estimate is illustrative term-life pricing driven by age, gender, tobacco, health class and coverage. Tune the multipliers in `estimate()` inside `js/quiz.js` if real carrier quotes come in higher or lower.

## Own-your-bank calculator

`project()` in `js/main.js` uses a simple model: heavier policy costs in years 1–3, lighter through year 7, then mostly growth at `CONFIG.illustration.creditedRate` (6% default). The results screen reuses the same model so the numbers match. Every illustration on the site carries a "not a guarantee" note; keep it.

## Colors

| Token | Hex | Used for |
|-------|-----|----------|
| white | `#FFFFFF` | ground |
| sky | `#CDE8FA` | baby-blue accents, chips, soft buttons |
| sky-tint | `#EEF7FD` | section washes, tile backgrounds |
| navy | `#0A2A5E` | headlines, dark highlights |
| blue | `#1E5EEB` | buttons, links, progress |
| gold | `#F5B840` | "growth" moments in the own-your-bank sections only |
