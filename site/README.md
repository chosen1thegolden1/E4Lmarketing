# E4L Marketing site

Source for the Eat 4 Life Marketing website, built around Malik ("Your AI Guy").
Read `docs/research/malik-your-ai-guy-research.md` for the thinking behind the
copy, the mascot rules, and the pricing stance.

- `src/pages/` – one template per page (home, services, pricing, book, thanks, 404)
- `src/partials/` – nav, footer, CTA band
- `src/shared.css`, `src/shared.js` – styles (scoped under `.e4l`) and behaviour
- `build.py` – config block + build. Run `python3 site/build.py`.
- `dist/ghl/` – paste-ready pages for GoHighLevel (see `DEPLOY-GHL.md`)
- `dist/preview/` – same pages with local links/images for a browser preview

Images live in `../assets/malik/` (transparent Malik poses) and `../assets/brand/`.
