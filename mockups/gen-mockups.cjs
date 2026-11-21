// Generates FigCraft command scripts for mockups/home.figcraft and mockups/title.figcraft.
// Usage: node mockups/gen-mockups.cjs <outDir>
//   figcraft-cli run <outDir>/home.json --out mockups/home.figcraft   (same for title)
//   figcraft-cli render mockups/home.figcraft --out home.png --scale 0.5
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..').split(path.sep).join('/');
const OUT = process.argv[2] || __dirname;
const C = { night: '#05060F', night2: '#0b0d1c', glass: '#0e1022', line: '#24273d', text: '#eef0fa', muted: '#9aa0bd', cyan: '#22D3EE', violet: '#B76CFF', amber: '#FFB629', ember: '#FF5A1F' };

function Builder() {
  let next = 2;
  const steps = [];
  const imports = [];
  const b = {
    steps, imports,
    add(command, params) { steps.push({ command, params }); return next++; },
    frame(x, y, w, h, name, fill) { return b.add('frame.create', { x, y, width: w, height: h, name, props: { fill, clip: true } }); },
    rect(p, x, y, w, h, props, name) { return b.add('shape.rectangle', { parent: p, x, y, width: w, height: h, name, props }); },
    ellipse(p, x, y, w, h, props, name) {
      props = Object.assign({}, props);
      if (props.stroke && !props.fill) props.fill = 'none';
      if (props.fill && props.fill !== 'none' && props.opacity != null && props.opacity < .5) props.effects = [{ type: 'layerBlur', radius: Math.round(Math.min(w, h) / 5) }];
      return b.add('shape.ellipse', { parent: p, x, y, width: w, height: h, name, props });
    },
    text(p, x, y, text, size, props, width) {
      const pr = Object.assign({ fontSize: size, fill: C.text, fontFamily: 'Outfit' }, props || {});
      const params = { parent: p, x, y, text, props: pr };
      if (width) params.width = width;
      return b.add('text.create', params);
    },
    img(p, file, x, y, w, h, name) { return b.add('image.place', { parent: p, path: REPO + '/' + file, x, y, width: w, height: h, mode: 'fill', name: name || file }); },
    pill(p, x, y, w, label, primary, accent) {
      b.rect(p, x, y, w, 44, primary ? { fill: accent, cornerRadius: 22 } : { fill: '#1a1c2e', stroke: C.line, strokeWeight: 1, cornerRadius: 22 }, 'Button ' + label);
      b.text(p, x + 20, y + 12, label, 16, { fill: primary ? '#0a0a12' : C.text, fontStyle: 'SemiBold' });
    },
    badge(p, x, y, label, accent) {
      const w = 14 + label.length * 8;
      b.rect(p, x, y, w, 22, { fill: '#2a1f10', stroke: accent, strokeWeight: 1, cornerRadius: 11 }, 'Badge ' + label);
      b.text(p, x + 8, y + 4, label.toUpperCase(), 11, { fontStyle: 'Bold' });
      return w;
    },
    nav(p, w) {
      b.rect(p, 0, 0, w, 64, { fill: C.glass, opacity: .92 }, 'Glass nav');
      b.ellipse(p, w > 600 ? 80 : 16, 17, 30, 30, { fill: C.amber }, 'Logo moon');
      if (w > 600) b.text(p, 122, 20, 'Later Night Lab', 18, { fontFamily: 'Space Grotesk', fontStyle: 'Bold' });
      const links = ['Games', 'Story', 'itch.io', 'Discord'];
      let x = w - (w > 600 ? 80 : 16) - links.length * 72;
      links.forEach((l) => { b.text(p, x, 22, l, 16, { fill: C.muted }); x += 72; });
    },
    tile(p, x, y, file, name, accent, badges) {
      b.ellipse(p, x + 10, y + 20, 230, 230, { fill: accent, opacity: .22 }, 'Tile glow');
      b.rect(p, x, y, 250, 188, { fill: C.night2, stroke: accent, strokeWeight: 1, cornerRadius: 18 }, 'Tile art ' + name);
      if (file) b.img(p, file, x + 1, y + 1, 248, 186, 'Tile image ' + name);
      b.rect(p, x + 8, y + 182, 234, 82, { fill: '#141628', stroke: C.line, strokeWeight: 1, cornerRadius: 14 }, 'Tile body');
      b.text(p, x + 22, y + 196, name, 18, { fontFamily: 'Space Grotesk', fontStyle: 'Bold' });
      let bx = x + 22;
      badges.forEach((bd) => { bx += b.badge(p, bx, y + 228, bd, accent) + 6; });
    },
    footer(p, y, w) {
      b.rect(p, 0, y, w, 1, { fill: C.line }, 'Footer rule');
      const m = w > 600 ? 80 : 16;
      b.ellipse(p, m, y + 40, 56, 56, { fill: C.amber }, 'Footer moon');
      b.text(p, m, y + 108, 'Later Night Lab', 20, { fontFamily: 'Space Grotesk', fontStyle: 'Bold' });
      b.text(p, m, y + 138, 'Creating in the late night hours what the day hasn\'t seen.', 15, { fill: C.muted }, w > 600 ? 360 : w - 32);
      if (w > 600) {
        b.text(p, w - 520, y + 44, 'FIND US', 13, { fill: C.amber, letterSpacing: 2 });
        b.text(p, w - 520, y + 74, 'itch.io\nDiscord', 15, { fill: C.muted, lineHeight: 30 });
        b.text(p, w - 300, y + 44, 'LEGAL', 13, { fill: C.amber, letterSpacing: 2 });
        b.text(p, w - 300, y + 74, 'Privacy – Solitaire Pulse\nPrivacy – Nonna vs Food Crimes', 15, { fill: C.muted, lineHeight: 30 });
      }
      b.text(p, m, y + (w > 600 ? 200 : 190), '© 2026 LATERNIGHTLAB — A project by MrGamer92', 14, { fill: C.muted });
    },
    importSvg(file, x, y) { imports.push({ command: 'file.import', params: { path: REPO + '/' + file, x, y } }); }
  };
  return b;
}

/* ---------------- Home ---------------- */
function home() {
  const b = Builder();
  const W = 1440;
  const f = b.frame(0, 0, W, 2520, 'Home / desktop 1440', C.night);
  b.ellipse(f, 900, -200, 900, 700, { fill: C.violet, opacity: .12 }, 'Sky glow violet');
  b.ellipse(f, -300, 1700, 900, 700, { fill: C.cyan, opacity: .07 }, 'Sky glow cyan');
  b.nav(f, W);
  // Hero: layered logo
  b.ellipse(f, 410, 210, 620, 224, { stroke: C.cyan, strokeWeight: 2, opacity: .7, rotation: -18 }, 'Logo orbit');
  b.ellipse(f, 620, 170, 200, 200, { fill: C.amber }, 'Logo moon');
  b.ellipse(f, 680, 150, 170, 170, { fill: C.night }, 'Logo moon bite');
  b.ellipse(f, 455, 420, 54, 54, { fill: C.violet }, 'Planet violet');
  b.ellipse(f, 930, 230, 40, 40, { fill: '#3ccf7a' }, 'Planet green');
  b.ellipse(f, 840, 470, 34, 34, { fill: C.ember }, 'Sun');
  b.text(f, 520, 560, 'LATER NIGHT LAB', 54, { fontFamily: 'Space Grotesk', fontStyle: 'Bold', letterSpacing: 4 });
  b.text(f, 470, 650, 'Creating in the late night hours what the day hasn\'t seen... not yet!', 24, { textAlign: 'center' }, 500);
  // Featured
  b.text(f, 80, 780, 'Featured', 32, { fontFamily: 'Space Grotesk', fontStyle: 'Bold' });
  b.rect(f, 80, 840, 1280, 560, { fill: C.night2, cornerRadius: 24, stroke: C.line, strokeWeight: 1 }, 'Carousel slide');
  b.img(f, 'MW-cover.webp', 81, 841, 1278, 558, 'Slide cover Master Work');
  b.rect(f, 81, 1100, 1278, 299, { fill: C.night, opacity: .72, cornerRadius: [0, 0, 24, 24] }, 'Slide scrim');
  b.badge(f, 120, 1150, 'Browser', '#e0a526'); b.badge(f, 200, 1150, 'Windows', '#e0a526');
  b.text(f, 120, 1186, 'Master Work', 52, { fontFamily: 'Space Grotesk', fontStyle: 'Bold' });
  b.text(f, 120, 1254, 'Run, grab, forge, deliver: out-build your rival in a 3D medieval workshop race.', 19, { fill: '#d6d9ee' }, 640);
  b.pill(f, 120, 1310, 160, 'Play on itch.io', true, '#e0a526');
  b.pill(f, 292, 1310, 100, 'Details', false);
  [0, 1, 2, 3, 4].forEach((i) => b.ellipse(f, 688 + i * 24, 1420, i === 0 ? 12 : 8, i === 0 ? 12 : 8, { fill: i === 0 ? '#e0a526' : '#4a4d63' }, 'Dot'));
  // Rows
  b.text(f, 80, 1480, 'Play in browser', 32, { fontFamily: 'Space Grotesk', fontStyle: 'Bold' });
  b.tile(f, 80, 1540, 'MW-cover.webp', 'Master Work', '#e0a526', ['Browser', 'Windows']);
  b.tile(f, 360, 1540, 'NVFC-screenshot1.webp', 'Nonna vs Food Crimes', '#e8472f', ['Browser', 'Mobile']);
  b.text(f, 720, 1480, 'Download', 32, { fontFamily: 'Space Grotesk', fontStyle: 'Bold' });
  b.tile(f, 720, 1540, 'SP Screenshot1.webp', 'Solitaire Pulse', '#f5b82e', ['Windows', 'Browser']);
  b.tile(f, 1000, 1540, 'SRR-icon.webp', 'Santa Rooftop Rush', '#3ccf7a', ['Windows']);
  // Story
  b.text(f, 80, 1900, 'STORY', 14, { fill: C.amber, letterSpacing: 3 });
  b.ellipse(f, 140, 1960, 420, 150, { stroke: C.violet, strokeWeight: 2, opacity: .6, rotation: -18 }, 'Story orbit (changes per chapter)');
  b.ellipse(f, 320, 1990, 70, 70, { fill: C.amber }, 'Story moon');
  ['The night is the forge', 'Games born from stories', 'Apps for ignored problems', 'Everywhere: PC, mobile, browser'].forEach((t, i) => {
    b.text(f, 760, 1940 + i * 70, String(i + 1).padStart(2, '0') + '  ' + t, 26, { fontFamily: 'Space Grotesk', fontStyle: 'Bold', opacity: i === 0 ? 1 : .45 });
  });
  b.footer(f, 2260, W);
  return b;
}

/* ---------------- Title page ---------------- */
function title() {
  const b = Builder();
  const W = 1440, A = '#e0a526';
  const f = b.frame(0, 0, W, 2900, 'Title page / desktop 1440 (Master Work)', C.night);
  b.ellipse(f, 700, 40, 900, 700, { fill: A, opacity: .16 }, 'Accent nebula');
  b.nav(f, W);
  // Hero copy
  b.rect(f, 80, 170, 64, 64, { fill: C.night2, stroke: A, strokeWeight: 1, cornerRadius: 16 }, 'Icon');
  b.img(f, 'MW-icon.webp', 81, 171, 62, 62, 'Icon image');
  b.badge(f, 160, 190, 'Browser', A); b.badge(f, 240, 190, 'Windows', A);
  b.text(f, 80, 254, 'Master\nWork', 84, { fontFamily: 'Space Grotesk', fontStyle: 'Bold', lineHeight: 88 });
  b.text(f, 80, 448, 'Run, grab, forge, deliver: out-build your rival in a 3D medieval workshop race.', 22, { fill: '#d6d9ee' }, 520);
  b.pill(f, 80, 530, 160, 'Play on itch.io', true, A);
  b.pill(f, 252, 530, 180, 'Windows installer', false);
  b.pill(f, 444, 530, 140, 'Windows zip', false);
  ['3D Medieval Strategy', 'Godot 4.7 Engine', 'Low Poly Aesthetic', 'Keyboard & Touch'].reduce((x, t) => {
    const w = 24 + t.length * 7.4; b.rect(f, x, 600, w, 28, { fill: '#12142a', stroke: C.line, strokeWeight: 1, cornerRadius: 14 }, 'Tag'); b.text(f, x + 12, 606, t, 13, { fill: C.muted }); return x + w + 8;
  }, 80);
  // Hero device stage (laptop SVG imported on top at the end; screenshot sits behind its screen hole)
  b.ellipse(f, 640, 210, 760, 300, { stroke: A, strokeWeight: 1, opacity: .55, rotation: -14 }, 'Orbit ring');
  b.ellipse(f, 790, 230, 520, 330, { fill: A, opacity: .35 }, 'Device glow (blur 48px in CSS)');
  b.img(f, 'MW-screenshot1.webp', 760 + 64, 170 + 16, 512, 288, 'Active shot (slides left, image parallax)');
  b.rect(f, 760 + 64 + 512 - 40, 170 + 16, 40, 288, { fill: C.night, opacity: .5 }, 'Next shot entering (motion hint)');
  [0, 1, 2, 3].forEach((i) => b.ellipse(f, 1028 + i * 24, 580, i === 0 ? 12 : 8, i === 0 ? 12 : 8, { fill: i === 0 ? A : '#4a4d63' }, 'Shot dot'));
  b.rect(f, 780, 440, 72, 72, { fill: C.night2, stroke: C.night, strokeWeight: 2, cornerRadius: 16 }, 'Floating icon chip (translateZ 60px)');
  b.img(f, 'MW-icon.webp', 782, 442, 68, 68, 'Chip image');
  // Stats + about
  const panel = (y, h, name) => { b.rect(f, 80, y, 1280, h, { fill: '#121426', stroke: C.line, strokeWeight: 1, cornerRadius: 22 }, name); b.rect(f, 80, y, 600, 2, { fill: A }, 'Accent edge'); };
  panel(720, 240, 'About panel');
  b.text(f, 116, 752, 'The Courtyard Forge Awaits', 32, { fontFamily: 'Space Grotesk', fontStyle: 'Bold' });
  b.text(f, 116, 806, 'Master Work is a fast-paced crafting race inside a vibrant medieval workshop. Run across the sunlit courtyard, scavenge essential materials from the baskets before your rival snatches them, hand-forge each tile, and haul it to your mosaic wall.', 17, { fill: '#c9cde3', lineHeight: 28 }, 900);
  panel(990, 420, 'Features panel');
  b.text(f, 116, 1022, 'Craft, Outsmart, Dominate', 32, { fontFamily: 'Space Grotesk', fontStyle: 'Bold' });
  [['6 Unique Rivals', 'From Gigi the nimble Errand Boy to Otto the venerable Master Builder.'], ['Master Builder\'s Hammer', 'One piece away? Strike the hammer to salvage a table.'], ['Daily Missions & Ranks', 'Fresh commissions every day, medals and colors.'], ['Fast Tactical Rounds', 'Both craftsmen seated: the clock runs at 10x speed.']].forEach((ft, i) => {
    const x = 116 + i * 306;
    b.rect(f, x, 1090, 290, 280, { fill: '#171a2e', stroke: C.line, strokeWeight: 1, cornerRadius: 14 }, 'Feature card');
    b.text(f, x + 18, 1110, ft[0], 18, { fill: A, fontStyle: 'Bold' }, 254);
    b.text(f, x + 18, 1146, ft[1], 15, { fill: '#c9cde3', lineHeight: 24 }, 254);
  });
  panel(1440, 330, 'Controls panel');
  b.text(f, 116, 1472, 'Controls', 32, { fontFamily: 'Space Grotesk', fontStyle: 'Bold' });
  [['WASD / ↑↓←→', 'Move across the courtyard'], ['E', 'Action: grab, place, forge, lay'], ['Q', 'Master Hammer'], ['F', 'Sit Down']].forEach((r, i) => {
    const y = 1530 + i * 56;
    b.rect(f, 116, y, 1208, 46, { fill: '#171a2e', stroke: C.line, strokeWeight: 1, cornerRadius: 12 }, 'Control row');
    b.rect(f, 132, y + 9, 130, 28, { fill: C.night, stroke: A, strokeWeight: 1, cornerRadius: 8 }, 'kbd');
    b.text(f, 144, y + 14, r[0], 13, { fill: A, fontStyle: 'Bold' });
    b.text(f, 340, y + 13, r[1], 16, { fill: '#c9cde3' });
  });
  panel(1800, 420, 'Gallery panel');
  b.text(f, 116, 1832, 'Gallery', 32, { fontFamily: 'Space Grotesk', fontStyle: 'Bold' });
  b.text(f, 116, 1880, 'Swipe (scroll-snap); click opens the lightbox.', 16, { fill: C.muted });
  ['MW-screenshot2.webp', 'MW-screenshot1.webp', 'MW-screenshot2.webp'].forEach((s, i) => {
    b.rect(f, 116 + i * 536, 1920, 520, 293, { fill: C.night, stroke: A, strokeWeight: 1, cornerRadius: 14 }, 'Gallery item');
    b.img(f, s, 117 + i * 536, 1921, 518, 291, 'Gallery ' + s);
  });
  b.rect(f, 80, 2250, 1280, 200, { fill: '#1c1810', stroke: A, strokeWeight: 1, cornerRadius: 22 }, 'Closing banner');
  b.text(f, 520, 2282, 'Ready to Build Your Masterpiece?', 32, { fontFamily: 'Space Grotesk', fontStyle: 'Bold' });
  b.pill(f, 520, 2350, 160, 'Play on itch.io', true, A);
  b.pill(f, 692, 2350, 180, 'Windows installer', false);
  b.text(f, 80, 2490, 'More titles', 32, { fontFamily: 'Space Grotesk', fontStyle: 'Bold' });
  b.tile(f, 80, 2550, 'NVFC-screenshot1.webp', 'Nonna vs Food Crimes', '#e8472f', ['Browser', 'Mobile']);
  b.tile(f, 360, 2550, 'SP Screenshot1.webp', 'Solitaire Pulse', '#f5b82e', ['Windows']);
  b.tile(f, 640, 2550, 'SRR-icon.webp', 'Santa Rooftop Rush', '#3ccf7a', ['Windows']);
  b.tile(f, 920, 2550, null, 'Sync or Sink', '#22d3ee', ['Download']);
  b.text(f, 1015, 2610, 'S', 72, { fontFamily: 'Space Grotesk', fontStyle: 'Bold' });
  b.importSvg('assets/svg/frame-desktop.svg', 760, 170);

  // Mobile 390: Ballers21 with the phone frame
  const M = 390, B = '#ff7a1f';
  const m = b.frame(1540, 0, M, 1500, 'Title page / mobile 390 (Ballers21)', C.night);
  b.ellipse(m, -100, 300, 600, 600, { fill: B, opacity: .16 }, 'Accent nebula');
  b.nav(m, M);
  b.rect(m, 16, 96, 64, 64, { fill: C.night2, stroke: B, strokeWeight: 1, cornerRadius: 16 }, 'Icon');
  b.text(m, 30, 108, '21', 30, { fill: B, fontFamily: 'Space Grotesk', fontStyle: 'Bold' });
  b.badge(m, 96, 116, 'App', B); b.badge(m, 144, 116, 'Browser', B);
  b.text(m, 16, 180, 'Ballers21', 44, { fontFamily: 'Space Grotesk', fontStyle: 'Bold' });
  b.text(m, 16, 240, 'The scorekeeper app for playground 21: squads, live ranking, tension when someone is close.', 17, { fill: '#d6d9ee', lineHeight: 26 }, 350);
  b.pill(m, 16, 330, 120, 'Play now', true, B);
  b.ellipse(m, 40, 470, 310, 420, { fill: B, opacity: .3 }, 'Device glow');
  b.img(m, 'B21 Scrennshot1.webp', 76, 436, 268, 588, 'Active shot');
  [0, 1, 2].forEach((i) => b.ellipse(m, 170 + i * 22, 1010, i === 0 ? 12 : 8, i === 0 ? 12 : 8, { fill: i === 0 ? B : '#4a4d63' }, 'Shot dot'));
  b.rect(m, 16, 1050, 358, 300, { fill: '#121426', stroke: C.line, strokeWeight: 1, cornerRadius: 22 }, 'About panel');
  b.text(m, 36, 1074, 'The court finally has a scorekeeper', 24, { fontFamily: 'Space Grotesk', fontStyle: 'Bold' }, 318);
  b.text(m, 36, 1150, 'You know the 21. Everyone\'s played it, but keeping score has always been a mess. Baller21 fixes that for good.', 16, { fill: '#c9cde3', lineHeight: 26 }, 318);
  b.importSvg('assets/svg/frame-phone.svg', 1540 + 60, 420);
  return b;
}

function write(name, b) {
  const all = b.steps.concat(b.imports);
  fs.writeFileSync(path.join(OUT, name + '.json'), JSON.stringify(all, null, 1));
  console.log(name, all.length, 'steps');
}
write('home', home());
write('title', title());
