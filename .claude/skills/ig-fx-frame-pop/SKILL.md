---
name: ig-fx-frame-pop
description: Frame pop effect: the shot shrinks into a framed card on a dark vignetted background and the subject breaks out of the frame edges (head pops above the border). Use to make a talking-head moment feel 3D or to frame a 'post'.
---

# Frame pop (13)
Follow the house rules in `ig-story-editor` (canvas, fonts, colors, captions, render pipeline) unless the brief overrides them.

**Look**: the background goes to dark `#0B0B0C` with a soft vignette (or a heavily darkened, blurred
copy of the shot). The video sits in a card about 0.7x size with a thin light border. The subject's head and
shoulders render *outside* the card's top edge, because the matte is composited above the frame and the border.
Optional: a small social-post UI chip (avatar, name, Follow) at the bottom of the card.

**Timing**: shrink into the card over 8 frames. The break-out is there from the first frame of the shrink.
Hold, then return to full frame or cut.

**Build**: layers are dark background, then card (video clipped to rect), then border, then subject matte
(full, unclipped, same transform as the card). Matte quality around hair matters most here, so feather well.
