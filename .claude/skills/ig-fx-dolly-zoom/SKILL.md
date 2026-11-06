---
name: ig-fx-dolly-zoom
description: Dolly zoom (vertigo) effect: the subject stays the same size while the background stretches/zooms, with small caps labels on the chest. Use for a dramatic realization or emphasis beat.
---

# Dolly zoom (11)
Follow the house rules in `ig-story-editor` (canvas, fonts, colors, captions, render pipeline) unless the brief overrides them.

**Look**: the subject holds steady (or drifts 0.97x) while the background scales from 1.0 to 1.35
around the subject's center, so the room appears to stretch. Pair it with a caps-label caption
(`ig-fx-kinetic-captions` variant) centered on the chest: "COURSE", "PLATFORM".

**Timing**: one continuous move over the whole beat (about 1.5 s), easeInOutSine.

**Build**
1. Matte the subject. Inpaint the background behind them (cv2.inpaint, or a clean plate from other frames).
2. Per frame: background scaled by s(t) and center-cropped. Subject scaled by 1/s(t)·k, or left static.
3. Composite, then add 2 to 3 px radial blur at the edges to sell the warp.
Cheap fallback: a fast `zoompan` punch-in plus a counter-scaled subject cut-out.
