---
name: ig-fx-punch-through
description: Punch-through transition: the subject thrusts a hand/fist at the lens, the frame zoom-blurs into the hand, and it hard-cuts to the next shot. Use as an energetic transition between beats.
---

# Punch-through (14)
Follow the house rules in `ig-story-editor` (canvas, fonts, colors, captions, render pipeline) unless the brief overrides them.

**Look**: in the source take, the subject pushes a hand toward the lens. On the last 4 to 6 frames before
the cut, punch in 1.0 → 1.6 with radial zoom blur and a slight brightness lift. Cut on the frame where
the hand fills the lens. The next shot starts at 1.15 and settles to 1.0 over 6 frames, with blur clearing.

**Needs**: a take where the subject actually does the push. Note it in the shot list for the brief.
Without the gesture, use a whip-zoom instead (same move, no hand).

**Build**: ffmpeg `zoompan` (or a PIL scale loop) plus a radial blur approximation: average 6 copies
scaled 1.00 to 1.06 around the center. Add a 2-frame whoosh SFX on the cut.
