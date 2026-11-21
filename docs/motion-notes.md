# Motion notes: LaterNightLab logo

These values come from the AniCraft timing study of `assets/svg/logo-*.svg` (15 fps, 32 s timeline; review frames and GIFs kept outside the repo). Only the numbers carry over: the site builds them as CSS keyframes, WAAPI or small JS. Nothing exported from AniCraft goes into the site.

AniCraft only has easing presets. The CSS curves below are what each preset reads back as (`Smooth` = `0.25,0.1,0.25,1`), or the closest standard curve for the others.

| layer | duration | easing (cubic-bezier) | delay | transform |
|---|---|---|---|---|
| `orbit` (`#orbit-path`) | 1.6 s, entrance only | cubic-bezier(0.65, 0, 0.35, 1) | 0 s | stroke-dashoffset: path length to 0 (draws itself in). `#orbit-glow` opacity .45 to .7, 6 s alternate, cubic-bezier(0.45, 0, 0.55, 1) |
| `planet-violet` | 32 s loop | linear | -20.4 s (offset-distance starts at 63.7 %) | `offset-path` = `#orbit-path` d, offset-distance 0 to 100 %, `offset-rotate: 0deg` |
| `planet-green` | 32 s loop | linear | -12.0 s (starts at 37.5 %) | same as above |
| `sun` | 32 s loop | linear | -28.5 s (starts at 89 %) | same as above. Optional: body rotate 0 to 360deg over 60 s, linear |
| `chart` | 32 s loop | linear | -4.0 s (starts at 12.6 %) | same as above. Entrance: each `#chart-bar-N` scaleY 0 to 1 over 0.9 s, cubic-bezier(0.34, 1.56, 0.64, 1), delay N × 0.06 s, `transform-origin: bottom` |
| `moon` (`#moon-body`) | 4 s per cycle (2 s up, 2 s down, alternate infinite) | cubic-bezier(0.25, 0.1, 0.25, 1) | 0 s | scale 1 to 1.04, `transform-origin: 372px 322px`. `#moon-glow` opacity .7 to 1 on the same timing |
| `sparks` (each `#spark-s1…s8` streak and `#spark-d1…d16` dot; `#sparks-glow` follows as a whole) | 2.8 s loop | cubic-bezier(0.22, 1, 0.36, 1) (ease-out) | child i × 0.18 s | translate(0,0) to translate(10px, -10px), opacity 1 to .3, then a hard reset. `#spark-core` opacity .8 to 1, 4 s, in step with the moon |
| `wordmark` (each `.letter`) | 6 s cycle; each letter brightens over 0.6 s (0.3 s up, 0.3 s down) | cubic-bezier(0.5, 1, 0.89, 1) (QuadOut) | letter i × 0.12 s (sweep L to B takes 1.44 s) | opacity of `.glow` .55 to 1 to .55; `.core` unchanged. Hold for the rest of the cycle |

## Study notes

- **Orbit start points.** The delays are the planet's nearest point on the orbit ellipse, measured as a parameter fraction from the start of `#orbit-path`, which starts at its right end and runs clockwise on screen. A parametric fraction is not the same as an arc-length fraction, so if exact placement matters, compute the start in JS from `getTotalLength()` and `getPointAtLength()`. The green planet is not on the orbit in the static logo, so it jumps onto the ring once motion starts. Either fade it in already on the orbit, or keep it parked and orbit only the other three.
- **Depth.** On the 32 s loop, every planet passes across the moon. Planets above the moon in z-order look right on the front (lower) half of the ring and wrong on the back (upper) half. Either swap z-index at the ring's left and right ends (about 0 % and 50 % of offset-distance), or fake depth by going from scale 0.85 and opacity .75 at the back apex to scale 1.1 at the front apex.
- **Reduced motion.** With `prefers-reduced-motion: reduce`, show the static logo with only the glow opacity breathing, or with no motion at all.
- **Performance.** Animate only `transform`, `opacity` and `offset-distance`. Never animate the blur filters: the `*-glow` groups already carry them, so their opacity is what changes.
