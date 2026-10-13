# Motion studio rules

Every film in `films/<name>/` is a program. Opus writes it, the renderer turns it into frames,
ffmpeg turns frames into an MP4. These rules apply to every film in this folder.

## Render contract
- Every film is a pure function of time: `window.seek(t)` paints frame t onto `<canvas id="c">`.
- No CSS transitions, no setTimeout, no requestAnimationFrame in render mode,
  no state carried between frames. Seeded noise only (`rng`/`noise` in lib/motion.js), never Math.random.
- The film exposes `window.FILM = { duration, bpm, beats: [...seconds of each shot-list beat] }`
  and `window.ready` (a promise that resolves once fonts and images are loaded).
- The page reads `?format=9:16|1:1|16:9` and lays out for that canvas. One timeline, every format.
- Render with `node render.mjs films/<name>`. Encode H.264 yuv420p, CRF 16, 60 fps, 4 subframes blended.

## Look
- Banned: centered title on a gradient, everything fading in, corner labels and frame borders,
  glow on UI, generic particle bursts, bouncy easing, dead time.
- One display font, one UI font. One accent color unless the brief says otherwise.
- Every 2 to 4 seconds something new must happen on screen.
- Real product UI only. Crop and animate real screenshots in `films/<name>/assets/`; never draw an
  invented interface. Never invent a metric: every number on screen must trace to a file in the repo.
- Use a client's name, logo or data only with their permission. Lead/prospect audits never go in a promo.

## Motion
- Springs, not easing curves: `spring()` and `track()` from lib/motion.js.
  Tiny overshoot on UI (stiff: k 260-400, d 22-30), none on type (k 120-200, d 2*sqrt(k)).
- Any value with more than one target uses `track()` (one spring per change, stacked).
- Text inside a morphing container enters after the morph starts and leaves before the next one.

## Sound
- Music and sound effects are synthesized in code (`films/<name>/score.mjs`, lib/synth.mjs)
  unless a track is supplied in `films/<name>/audio/`.
- Place hits on the beat grid. If a track is supplied, measure it: `python3 beats.py track.wav > beats.json`.
- Master to -14 LUFS (`node sound.mjs` does the loudnorm pass).

## Loop before you show anyone anything
1. `node stills.mjs films/<name>`: one frame per beat as a contact sheet, plus a phone-size sheet. LOOK at them.
2. Score 1-10 on: hook in first 2s, readability at phone size, motion quality, variety,
   composition, brand accuracy, sound sync. Log scores in `films/<name>/docs/review_log.md`.
3. Fix the 3 worst problems. Repeat until every score is 8+ (3 rounds minimum).
4. Only then do the full render, then `./review.sh films/<name>` for strip / loop checks.

## Keys
- API keys live in `.env` (ELEVENLABS_API_KEY etc.). Never paste a key into a prompt or a file that gets committed.
