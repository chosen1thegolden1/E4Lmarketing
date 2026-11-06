---
name: ig-fx-interface-world
description: Interface world effect: a light, cream AI-chat style interface (logo, empty prompt box, 'Drop files here') slides down over the shot and the subject is placed standing inside the UI in the lower half. Use to make it feel like the creator is 'inside' the tool.
---

# Interface world (16)
Follow the house rules in `ig-story-editor` (canvas, fonts, colors, captions, render pipeline) unless the brief overrides them.

**Look**: a cream `#F4EFE3` app UI fills the frame: small centered logo plus wordmark at top
(an orange asterisk plus "Claude" in serif works for AI topics; use the tool the brief names), a large
rounded prompt box, and a dashed "Drop files here" zone. The subject cut-out occupies the lower
45 %, emerging from the bottom edge or sitting in the drop zone. A caps-label caption ("MEANING")
sits on the chest.

**Timing**: the UI slides down from the top over 8 frames easeOutCubic, covering the A-roll. The subject cut-out
stays put, so it looks like the world changed around them. Hold about 1.2 s.

**Build**: an HTML mock of the UI rendered as a PNG. Composite: UI (animated y), then subject matte.
Never use a real company's logo unless the brief is about that product.
