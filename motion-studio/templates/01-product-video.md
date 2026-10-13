# Product / launch video (guide step 4)

Paste into Claude Code from `motion-studio/` (effort: xhigh for a new video). Fill the brackets.

```
/motion-reel

Make a dynamic [20]-second motion graphics video for [PRODUCT] ([URL]), with the energy of a motion
designer's showreel. Go all out.

Assets
- Visit the site. Use real screenshots (Playwright), the real logo, real colors and fonts.
  Save everything to films/[name]/assets and list what you found before you animate.
- Never redraw the product UI from imagination. Crop and animate the real thing.
- We have [CLIENT]'s permission to use their product, logo and data: [yes / who approved].

Story (one beat each, 2 to 4 seconds)
1. Hook: the problem in 5 words of huge kinetic type.
2. The product appears, the UI assembles itself piece by piece.
3. Three features, each as a UI moment with a cursor doing a real action.
4. One number that proves it works: [A REAL METRIC + where it comes from].
5. Logo lockup + [CALL TO ACTION].

Sound
- Original music, 120 BPM, synthesized in code. UI clicks and whooshes on the beat.

Format: 1080x1920 (9:16) first, then 1:1 and 16:9 from the same timeline.
Before the full render, show me a contact sheet of one frame per beat.
```

Tips
- Keep one Claude Code session per brand: the second video reuses its assets, renderer and music.
- Voiceover: put `ELEVENLABS_API_KEY=...` in `motion-studio/.env` and say "the ElevenLabs key is in .env".
  Never paste a key into a prompt.
