---
name: ig-fx-kinetic-cta
description: Kinetic CTA end card: a bold yellow 'download → start using' style phrase slides across the bottom with an arrow, plus a small tracked-caps word ('IMMEDIATELY') under it. Use as the last 2-3 s of any Story/Reel edit.
---

# Kinetic CTA
Follow the house rules in `ig-story-editor` (canvas, fonts, colors, captions, render pipeline) unless the brief overrides them.

**Look**: in the bottom third, above the IG CTA safe zone (y≈1450 to 1580), a heavy sans 90 px phrase in
two parts with a thin arrow between them: "**download** → **start using**" in yellow `#FFD84D` with a
dark shadow. Under it, a small 26 px white caps word with 0.5em tracking: "IMMEDIATELY".
Swap in the brief's verbs ("book → get booked", "join → start building").

**Timing**: the phrase slides in from right to left (x +400 → 0, 10 frames, easeOutCubic) with motion
blur. The arrow draws on, then the tagline fades up 6 frames later. Hold until the end. It can run over
`ig-fx-page-highlight`.

**Build**: HTML layer rendered as transparent frames and overlaid.
