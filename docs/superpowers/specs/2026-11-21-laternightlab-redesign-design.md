# LaterNightLab: redesign del sito (design)

Data: 2026-11-21 · Stato: in attesa di approvazione

## Intento e perché
Il sito attuale (`index.html` a 3 colonne con card vetro) è piatto e monotono. Si vuole un sito dinamico, che reagisce a touch e scorrimento, con una home a metà tra **store** (stile Xbox/PlayStation Store) e **racconto** di LaterNightLab. Ogni gioco/app ha la sua pagina con un mockup animato e il bottone per giocare subito.

## Obiettivi
- Home: hero animato col logo, carosello "in evidenza", righe orizzontali di giochi/app, poi sezione narrativa a scorrimento.
- Pagina per ogni titolo con mockup animato e CTA principale: link **Vercel** (gioco giocabile nel browser) se c'è, altrimenti **itch.io**; altre piattaforme (Microsoft Store, Game Jolt, download Windows) come CTA secondarie.
- Logo scomposto in SVG a livelli, riusabile ovunque (hero, nav, loader, favicon, footer).
- Reattività: puntatore/touch/giroscopio (parallax e tilt), scroll-driven, swipe sulle righe e sulle gallerie.

## Non-obiettivi
- Nessun framework né build step: resta HTML/CSS/JS statico su GitHub Pages.
- Non si toccano `confirm-email.html`, `reset-password.html` e la logica Supabase; le privacy policy restano com'è il testo, ripresa solo la veste grafica nel passo finale.
- Nessun export AniCraft nel sito (né HTML, né Lottie, né SVG animato).

## Anti-obiettivi (sarebbe un fallimento anche se "funziona")
- Di nuovo card tutte uguali su sfondo scuro.
- Animazioni pesanti che rendono lento il telefono, o che ignorano `prefers-reduced-motion`.
- Mockup finti che non somigliano al gioco: usare gli screenshot e i colori reali.

## Approcci considerati
- A. Tutto dai tool ArtCraft ed export incollato: stile coerente, ma codice alpha pesante e poco reattivo al touch.
- **B. Tool per SVG/mockup, animazioni scritte a mano (scelto da Stefano):** leggero, veloce su mobile, controllo totale.
- C. Tutto a mano: veloce ma non usa i software installati.

Decisione di Stefano: **B, con AniCraft usato solo per studiare l'animazione** importando l'SVG; nel sito va solo codice puro (CSS + JS).

## Pipeline di lavoro (CLI in `C:\Program Files\ArtCraft`)
1. **VectorCraft** (`vectorcraft-cli`): disegna/ricostruisce il logo a livelli in SVG (luna, scintille, 3 pianeti, orbita, scritta) più icone. Il logo attuale è un raster con glow: non si traccia, si ridisegna pulito.
2. **AniCraft** (`anicraft-cli`): importa l'SVG per provare tempi, easing e coreografia (render frame/GIF di prova). Da lì si copiano **solo i valori** (durate, curve, ritardi).
3. **Codice puro**: gli stessi valori diventano CSS keyframes/WAAPI e piccoli script JS.
4. **FigCraft** (`figcraft-cli`): mockup di home e pagina gioco; export SVG delle cornici dispositivo (telefono/PC) e riferimento di layout.
5. **PhotoCraft** (`photocraft-cli`): conversione/ritaglio screenshot in `.webp`. **EffectCraft** solo se serve per riferimento di glow/particelle.
6. Ottimizzazione SVG con `npx svgo` (Node già installato). Libreria JS opzionale: GSAP + ScrollTrigger da CDN, solo se il CSS scroll-driven non basta.

## Look (proposta, da rifinire a vista)
- Palette dal logo: notte profonda `#05060F`, ciano `#22D3EE`, viola `#B76CFF`, ambra luna `#FFB629`, arancio brace `#FF5A1F`. Ogni titolo ha un colore d'accento preso dalla sua icona.
- Atmosfera "laboratorio nel cosmo": sfondo con stelle in parallax, orbite sottili, glow morbidi, profondità a strati (non più card piatte).
- Tipografia: un display forte per i titoli + Outfit per il testo (carico da Google Fonts).

## Struttura
```
index.html                 home (store + narrativa)
<slug>.html                una pagina per titolo (stesso template)
assets/css/site.css        stile condiviso
assets/js/site.js          nav, carosello, tilt, scroll, riduzione movimento
assets/svg/                logo a livelli, icone, cornici mockup
```
Le pagine esistenti mantengono gli stessi nomi file, così i link già pubblicati non si rompono.

### Home
1. Nav fissa in vetro con logo SVG.
2. Hero a tutto schermo: logo animato (pianeti in orbita, luna che pulsa) che reagisce a puntatore/touch/giroscopio; claim "Creating in the late night hours what the day hasn't seen... not yet!".
3. Carousel "Featured" tipo store: copertina grande, titolo, badge piattaforma, bottone Play/Open.
4. Righe orizzontali con scroll-snap e tilt al tocco: "Play in browser", "Download", "App". Le card sono tessere store (cover, icona, badge).
5. Narrativa a scorrimento (3–4 capitoli: la notte come fucina, giochi nati da storie, app per problemi ignorati, ovunque: PC/mobile/browser) con orbita che cambia mentre si scorre.
6. Footer: itch.io, Discord, privacy.

### Pagina titolo
Hero col mockup animato (dispositivo coerente col gioco, screenshot che scorrono), colore d'accento, CTA primaria (Vercel o itch.io) e secondarie, galleria con swipe, info/piattaforme, riga "More titles". Tutte dallo stesso template.

## Titoli e link (stato attuale)
| Titolo | Pagina | CTA primaria | Note |
|---|---|---|---|
| Solitaire Pulse | `solitaire-pulse.html` | itch.io | anche Microsoft Store, Game Jolt, Discord |
| Master Work | `master-work.html` | itch.io | download `.exe`/`.zip` da GitHub Release |
| Nonna vs Food Crimes | `nonna-vs-food-crimes.html` | itch.io | |
| Ballers21 (app) | `ballers21.html` | **Vercel** `baller21.vercel.app` | |
| Santa Rooftop Rush | `santa-rooftop-rush.html` | Microsoft Store | **manca itch/Vercel** |
| Sync or Sink | `sync-or-sink.html` | itch.io (profilo) | **manca link diretto e icona** |
| Wordfall: Veyra | `wordfall-veyra.html` | itch.io (profilo) | **manca link diretto e icona** |

## Vincoli
GitHub Pages, nessun build, HTML/CSS/JS statico; immagini `.webp`; `prefers-reduced-motion` rispettato; fluido su telefono (touch, 60 fps sulle animazioni di trasformazione/opacità); i nomi file esistenti non cambiano.

## Scelte del builder (da non chiedere)
Font display esatto, valori di timing/easing (derivati dallo studio in AniCraft), uso o no di GSAP, struttura dei mockup, ordine delle righe nello store, resa del giroscopio su iOS.

## Aperto (risponde Stefano, può restare placeholder)
Link diretti itch.io/Vercel e icone per Sync or Sink, Wordfall: Veyra e Santa Rooftop Rush. Finché mancano: bottone "Coming soon" o link al profilo itch.io, e icona generata dai colori del titolo.

## Lingua (decisione di Stefano, 2026-11-21)
Il sito è **solo in inglese**: ogni testo visibile, etichetta, bottone, attributo `alt`/`aria-label`, stato vuoto e messaggio d'errore. Nessuna stringa italiana nel codice, nei dati o nei mockup.
