---
name: ig-story-editor
description: Anchor skill for editing E4L Instagram Stories/Reels from a brief. Use whenever the user sends a video brief, raw clips, or names an IG effect style (graph rise, glass text, orbit spin, pull-out reveal, phone frame, dolly zoom, news wall, frame pop, punch-through, green screen, interface world, tick list, sketch boil, kinetic captions, effect showcase, card wall, page highlight, kinetic CTA). Holds the house style, render pipeline, and the index of per-style skills.
---

# IG Story Editor — anchor

Reference: a 23s vertical ad (studied 2026-11) that demos one effect after another
over a talking head and then hands off to a montage, a landing page, and a CTA. Every effect in it has its own
skill. This file holds what they all share.

## Workflow when a brief comes in
1. Read the brief and list the beats: hook, the points, proof, CTA.
2. Give each beat a style from the index below. Never use the same effect twice in a row.
   Change the visual every 1.2 to 2.0 s.
3. Transcribe the A-roll to get word timings (see Captions). Line each effect up so it lands on
   the word it illustrates.
4. Build each layer, composite, export, then send a contact sheet plus the MP4 to the user for review.
5. When a style gets tweaked, write the change back into that style's SKILL.md so the next edit starts from it.

## Canvas & export
- 1080x1920, 30 fps, H.264 High, yuv420p, AAC 48 kHz, `-movflags +faststart`. Keep total length at 60 s or less.
- Safe zones for IG Stories: keep text out of the top 250 px and the bottom 340 px.
  Captions sit at about y=1150 to 1350 (lower-middle).
- Phone uploads are often rotated (display matrix -90). Let ffmpeg autorotate and check with ffprobe.

## Look
- Palette: accent yellow `#FFD84D` (highlighter/marker, key words), white `#FFFFFF`,
  ink `#111111`, paper cream `#F4EFE3`, UI violet `#5B3DF5` (green-screen backdrop),
  dark room vignette `#0B0B0C`.
- Type: heavy geometric sans for captions and headlines (Inter Black / Montserrat ExtraBold).
  Serif for "editorial" UI moments (Instrument Serif / Georgia). Mono or wide-tracked caps for
  labels like counters, "INSIDE THE LAB", month ticks.
- Cards: rounded rect r=28 px, 3 px white stroke at 85 % opacity, soft shadow 0 20 60 rgba(0,0,0,.45).
- Motion: easeOutCubic for entrances, easeOutBack (overshoot 1.15) for pops, 6 to 10 frame entrances.
  Nothing fades in slowly. It slams, pops, or wipes.

## Captions (on every A-roll beat; see `ig-fx-kinetic-captions`)
1 to 3 words on screen at a time, white heavy sans with a drop shadow. The key word of each phrase is yellow.
Words appear in time with speech.

## Render pipeline (tools in this container)
- **ffmpeg**: cuts, scale/crop, overlays, zoompan, final mux.
- **Playwright + HTML/CSS** for motion-graphic layers. Render a transparent PNG sequence
  (`page.screenshot({omitBackground:true})` per frame, driving a `t` variable), then overlay it with ffmpeg.
  Use this for cards, notes, charts, UI mockups, and kinetic type.
- **Python (PIL/numpy/opencv)** for per-frame compositing and mattes.
- **Subject matte** (needed by orbit spin, phone frame, dolly zoom, frame pop, green screen,
  interface world, sketch boil, glass text occlusion): `pip install rembg onnxruntime` or
  `mediapipe` selfie segmentation. Run it per frame, feather 3 px, then temporal-smooth the alpha.
- **Transcription**: faster-whisper with word timestamps. Fall back to the ElevenLabs transcribe tool.
- Keep work files in the scratchpad. Only skills and final deliverables go into the repo.

## Style index
Effect skills (each is one 1 to 2 s beat):
| # | Skill | One-liner |
|---|-------|-----------|
| 05 | `ig-fx-sketch-boil` | Hand-drawn white outline and doodles that jitter around the subject |
| 06 | `ig-fx-graph-rise` | Yellow growth line draws up past the head, ends in a "10X ↗" pill |
| 07 | `ig-fx-glass-text` | Big chrome/glass 3D word behind the subject's head |
| 08 | `ig-fx-orbit-spin` | Mini video cards orbit the subject, passing in front and behind |
| 09 | `ig-fx-pull-out-reveal` | Camera pulls back: the shot was inside an app/browser UI all along |
| 10 | `ig-fx-phone-frame` | Phone mockup with a social post sits behind the cut-out subject |
| 11 | `ig-fx-dolly-zoom` | Vertigo push: subject stays put, background stretches |
| 12 | `ig-fx-news-wall` | Paper-cutout headlines/tweets pop in around the subject |
| 13 | `ig-fx-frame-pop` | Shot shrinks into a card on a dark room, subject breaks out of the frame |
| 14 | `ig-fx-punch-through` | Hand thrusts at the lens, zoom-blur, hard cut (transition) |
| 15 | `ig-fx-green-screen` | Subject keyed over a UI screen on violet, serif headline behind the head |
| 16 | `ig-fx-interface-world` | A cream chat UI drops in and the subject stands inside it |
| 17 | `ig-fx-tick-list` | Checklist items type on with checkbox ticks over a dimmed shot |

Structure / wrapper skills:
| Skill | Use |
|-------|-----|
| `ig-fx-kinetic-captions` | Word-synced captions with yellow key words (on every talking beat) |
| `ig-fx-effect-showcase` | "N things" list format: talking head, taped paper notes with a live checklist, inset demo card, counter chip |
| `ig-fx-card-wall-montage` | Tilted 3D wall of clip thumbnails with huge slam text ("massive library") |
| `ig-fx-page-highlight` | Website screenshot tilts flat, scrolls, yellow highlighter sweeps lines |
| `ig-fx-kinetic-cta` | Ending CTA: "download → start using" slide plus tracked-caps tagline |

Not captured yet. The recording started at effect 05, so the user still needs to send references for:
paper cut out (01), magazine cover (02), sofa wall (03), pixel zoom (04).
Do not invent these. Ask for the footage first.
