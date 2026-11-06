---
name: ig-fx-news-wall
description: News wall effect: paper-cutout headlines, tweets, and comments pop in one after another around the subject with slight rotations. Use for social proof, hype, controversy, or 'everyone is talking about this' beats.
---

# News wall (12)
Follow the house rules in `ig-story-editor` (canvas, fonts, colors, captions, render pipeline) unless the brief overrides them.

**Look**: 4 to 7 cutouts around the head and shoulders (never over the face).
- White paper cards with a rough edge, black serif or typewriter text 28 to 40 px, 2 to 3 short lines,
  e.g. "Claude edits everyone's videos now", "I'm worried about Claude".
- One or two inverted cards (black, white bold sans), e.g. "POV: you never hire an editor again".
- Small UI-ish chips (comment bubble, search pill) for texture.
- Each rotated randomly between -6° and 6°, with a soft shadow.

**Timing**: a new card every 4 to 5 frames, each popping scale 0 → 1.08 → 1.0 (easeOutBack, 6 frames). Fill the
corners first, then near the head. Hold everything for the last 0.4 s.

**Build**: one HTML page with all the cards absolutely positioned. Each card's animation is delayed by its index.
Render transparent frames and overlay. Copy comes from the brief: real testimonials or comments are best.
