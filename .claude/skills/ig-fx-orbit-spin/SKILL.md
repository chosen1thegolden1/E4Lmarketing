---
name: ig-fx-orbit-spin
description: Orbit spin effect: several small floating video/screenshot cards orbit the subject on a tilted ellipse, passing in front of and behind them. Use to show 'lots of outputs/clips/clients' around a person.
---

# Orbit spin (08)
Follow the house rules in `ig-story-editor` (canvas, fonts, colors, captions, render pipeline) unless the brief overrides them.

**Look**: 3 to 5 mini 9:16 cards (about 150x260) with white 4 px borders and r=12. Each shows a clip or screenshot.
They ride an ellipse centered on the subject's torso (rx≈380, ry≈90, tilted -8°).
Cards behind the subject (back half of the ellipse) are smaller (0.75x) and darker, and the
subject's matte covers them. Front cards are 1.0x and sharp.

**Timing**: one full revolution in about 2.5 s. The beat usually shows half to three quarters of a turn. Cards fade in
over the first 6 frames.

**Build**: per frame, compute each card's angle θ: x=cx+rx·cosθ, y=cy+ry·sinθ, scale and z from sinθ.
Draw back cards, then the subject cut-out, then front cards (PIL or OpenCV loop over frames).
Add a 0.4 motion blur in the direction of travel if it looks too stiff.
