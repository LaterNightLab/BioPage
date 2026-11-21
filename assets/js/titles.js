/* Single source of truth for every title on the site. Plain script (no modules)
   so pages work from file:// and GitHub Pages.

   Required: slug, name, kind, tagline, accent, icon, cover, shots, row, primary, secondary.
   Optional page content (rendered by assets/js/title.js, all English):
     device      'phone' | 'desktop' (default: phone for kind 'app', desktop otherwise)
     platforms   string[]  platform badges (also used by the home store badges); [] = no badge, absent = heuristic
     tags        string[]  genre / tech chips
     stats       [{ value, label }]
     aboutHeading, about (string[] paragraphs)
     features    [{ heading, text?: string[], items?: [{ title?, text }] }]
     controls    { intro?, rows: [{ keys, title, text }] }
     showcase    string   gallery caption
     closing     { heading, text }
     notes       string[] requirements / install / release notes
     checksums   [{ label, value }]
     credits     [{ name, role, bio, quote? }]
     privacy     { label, url } (local page)
   primary.live === false: the store page is not published yet; the CTA renders disabled
   with primary.soonLabel and primary.note, but the URL is kept here. */
window.LNL_TITLES = [
  {
    slug: 'solitaire-pulse',
    name: 'Solitaire Pulse',
    kind: 'game',
    tagline: 'Solitaire with a heartbeat: race the clock or duel opponents 1v1 online.',
    accent: '#f5b82e',
    icon: 'SP icon.webp',
    cover: null,
    shots: ['SP Screenshot1.webp', 'SP Screenshot2.webp', 'SP Screenshot3.webp', 'SP Screenshot4.webp'],
    row: 'download',
    primary: { label: 'Play on itch.io', url: 'https://laternightlab.itch.io/solitaire-pulse' },
    secondary: [
      { label: 'Microsoft Store', url: 'https://apps.microsoft.com/detail/9ND2CRS3P1Q5?hl=neutral&gl=IT&ocid=pdpshare' },
      { label: 'Game Jolt', url: 'https://gamejolt.com/games/solitarepulse/1051936' }
    ],
    device: 'desktop',
    platforms: ['Windows', 'Browser', 'Android'],
    tags: ['Klondike', 'Spider', '1v1 Online'],
    aboutHeading: 'Welcome to Solitaire Pulse',
    about: [
      'The solitaire you already know, reimagined as a full competitive experience. Two classic games, Klondike and Spider, rebuilt from the ground up with modern visuals, dynamic gameplay modes, and a living ecosystem of challenges, rankings, and rivals.',
      'Whether you\'re unwinding alone or going head-to-head with players worldwide, Solitaire Pulse hits different.',
      'Available on Web and Android.'
    ],
    features: [
      {
        heading: 'Three Ways to Play',
        items: [
          { title: 'Relax', text: 'No timer, no pressure, no connection needed. Just you and the cards, the way solitaire was always meant to feel. Play offline, at your own pace, anytime.' },
          { title: 'Time', text: 'Every second drains your score. Every move toward the foundation earns it back. Stay sharp, play fast, and keep the pulse alive before the clock runs out.' },
          { title: 'Challenge', text: '1v1 online, real opponents, no mercy. Finish first or be the last one standing. The most competitive solitaire experience you\'ve ever played.' }
        ]
      },
      {
        heading: 'A Living Competitive World',
        text: ['Solitaire Pulse is more than a game: it\'s a full competitive platform.'],
        items: [
          { title: 'Monthly Leaderboards', text: 'Rankings reset every month. Climb, compete, and defend your spot.' },
          { title: 'Daily Challenges', text: 'A new challenge every day. Keep your streak alive to unlock bonus rewards.' },
          { title: 'Trophies', text: 'Complete milestones, dominate matches, collect them all.' },
          { title: 'Friends', text: 'Add your rivals, track their progress, challenge them directly.' }
        ]
      },
      {
        heading: 'Power-Up Shop',
        text: [
          'The game can change in a single move, and sometimes you need the right tool at the right moment.',
          'The in-game shop gives you access to special power-ups to turn the tide when things get tight. Earn them by playing, unlock them through challenges, and deploy them when it counts most.'
        ]
      }
    ],
    credits: [
      {
        name: 'MrGamer92',
        role: 'Nightly Dev',
        bio: 'Engineer by day. Dev by night. Gamer always. Building the games I always wanted to play, for everyone who wanted to play them too. Self-taught, learning every night, with a reliable crew of AI co-workers keeping the lab open after midnight.',
        quote: 'A gamer making games for gamers. Nothing more, nothing less.'
      }
    ],
    privacy: { label: 'Privacy policy', url: 'privacy.html' }
  },
  {
    slug: 'master-work',
    name: 'Master Work',
    kind: 'game',
    tagline: 'Run, grab, forge, deliver: out-build your rival in a 3D medieval workshop race.',
    accent: '#e0a526',
    icon: 'MW-icon.webp',
    cover: 'MW-cover.webp',
    shots: ['MW-screenshot1.webp', 'MW-screenshot2.webp', 'MW-screenshot3.webp', 'MW-screenshot4.webp'],
    row: 'download',
    primary: { label: 'Get it on itch.io', url: 'https://laternightlab.itch.io/master-work' },
    secondary: [
      { label: 'Windows installer', url: 'https://github.com/LaterNightLab/BioPage/releases/download/master-work-windows/MasterWork-Setup.exe' },
      { label: 'Windows zip', url: 'https://github.com/LaterNightLab/BioPage/releases/download/master-work-windows/MasterWork-Windows.zip' }
    ],
    device: 'desktop',
    platforms: ['Windows'],
    tags: ['3D Medieval Strategy', 'Godot 4.7 Engine', 'Low Poly Aesthetic', 'Keyboard & Touch', '6 Dynamic Rivals'],
    aboutHeading: 'The Courtyard Forge Awaits',
    about: [
      'Master Work is a fast-paced crafting race inside a vibrant medieval workshop. Run across the sunlit courtyard, scavenge essential materials (wood, iron, leather, gold, and crystal) from the baskets before your rival snatches them, fill your workbench with exact precision, hand-forge each tile, and haul it triumphantly to your mosaic wall.',
      'Speed is nothing without discipline: every surplus resource left in your hands gets tossed straight into the bin. Let six pieces hit the waste basket and your workshop run is finished!'
    ],
    features: [
      {
        heading: 'Craft, Outsmart, Dominate',
        text: ['Score massive bonuses for unbroken color chains, completed columns, and mastered material sets. But don\'t expect an easy victory: the guild courtyard is packed with fierce competition!'],
        items: [
          { title: '6 Unique Rivals', text: 'From Gigi the nimble Errand Boy to Otto the venerable Master Builder, each challenger plays with distinct tactics and tempo.' },
          { title: 'Master Builder\'s Hammer', text: 'One piece away from completion? Strike the hammer to instantly salvage a table and keep your crafting chain alive.' },
          { title: 'Daily Missions & Ranks', text: 'Tackle fresh workshop commissions every day, claim guild medals, and unlock exclusive colors for your team.' },
          { title: 'Fast Tactical Rounds', text: 'When you\'re satisfied with your mosaic, take a seat: once both craftsmen are seated, the workshop clock runs at 10x speed!' }
        ]
      }
    ],
    controls: {
      intro: 'Engineered from the ground up for instantaneous responsiveness with zero network latency.',
      rows: [
        { keys: 'WASD / ↑↓←→', title: 'Move', text: 'across the courtyard and between workbenches' },
        { keys: 'E', title: 'Action', text: 'grab basket materials, place on table, forge tile, and lay on wall' },
        { keys: 'Q', title: 'Master Hammer', text: 'immediately completes a table missing just one item' },
        { keys: 'F', title: 'Sit Down', text: 'declare your round finished and accelerate the timer' },
        { keys: 'Touchscreen', title: 'Virtual thumbstick & round buttons', text: 'tailored for phone and tablet' }
      ]
    },
    showcase: 'Built in Godot 4.7 using custom low-poly 3D models hand-crafted in Blender, optimized to stay lightweight and load fast.',
    closing: {
      heading: 'Ready to Build Your Masterpiece?',
      text: 'Grab the Windows PC build and prove your craft against the guild\'s finest!'
    },
    notes: [
      'Windows installer: about 45 MB. Portable zip: about 61 MB.',
      'Windows 10/11 64-bit. Run MasterWork-Setup.exe and follow the steps: no administrator rights needed.',
      'Prefer no installer? Get the portable zip, unzip the folder anywhere and run MasterWork.exe, keeping all the files together.',
      'The game is not code-signed yet, so Windows SmartScreen may show a warning: choose More info, then Run anyway.'
    ],
    checksums: [
      { label: 'SHA-256 installer', value: 'e57a418503c25a128ace6306ef449250a0859adcbb4f265718f0c240c47c15ff' },
      { label: 'SHA-256 zip', value: '0f4b69452e008ee2fd91e732df11340ecf1ccb2f5be187cd023ccf7f80335359' }
    ]
  },
  {
    slug: 'nonna-vs-food-crimes',
    name: 'Nonna vs Food Crimes',
    kind: 'game',
    tagline: 'Defend the kitchen against hordes of culinary abominations in a juicy 2D action roguelite.',
    accent: '#e8472f',
    icon: 'NVFC-icon.webp',
    cover: 'NVFC-cover.webp',
    shots: ['NVFC-screenshot1.webp', 'NVFC-screenshot2.webp', 'NVFC-screenshot3.webp', 'NVFC-screenshot4.webp'],
    row: 'browser',
    primary: { label: 'Play now', url: 'https://nonnavs-food-crimes.vercel.app/' },
    secondary: [
      { label: 'Play on itch.io', url: 'https://laternightlab.itch.io/nonna-vs-food-crimines' }
    ],
    device: 'desktop',
    platforms: ['Browser', 'Mobile'],
    tags: ['Action Roguelite', 'Survivors-like', 'Godot 4 Engine', '3D-Rendered Cartoon Sprites', '5 Languages'],
    aboutHeading: 'The Kitchen Under Siege',
    about: [
      'Nonna has had enough of culinary abominations. Defend the kitchen against relentless hordes of food crimes!',
      'Rebel ingredients have overrun Nonna\'s sacred kitchen: hopping dough balls that slam the floor, molten mozzarella puddles, aggressive ham cubes hurling toothpick darts, and sneaky pineapples launching wedges.',
      'Leading the uprising is the darkest culinary crime in human history: The Giant Hawaiian Pizza. Guide Nonna as she bobs and weaves through the kitchen counters while her auto-attacking arsenal dishes out swift justice!'
    ],
    features: [
      {
        heading: 'Tradition\'s Heavy Arsenal',
        text: ['Survive waves of ingredients to level up and choose game-changing upgrades on the fly. Master Nonna\'s iconic culinary weapons:'],
        items: [
          { title: 'La Pantofola (Flying Slipper)', text: 'Hurls across the room and boomerangs straight back, piercing multiple enemies on each throw.' },
          { title: 'The Rolling Pin', text: 'Spins relentlessly around Nonna in an impenetrable orbit, crushing incoming melee attackers.' },
          { title: 'Explosive Meatballs', text: 'Fires fiery Italian meatballs directly ahead that detonate on impact with satisfying area damage.' },
          { title: 'Nonna Siciliana & Arancini', text: 'Defeat the Hawaiian Pizza boss to unlock the legendary Sicilian Nonna and her devastating explosive arancini!' }
        ]
      },
      {
        heading: 'Roguelite Recipes & The Pantry',
        text: [
          'Each recipe is a complete run: Nonna preserves her levels, weapons, and upgrade synergies from one dish to the next. Duck behind sturdy kitchen islands and prep counters to block straight-line projectiles!',
          'Collect coins from fallen food crimes to visit La Dispensa (The Pantry) between runs, unlocking permanent stat upgrades, extra health, faster cooking speed, and secret family techniques.'
        ]
      }
    ],
    controls: {
      rows: [
        { keys: 'WASD / Arrow Keys', title: 'Move Nonna', text: 'around kitchen tables to dodge projectiles' },
        { keys: 'Mouse', title: 'Menus & Upgrade Cards', text: 'select your recipe perks' },
        { keys: 'Touch Joystick', title: 'Full Mobile Support', text: 'smooth virtual joystick in portrait or landscape' }
      ]
    },
    showcase: 'Created with love in Godot 4, featuring 3D-rendered cartoon sprites modeled in Blender and an authentic, high-energy Italian soundtrack.',
    closing: {
      heading: 'Pineapple on Pizza Must Be Stopped.',
      text: 'Grab your rolling pin and help Nonna restore honor to Italian cuisine. Play directly in your browser with zero installs!'
    },
    privacy: { label: 'Privacy policy', url: 'privacy-nonna-vs-food-crimes.html' }
  },
  {
    slug: 'ballers21',
    name: 'Ballers21',
    kind: 'app',
    tagline: 'The scorekeeper app for playground 21: squads, live ranking, tension when someone is close.',
    accent: '#ff7a1f',
    icon: 'B21 Screenshot1.webp',
    cover: null,
    shots: ['B21 Scrennshot1.webp', 'B21 Scrennshot2.webp', 'B21 Scrennshot3.webp'],
    row: 'app',
    primary: { label: 'Play now', url: 'https://baller21.vercel.app/' },
    secondary: [],
    device: 'phone',
    platforms: ['App', 'Browser'],
    tags: ['Scorekeeper', 'Street Basketball', 'No Login'],
    aboutHeading: 'The court finally has a scorekeeper',
    about: [
      'You know the 21. Everyone\'s played it, but keeping score has always been a mess. Who\'s at how many? Whose turn is it? Did he really score that?',
      'Baller21 fixes that for good.',
      'Baller21 is the dedicated scorekeeper for the most iconic street basketball game ever played. No more arguments. No more mental math. Just ball.'
    ],
    features: [
      {
        heading: 'Built for the Court',
        items: [
          { title: 'Individual or team mode', text: 'Play solo or split into squads: Baller21 handles the rotation automatically so you never lose track of whose turn it is.' },
          { title: 'Live leaderboard', text: 'See the ranking update in real time as the game unfolds. Every point counts.' },
          { title: 'Timer & match point alerts', text: 'Set your game duration and let Baller21 call the tension when someone\'s close to 21.' }
        ]
      }
    ],
    closing: {
      heading: 'Ready to play?',
      text: 'Clean. Fast. Built for the court. No login. No setup. Open the app, add your players, and play.'
    }
  },
  {
    slug: 'santa-rooftop-rush',
    name: 'Santa Rooftop Rush',
    kind: 'game',
    tagline: 'One night. Ten chimneys. Before dawn. A free 3D lane runner: play in your browser or on Windows PC.',
    accent: '#3ccf7a',
    icon: 'SRR-icon.webp',
    cover: null,
    shots: ['SRR-screenshot1.webp', 'SRR-screenshot2.webp', 'SRR-screenshot3.webp'],
    row: 'browser',
    primary: { label: 'Play now', url: 'https://santa-is-running.vercel.app/' },
    secondary: [
      { label: 'Get it on Microsoft Store', url: 'https://apps.microsoft.com/detail/9MTFKC2QBFC2' }
    ],
    device: 'desktop',
    platforms: ['Browser', 'Windows'],
    tags: ['3D Lane Runner', 'Godot 4.7 Engine', 'Christmas Eve', 'PEGI 3 · USK 0', 'No In-App Purchases', 'Free'],
    stats: [
      { value: '329 m', label: 'Rooftop route' },
      { value: '17→26', label: 'm/s top speed' },
      { value: '10', label: 'Chimneys' },
      { value: '06:00', label: 'Dawn deadline' }
    ],
    aboutHeading: 'The Longest Night',
    about: [
      'It\'s 23:00 on Christmas Eve and the whole city is asleep. Santa Rooftop Rush is a third-person 3D lane runner across snow-covered rooftops: Santa sprints forward on his own, and it\'s up to you to dodge, jump, slide and fling presents down every chimney before the sun comes up.',
      'The clock is the real enemy: dawn breaks at 06:00. Fall off the roofs or let the sun rise before the finish line, and the night\'s mission is lost.'
    ],
    features: [
      {
        heading: 'Right Gift, Right Chimney',
        text: ['Chimneys alternate along the edges of the route. When one comes close, the delivery window opens: throw the red gift ◆ to the left, the green gift ▲ to the right. Every correct delivery is worth +200 points.'],
        items: [
          { title: 'Delivery Window', text: 'The HUD tells you which gift each chimney is waiting for. A wrong color costs you the points, never the time.' },
          { title: 'Rooftop Hazards', text: 'Change lane around air conditioners, jump low fences, slide under cables strung with festive lights.' },
          { title: 'Night Clock', text: 'Only crashing into obstacles costs time: −3.5 seconds of night per hit. Keep it clean to beat the sunrise.' },
          { title: 'Live Forecast', text: 'The festive cable bar projects your final score in real time: deliveries plus the dawn speed bonus.' }
        ]
      },
      {
        heading: 'Chase the S Rank',
        text: ['Reach the finish line and your night is graded from D to S (S, A, B, C, D), plus a dawn speed bonus for beating the sunrise. Your best grade and high score are saved locally on your PC, so the only rival is last night\'s Santa.']
      }
    ],
    controls: {
      intro: 'Keyboard and mouse, made for quick reflexes. Restart instantly at any time.',
      rows: [
        { keys: 'A / D · ← →', title: 'Change lane', text: 'across the three rooftop lanes' },
        { keys: 'W · Space · ↑', title: 'Jump', text: 'over low obstacles and fences' },
        { keys: 'S · Shift · ↓', title: 'Slide', text: 'under cables and festive light strings' },
        { keys: 'Q · Left Click', title: 'Red gift ◆', text: 'to the left-side chimney' },
        { keys: 'E · Enter · Right Click', title: 'Green gift ▲', text: 'to the right-side chimney' },
        { keys: 'Esc · P', title: 'Pause', text: 'and audio settings' },
        { keys: 'R', title: 'Restart', text: 'the run at any moment' }
      ]
    },
    showcase: 'Built in Godot 4.7 with low-poly 3D models made in Blender, under a moonlit winter sky.',
    closing: {
      heading: 'Ready for the Night Shift?',
      text: 'Lace up Santa\'s boots and race the sunrise across the city rooftops. Free to play in your browser and on Windows 10/11.'
    },
    notes: [
      'Free, no in-app purchases, no personal data collected. Rated PEGI 3 / USK 0.',
      'Published by LaterNightLab · Play in your browser or on Windows 10/11.'
    ]
  },
  {
    slug: 'sync-or-sink',
    name: 'Sync or Sink',
    kind: 'game',
    tagline: 'Coming soon from Later Night Lab.',
    accent: '#22d3ee',
    icon: null,
    cover: null,
    shots: [],
    platforms: [],
    row: 'download',
    primary: { label: 'View on itch.io', url: 'https://laternightlab.itch.io/' },
    secondary: [],
    device: 'desktop',
    aboutHeading: 'About the Game',
    about: ['Sync or Sink is in development. Stay tuned for more updates as the development progresses!']
  },
  {
    slug: 'wordfall-veyra',
    name: 'Wordfall: Veyra',
    kind: 'game',
    tagline: 'Coming soon from Later Night Lab.',
    accent: '#b76cff',
    icon: null,
    cover: null,
    shots: [],
    platforms: [],
    row: 'download',
    primary: { label: 'View on itch.io', url: 'https://laternightlab.itch.io/' },
    secondary: [],
    device: 'desktop',
    aboutHeading: 'About the Game',
    about: ['Wordfall: Veyra is in development. Stay tuned for more updates as the development progresses!']
  }
];
