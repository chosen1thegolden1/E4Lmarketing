---
name: ig-fx-card-wall-montage
description: Card wall montage: a dark scene filled with a tilted 3D grid of clip thumbnails slowly drifting, with huge kinetic headline words slamming in ('these are just a few', 'massive library', 'X editing effects' on a yellow bar). Use after a listicle to imply volume, or as a hook.
---

# Card wall montage
Follow the house rules in `ig-story-editor` (canvas, fonts, colors, captions, render pipeline) unless the brief overrides them.

**Look**
- Background: a grid of 9:16 thumbnails (6 columns, many rows) with r=14 and 3 px gaps on near-black.
  Perspective `rotateX(28deg) rotateZ(-12deg)`, drifting diagonally about 40 px/s. Thumbnails are
  frames from the project's own clips.
- Headline sequence, white heavy sans, 150 to 200 px, centered:
  1. "these are" → "these are just a few" (word by word, 70 px, top third).
  2. "massive" (yellow) slams in huge, then "library" (white) slams in under it. Each enters with scale 1.4 → 1.0
     plus 10 px blur → 0 over 5 frames.
  3. "Claude Code" (white, enters with horizontal motion blur), then "editing effects" on a yellow
     `#FFD84D` bar that wipes left → right with ink text.
- Exit: a white card flips up in 3D from the bottom, taking you into `ig-fx-page-highlight`.

**Timing**: whole montage 3 to 4 s. A headline change every 0.6 to 0.8 s.

**Build**: one Playwright page (CSS 3D grid plus headline layers) rendered as opaque frames.
