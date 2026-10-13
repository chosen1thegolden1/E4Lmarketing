# E4L Motion Studio

Launch videos, product ads and showreels made entirely in code: no After Effects, no animation skills.
Built from the guide *How to Build a Motion Design Studio With Opus 5.5*.

Claude writes a program; the studio turns the program into an MP4.
Every film is one function, `window.seek(t)`, that paints the exact frame for any moment.
A headless browser calls it thousands of times, ffmpeg stitches the frames together, and a code-synthesized
soundtrack is mastered to −14 LUFS and laid on top. Nothing depends on a live timer, so every render comes out
identical and changing a shot is a one-line edit plus a re-render.

**The prompt is 10% of the video. This folder is the other 90%.**

## First film: "Is AI recommending you?" (E4L Free AI Audit)

`films/e4l-ai-audit/` is an 18 s, 120 BPM promo for E4L's Free AI Audit, built from the real audit report UI.

| File | What it is |
|---|---|
| `out/final.mp4` | 9:16, 1080×1920, 60 fps, motion-blurred, with music (Reels / TikTok / Stories) |
| `out/final_1x1.mp4` | 1:1 feed version, same timeline |
| `out/final_16x9.mp4` | 16:9 YouTube / website version |
| `out/poster.png` | lockup frame for thumbnails |
| `docs/shotlist.md` | beat-by-beat plan, with the source of every on-screen fact |
| `docs/review_log.md` | scored critique rounds and what was fixed |

Everything on screen is real: the questions come from `geo/money-questions/`, and the report and receipts come
from **E4L's own audit of itself**. No lead's data is used. Competitor names in the AI answers are blurred.

## Setup (once)

```bash
cd motion-studio
npm install                       # Playwright (the Chromium here is preinstalled; otherwise: npx playwright install chromium)
pip install numpy librosa soundfile   # optional: beat measurement for supplied tracks + sync check
# ffmpeg with libx264 must be on PATH
```

Start Claude Code in `motion-studio/` (so `CLAUDE.md` is loaded). Effort: **xhigh** for new videos,
**max** when the first 3 seconds have to carry a big launch, **medium** for small fixes and re-renders.

## Make a video in one sentence

The `/motion-reel` skill (`.claude/skills/motion-reel/SKILL.md`) runs the whole pipeline:

```
/motion-reel for https://client-site.com, 20s, vertical, reference ./films/client/refs/frame.png
```

Longer prompts for each kind of job are in `templates/`:

| Template | Use it for |
|---|---|
| `01-product-video.md` | a launch / product video from a real URL |
| `02-reference.md` | copying the grammar (pacing, type, transitions) of a video you love |
| `03-state-list.md` | the "one container never cuts" UI film |
| `04-critique.md` | the harsh-motion-director review loop |
| `05-directors-brief.md` | longer films run overnight with workflow gates |

## The tools

| Command | Does |
|---|---|
| `node stills.mjs films/<name>` | one frame per shot-list beat → `out/contact_9x16.png` + `out/phone_9x16.png` (fast; no full render) |
| `node stills.mjs films/<name> --strip 4.2` | 12 consecutive frames at 4.2 s → glitch check on fast moments |
| `node stills.mjs films/<name> --format 1:1 --at 1,2.5,4` | specific moments in another format |
| `node render.mjs films/<name>` | full render, 60 fps, 4 blended subframes (real motion blur), H.264 CRF 16 |
| `node render.mjs films/<name> --format all` | 9:16, 1:1 and 16:9 from the same timeline |
| `node render.mjs films/<name> --draft` | 30 fps, no blur: fast pacing check |
| `node render.mjs films/<name> --from 4 --to 6` | re-render only the affected seconds |
| `node sound.mjs films/<name>` | synthesize `score.mjs` (or use `audio/track.wav`), master to −14 LUFS, mux onto every render, measure beats |
| `python3 beats.py song.wav > beats.json` | tempo, beats, downbeats and hits of a supplied track |
| `./review.sh films/<name> [t]` | contact sheet, strip, phone test, loop check and poster from the final MP4 |
| `npm test` | spring math, synth determinism, and the render contract for every film |

Render speed here: about 4 minutes per format for 18 s at full quality.

## How a film is built

```
films/<name>/
  index.html        canvas#c + fonts (local woff2)
  film.js           window.seek(t), window.FILM = { duration, bpm, beats }, window.ready
  score.mjs         the soundtrack, in code (lib/synth.mjs)
  prep-assets.mjs   re-runnable crops of the real product UI → assets/
  assets/           screenshots, fonts, logo
  docs/             style_guide.md, shotlist.md, review_log.md, cues.json
  out/              renders and review images (only final_*.mp4 and poster.png are committed)
```

- `lib/motion.js`: closed-form `spring()`, `track()` (one spring per target change, stacked), `life()`,
  seeded `rng()`/`noise()`, beat `grid()`, `mix()`, `rrect()`, `preload()`, `formatSize()`.
- `lib/synth.mjs`: kick, snare, clap, hats, bass, pad, pluck, whoosh, riser, click, tick, pop, thump, impact,
  a stereo `Mix` with sidechain, and a WAV writer. Deterministic.
- `films/_starter/`: the smallest film that follows the contract. Copy it to start a new one.

## Troubleshooting

- **Looks like every other AI video:** `CLAUDE.md` isn't loaded (start Claude Code inside `motion-studio/`), or
  you skipped the reference.
- **Motion feels cheap or floaty:** springs, not easing curves; check effort is xhigh.
- **Blurry text when it scales:** render text at full size; check `--strip` at that moment.
- **Render changes every time:** something uses `Math.random` or a timer; `npm test` catches it.
- **Fonts wrong in the render:** fonts must be local woff2 loaded via `@font-face`; `window.ready` waits for them.
- **Music and visuals drift:** re-run `beats.py` on the exact final track and re-time to it.
- **First try was mid:** normal. Run the critique loop 3 times before judging.

## Selling it (guide step 12)

A simple offer: a 20–45 s product video with original music, optional voiceover, the client's real UI and
features, a CTA at the end, every format, and up to 3 rounds of edits. Price on the value to the client, not on
how fast the AI is. Always use the client's real product, logo and footage **with their written permission**.
