---
name: motion-reel
description: Make a product, launch or showreel motion video rendered from code in motion-studio/. Use when the user asks for a launch video, showreel, product reel, animated explainer, motion ad, or a short promo video for E4L or a client.
---

# Motion reel

Everything lives in `motion-studio/`. Read `motion-studio/CLAUDE.md` (the house rules) before writing any code,
and use `motion-studio/films/e4l-ai-audit/` as the worked example of every step below.

## Inputs to collect first (ask once, all together)
Product + URL, duration, formats (9:16 / 1:1 / 16:9), brand colors + fonts, a reference
(frame, video, or image folder), music (file or "synthesize"), the one real metric to show, the call to action,
and confirmation that we have the client's permission to use their product, logo and data.

## Pipeline
1. `cp -r motion-studio/films/_starter motion-studio/films/<name>`.
2. Gather assets from the URL with Playwright into `films/<name>/assets/` (real screenshots, real logo, fonts
   as local woff2). Write the crops as a re-runnable `prep-assets.mjs`. List what you found.
3. If a reference exists, extract frames (`ffmpeg -i ref.mp4 -vf fps=2 refs/f_%03d.png`), study them, and write
   `docs/style_guide.md`: palette (hex), type, shot lengths, transitions, camera moves, how text enters and exits.
   Take the grammar, never the content.
4. Music: supplied track → `audio/track.wav` + `python3 beats.py audio/track.wav > docs/beats.json`.
   Otherwise write `score.mjs` with lib/synth.mjs on a fixed BPM.
5. Write `docs/shotlist.md` on the beat grid (one state per bar, hook in the first 2 s, every number traced to a
   source). Show it and wait for OK.
6. Build `film.js` with `window.seek(t)` and lib/motion.js springs. One container that never cuts works well.
7. `node stills.mjs films/<name>` → read `out/contact_9x16.png` and `out/phone_9x16.png` → score 1-10 on hook,
   phone readability, motion, variety, composition, brand accuracy, sound sync → log in `docs/review_log.md` →
   fix the 3 worst. Use `--strip <t>` on every morph to catch empty or glitchy frames. 3 rounds minimum, all 8+.
   Repeat with `--format 1:1` and `--format 16:9`.
8. `node render.mjs films/<name> --format all` → `node sound.mjs films/<name>` → `./review.sh films/<name>`.
9. Deliver `out/final_*.mp4`, `out/poster.png`, `out/review_contact.png`. Say what you'd improve next.

## Hard rules
- Real product UI only. Never invent screens or numbers. Blur third-party names you don't want to promote.
- Never use a lead's or prospect's audit or data in a promo.
- No Math.random, no timers, no CSS transitions in render mode.
- Banned: corner labels, centered title on gradient, everything fading in, glow on UI, particle bursts.
- API keys only in `.env`, never in prompts or committed files.
