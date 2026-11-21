# LaterNightLab Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the LaterNightLab site as a dynamic, touch- and scroll-reactive store-plus-story home with one animated mockup page per title.

**Architecture:** Static HTML/CSS/JS on GitHub Pages. One data file (`assets/js/titles.js`) is the single source of truth for titles, links, colours and images; the home rows, carousel and every title page render from it. Logo and mockups are SVG made with the ArtCraft CLIs; AniCraft is used only to study timing, whose values are then written as plain CSS/JS.

**Tech Stack:** HTML, CSS (scroll-snap, keyframes, `animation-timeline` with JS fallback), vanilla JS (Pointer Events, DeviceOrientation, IntersectionObserver). Optional GSAP+ScrollTrigger from cdnjs only if CSS/JS cannot do a specific effect. Node (already installed) for `tools/check-site.mjs`; `npx svgo`.

**Spec:** `docs/superpowers/specs/2026-11-21-laternightlab-redesign-design.md`

## Global Constraints

- Site language is English only: every visible string, label, button, alt/aria-label, empty state and error message (no Italian anywhere in the site).

- No framework and no build step on hosting: static files served by GitHub Pages.
- No AniCraft export (HTML, Lottie or animated SVG) ships in the site; only values studied in AniCraft, written as CSS/JS.
- Existing page file names stay: `index.html`, `solitaire-pulse.html`, `master-work.html`, `nonna-vs-food-crimes.html`, `santa-rooftop-rush.html`, `sync-or-sink.html`, `wordfall-veyra.html`, `ballers21.html`, `privacy.html`, `privacy-nonna-vs-food-crimes.html`.
- `confirm-email.html`, `reset-password.html` and their Supabase logic are not modified.
- Images are `.webp`; `prefers-reduced-motion: reduce` disables parallax, tilt and looping animation.
- Palette: night `#05060F`, cyan `#22D3EE`, violet `#B76CFF`, amber `#FFB629`, ember `#FF5A1F`; each title has its own accent from its icon.
- Primary CTA is the Vercel link if the title has one, otherwise itch.io. Other platforms are secondary CTAs.
- Animate only `transform` and `opacity`; target smooth 60 fps on a phone.
- Claim text verbatim: "Creating in the late night hours what the day hasn't seen...not yet!"
- CLI paths: `C:\Program Files\ArtCraft\<App>\<app>-cli.exe` (vectorcraft, anicraft, figcraft, photocraft).

## Review Focus

- Title with no cover or screenshots (Santa Rooftop Rush, Sync or Sink, Wordfall: Veyra): page and card still render with a generated accent placeholder, no broken image.
- Title with no direct itch/Vercel link: CTA falls back to the itch.io profile or "Coming soon", never an empty `href`.
- Unknown or missing `?`/slug on a title page: shows a "title not found" state with a link home, not a blank page.
- Touch device with no hover and no gyroscope (and iOS requiring permission): tilt/parallax degrade to static, scrolling and swiping still work.
- Reduced-motion and JS-disabled visitors: all content, links and CTAs remain reachable.

---

### Task 1: Logo SVG layers and motion study

**Files:**
- Create: `assets/svg/logo-moon.svg`, `logo-planet-violet.svg`, `logo-planet-green.svg`, `logo-sun.svg`, `logo-chart.svg`, `logo-orbit.svg`, `logo-wordmark.svg`, `logo-full.svg` (all layers, one `viewBox="0 0 768 768"`, layers in `<g id="…">`)
- Create: `docs/motion-notes.md`

**Interfaces:**
- Produces: `assets/svg/logo-full.svg` with group ids `moon`, `sparks`, `planet-violet`, `planet-green`, `sun`, `chart`, `orbit`, `wordmark`; `docs/motion-notes.md` with a table `layer | duration | easing (cubic-bezier) | delay | transform`.

- [ ] **Step 1: Define the check.** Create `tools/check-svg.mjs` (`node tools/check-svg.mjs <file> <id>…`) that exits non-zero if the file is missing, is over 60 KB, or lacks any of the `<g id>` names.
- [ ] **Step 2: Run it against `logo-full.svg`.** Expected: FAIL (missing file).
- [ ] **Step 3: Redraw the logo in VectorCraft as clean vector layers** (reference: `LNL icon.webp`; do not auto-trace the glow): drive `vectorcraft-cli run` with `--commands` JSON and export with `--export logo-full.svg`; export each layer as its own file. Glow via SVG `filter` (feGaussianBlur) on separate groups so it can animate opacity only.
- [ ] **Step 4: Optimize** with `npx svgo --multipass` on every file; keep the group ids (`cleanupIds: false`).
- [ ] **Step 5: Run the check** on `logo-full.svg` with the eight ids. Expected: PASS.
- [ ] **Step 6: Study the motion in AniCraft.** `anicraft-cli new`, `file.import` the SVG, animate: planets orbiting along `orbit` (slow, ~24–40 s loop), moon pulse (~4 s), sparks drifting, wordmark letters brightening in sequence; `render-seq`/`gif` to review. Record the final values in `docs/motion-notes.md`. Nothing from AniCraft is exported into the site.
- [ ] **Step 7: Commit** `assets/svg`, `tools/check-svg.mjs`, `docs/motion-notes.md`.

### Task 2: Data file, shared CSS foundation and nav

**Files:**
- Create: `assets/js/titles.js`, `assets/css/site.css`, `assets/js/site.js`, `tools/check-site.mjs`
- Create: `assets/svg/logo-mark.svg` (moon-only, nav/favicon)

**Interfaces:**
- Produces: `window.LNL_TITLES: Title[]` where `Title = { slug: string, name: string, kind: 'game'|'app', tagline: string, accent: string /*#rrggbb*/, icon: string|null, cover: string|null, shots: string[], row: 'browser'|'download'|'app', primary: Cta, secondary: Cta[] }` and `Cta = { label: string, url: string }`.
- Produces: `site.js` exports on `window.LNL`: `getTitle(slug: string): Title|undefined`, `onReducedMotion(): boolean`, `enableTilt(el: HTMLElement): void`. CSS tokens `--night --cyan --violet --amber --ember --accent` on `:root`; `.nav`, `.btn`, `.btn-primary`, `.tile`, `.row`, `.section` base classes.

- [ ] **Step 1: Write `tools/check-site.mjs`.** For every `Title`: each referenced local image exists on disk; `primary.url` is non-empty and `https://`; `<slug>.html` exists; every local `href`/`src` in every top-level `.html` resolves. Prints one line per failure, exits non-zero on any.
- [ ] **Step 2: Run `node tools/check-site.mjs`.** Expected: FAIL (no `titles.js` yet).
- [ ] **Step 3: Fill `titles.js` with the 7 titles from the spec's table** using existing images (`SP icon.webp`, `SP Screenshot1-4.webp`, `MW-cover/icon/screenshot1-4.webp`, `NVFC-cover/icon/screenshot1-4.webp`, `SRR-icon.webp`, `B21 Screenshot1.webp`, `B21 Scrennshot1-3.webp`). Sync or Sink/Wordfall: `icon: null`, `cover: null`, `primary` = `https://laternightlab.itch.io/` labelled "View on itch.io". Ballers21 `primary` = `https://baller21.vercel.app/` labelled "Play now"; Master Work `secondary` includes the two GitHub Release downloads.
- [ ] **Step 4: Implement `site.css`** (tokens, night background with star layers, glass nav, buttons, tile base, reduced-motion media query that zeroes animations) **and `site.js`** (`getTitle`, `onReducedMotion`, `enableTilt` via Pointer Events setting `--rx/--ry` custom properties, no-op under reduced motion or on `hover: none` without gyro).
- [ ] **Step 5: Run `node tools/check-site.mjs`.** Expected: PASS for data/images; page-file checks still pass for the existing pages.
- [ ] **Step 6: Commit.**

### Task 3: Home hero with animated, reactive logo

**Files:**
- Modify: `index.html` (replace the whole page body and inline CSS; keep `<title>` text updated)
- Create: `assets/js/hero.js`, `assets/css/home.css`

**Interfaces:**
- Consumes: `LNL.onReducedMotion()`, logo layer ids from Task 1, motion values from `docs/motion-notes.md`.
- Produces: `#hero` section with inline-embedded `logo-full.svg` (inline so groups are animatable); `hero.js` exports nothing global, sets `--px/--py` (−1..1) on `#hero` from pointer, touch drag and `deviceorientation`; `iOS` permission requested only from an explicit tap on a small "Enable motion" button.

- [ ] **Step 1: Build the hero markup and `home.css`:** full-height section, claim line verbatim, scroll cue. Planets orbit via CSS `offset-path` or rotating wrapper; moon pulse and spark drift via keyframes with the timings from the notes; layers shift by `calc(var(--px) * depth)`.
- [ ] **Step 2: Implement `hero.js`** (pointer, touch, gyro with permission button, rAF-throttled, paused when the hero is off screen via IntersectionObserver).
- [ ] **Step 3: Verify in the browser preview** (`.claude/launch.json` server): hero renders, no console errors, layers move on pointer move, with reduced motion emulated nothing loops. Check at 375 px width: no horizontal scroll.
- [ ] **Step 4: Commit.**

### Task 4: Store section: featured carousel and rows

**Files:**
- Modify: `index.html` (add `#featured`, `#rows` after the hero)
- Create: `assets/js/store.js`; extend `assets/css/home.css`

**Interfaces:**
- Consumes: `window.LNL_TITLES`, `LNL.enableTilt`.
- Produces: `renderFeatured(titles: Title[]): void` (auto-advancing carousel, swipe/drag, pauses on hover/touch and when hidden, dots, keyboard arrows) and `renderRows(titles: Title[]): void` creating rows "Play in browser" (`row==='browser'`), "Download" (`row==='download'`), "App" (`row==='app'`) with `scroll-snap-x` tiles; a tile = icon/cover (or accent placeholder with initial), name, platform badge; each tile links to `<slug>.html`.

- [ ] **Step 1: Implement `renderFeatured`** using `cover` when present, else the first shot, else an accent gradient; accent colour drives the glow; CTA button uses `primary`.
- [ ] **Step 2: Implement `renderRows`** skipping rows with no titles; placeholder tile when `icon`/`cover` is null; tilt on pointer/touch.
- [ ] **Step 3: Verify in the browser:** carousel swipes with a touch-emulated drag and advances on its own; rows scroll and snap; Santa Rooftop Rush, Sync or Sink and Wordfall render tiles without broken images (check `img` `naturalWidth` and console).
- [ ] **Step 4: Commit.**

### Task 5: Narrative section and footer

**Files:**
- Modify: `index.html` (add `#story`, `<footer>`)
- Create: `assets/js/story.js`; extend `assets/css/home.css`

**Interfaces:**
- Consumes: `logo-orbit.svg`/planet layers, `LNL.onReducedMotion()`.
- Produces: `#story` with four chapters (la notte come fucina; giochi nati da storie; app per sfide ignorate; ovunque: PC, mobile, browser) using the mission text from the old home as base copy; a sticky orbit whose state is set from the visible chapter (`data-chapter="0..3"` on `#story`); footer with itch.io (`https://laternightlab.itch.io/`), Discord (`https://discord.gg/g4S7uSXyVY`), privacy links to both policies and `© 2026 LATERNIGHTLAB — A project by MrGamer92`.

- [ ] **Step 1: Write the chapters and sticky-orbit CSS** keyed on `[data-chapter]`.
- [ ] **Step 2: Implement `story.js`** (IntersectionObserver sets `data-chapter`; with reduced motion the orbit stays static and chapters just stack).
- [ ] **Step 3: Verify in the browser:** scrolling changes the orbit state, footer links open the right URLs, no horizontal scroll at 375 px.
- [ ] **Step 4: Commit.**

### Task 6: Title page template and mockups

**Files:**
- Create: `assets/css/title.css`, `assets/js/title.js`, `assets/svg/frame-phone.svg`, `frame-desktop.svg`, `mockups/home.figcraft`, `mockups/title.figcraft`
- Modify: `solitaire-pulse.html`, `master-work.html`, `nonna-vs-food-crimes.html`, `santa-rooftop-rush.html`, `sync-or-sink.html`, `wordfall-veyra.html`, `ballers21.html` (each becomes a thin shell: head, nav, `<main id="title-root" data-slug="…">`, scripts)

**Interfaces:**
- Consumes: `LNL.getTitle`, `LNL_TITLES`, `LNL.enableTilt`.
- Produces: `renderTitle(slug: string): void` in `title.js`: hero with device frame (phone for apps/mobile titles, desktop for PC/browser titles) cycling the title's `shots` with a slide/parallax animation; primary CTA, secondary CTAs; swipeable gallery; info block; "More titles" row (all titles except the current). Missing slug or unknown title renders a "Title not found" state with a link to `index.html`.

- [ ] **Step 1: Draft the two mockups in FigCraft** (`figcraft-cli run` with a command script) for the home and the title page; export device frames as SVG into `assets/svg/`; `figcraft-cli render` PNG for a visual check.
- [ ] **Step 2: Implement `title.js` and `title.css`** with the per-title `--accent`; each title's `<title>`/meta stays in its static HTML. Titles with no `shots` show the accent placeholder inside the frame.
- [ ] **Step 3: Convert the seven pages** to the shell, keeping every external link from the old pages inside `titles.js` (verify none is lost: `grep -o 'https\?://[^"]*'` on the old versions via `git show HEAD:<file>` against `titles.js`).
- [ ] **Step 4: Run `node tools/check-site.mjs`.** Expected: PASS.
- [ ] **Step 5: Verify each of the seven pages in the browser** (desktop and 375 px): CTA hrefs correct (Ballers21 → Vercel, others itch.io/Microsoft Store as in the spec table), gallery swipes, no console errors, and `?`-less unknown slug state by loading a shell with a bad `data-slug`.
- [ ] **Step 6: Commit.**

### Task 7: Privacy pages, cleanup and final verification

**Files:**
- Modify: `privacy.html`, `privacy-nonna-vs-food-crimes.html` (apply `site.css` look and nav; text unchanged)
- Modify: `README.md` (new structure, how to add a title)

**Interfaces:**
- Consumes: everything above.
- Produces: nothing new.

- [ ] **Step 1: Restyle the two privacy pages** with the shared nav/footer; do not change policy text (diff of the body text must be empty).
- [ ] **Step 2: Update `README.md`:** structure, "to add a title: add an entry to `assets/js/titles.js` and copy a title shell".
- [ ] **Step 3: Run `node tools/check-site.mjs`** and `node tools/check-svg.mjs assets/svg/logo-full.svg moon sparks planet-violet planet-green sun chart orbit wordmark`. Expected: both PASS.
- [ ] **Step 4: Full pass in the browser** on every page at desktop and 375 px, with reduced motion on and off: no console errors, no horizontal scroll, all CTAs and footer links correct, confirm-email and reset-password pages unchanged (`git diff --stat` shows no change to them).
- [ ] **Step 5: Commit.**

---

## Self-review

- Spec coverage: logo layers and AniCraft study (T1), data/links table and CTA rule (T2), hero with pointer/touch/gyro (T3), carousel and rows (T4), narrative and footer (T5), title pages with FigCraft mockups and fallback CTAs (T6), privacy restyle, README and no-touch of Supabase pages (T7).
- Names consistent across tasks: `LNL_TITLES`, `getTitle`, `onReducedMotion`, `enableTilt`, `renderFeatured`, `renderRows`, `renderTitle`, group ids in T1 match their uses in T3 and T5.
- Not covered by a task: choosing the display font (builder's call per spec), exact timing values (come from T1's notes).
