# BioPage
Static site of Later Night Lab (games by MrGamer92), hosted on GitHub Pages.
Live site: https://laternightlab.github.io/BioPage/
Plain HTML/CSS/JS, no build step. The site is **English only**: every visible string, `aria-label` and `alt` is English (the only exceptions are in-game names such as "La Pantofola", "La Dispensa" and "Nonna Siciliana").

## Structure
- `index.html`: home (hero, store carousel and rows, story, footer).
- Seven title shells, one per game: `solitaire-pulse.html`, `nonna-vs-food-crimes.html`, `master-work.html`, `sync-or-sink.html`, `wordfall-veyra.html`, `ballers21.html`, `santa-rooftop-rush.html`. Each is a thin shell (nav, `<main id="title-root" data-slug="...">`, footer, `<noscript>` fallback); `assets/js/title.js` renders the page from the data.
- `privacy.html` / `PRIVACY.md` (Solitaire Pulse) and `privacy-nonna-vs-food-crimes.html` / `PRIVACY-NONNA-VS-FOOD-CRIMES.md`: policies. Only the page chrome is styled; the legal text must not change.
- `confirm-email.html`, `reset-password.html`: Supabase flow pages, do not touch.
- `assets/css/`: `site.css` (foundation, nav, footer), `home.css`, `story.css`, `title.css`, `privacy.css`.
- `assets/js/`: `titles.js` (data for all games), `site.js`, `hero.js`, `store.js`, `story.js`, `title.js`.
- `assets/svg/`: logo layers and device frames.
- `mockups/`: FigCraft home and title page mockups.
- `tools/`: `check-site.mjs`, `check-svg.mjs`.

## Add a title
1. Add an entry to `assets/js/titles.js` (`slug`, name, tagline, accent, platforms, store/download links and the other fields used by the existing entries; `platforms: []` means no platform badge).
2. Copy an existing title shell page, rename it to `<slug>.html` and change `data-slug`, the `<title>`, description and the `<noscript>` fallback.
3. Add the new game to the `<noscript>` lists in `index.html` and run the checks.

## Checks
```
node tools/check-site.mjs
node tools/check-svg.mjs assets/svg/logo-full.svg moon sparks planet-violet planet-green sun chart orbit wordmark
```

## Motion
AniCraft was used only to study motion; no AniCraft exports ship with the site.
