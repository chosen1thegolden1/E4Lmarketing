# Ad 01: Malik Knows It All

Mascot: **Malik**. Campaign line: **99 Problems But AI Ain't One.**

Malik smiles at the viewer while the top of his head swings open. Logos from across the AI world (LLMs, image and video tools, automation platforms) pour into his head. The tagline sits in the lower third.

## Ready-to-post files (`export/`)

| File | Size | Use |
|---|---|---|
| `malik-99-problems_feed.png` | 1080x1350 | IG/FB feed (4:5) |
| `malik-99-problems_square.png` | 1080x1080 | Square feed, LinkedIn |
| `malik-99-problems_story.png` | 1080x1920 | Stories, Reels, TikTok (UI safe zone kept clear) |
| `*_no-logos.png` | same | Backup if an ad platform rejects third-party logos |

## On-image copy
- Kicker: MEET MALIK. HE ALREADY LEARNED EVERY AI TOOL.
- Headline: 99 PROBLEMS / BUT AI AIN'T ONE.
- Lockup: Eat 4 Life Marketing, AI Marketing Made Easy.
- CTA: eat4lifemarketing.com

## Editing
- `ad.html` is the template. Open `ad.html?fmt=feed|square|story&logos=1|0&hero=v1..v4`.
- `renders/` holds four hero renders of the real Malik, made in Higgsfield from his saved character element ("Malik", Main character of the E4L Story). m2 is the current pick.
- `renders-stock/` holds the first-pass stand-in renders (not Malik). Keep for reference only.
- `reference/malik-higgsfield.png` is Malik's character reference sheet image.
- The brand list lives in the `rows` array in `ad.html`. Icon names match files in `logos/`. Names starting with `#` render as text pills.
- The E4L square is a stand-in. Swap in the real logo file when it is in the repo.
- Re-export: `node render.mjs [m2]` (set `PW_PATH` to a Playwright install if it is not local).

## Notes
- Malik is the 3D animated E4L mascot. Generate him in Higgsfield with the "Malik" element (id 098c3fb7-8cdf-401e-9c58-09c9dd0742af) so he stays on-model: spiky black hair, lightning bolt fade, thin mustache and chin beard, black hoodie with green controller.
- Logo SVGs come from Simple Icons. Using other companies' logos in paid ads can read as an endorsement and can get flagged in review. The logo version carries a small trademark line. The no-logos version is the safe fallback.
