/* Single source of truth for every title on the site. Plain script (no modules)
   so pages work from file:// and GitHub Pages. */
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
      { label: 'Game Jolt', url: 'https://gamejolt.com/games/solitarepulse/1051936' },
      { label: 'Discord', url: 'https://discord.gg/g4S7uSXyVY' }
    ]
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
    row: 'browser',
    primary: { label: 'Play on itch.io', url: 'https://laternightlab.itch.io/master-work' },
    secondary: [
      { label: 'Windows installer', url: 'https://github.com/LaterNightLab/BioPage/releases/download/master-work-windows/MasterWork-Setup.exe' },
      { label: 'Windows zip', url: 'https://github.com/LaterNightLab/BioPage/releases/download/master-work-windows/MasterWork-Windows.zip' }
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
    primary: { label: 'Play on itch.io', url: 'https://laternightlab.itch.io/nonna-vs-food-crimines' },
    secondary: []
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
    primary: { label: 'Gioca ora', url: 'https://baller21.vercel.app/' },
    secondary: []
  },
  {
    slug: 'santa-rooftop-rush',
    name: 'Santa Rooftop Rush',
    kind: 'game',
    tagline: 'One night. Ten chimneys. Before dawn. A free 3D lane runner for Windows PC.',
    accent: '#3ccf7a',
    icon: 'SRR-icon.webp',
    cover: null,
    shots: ['SRR-screenshot1.webp', 'SRR-screenshot2.webp', 'SRR-screenshot3.webp'],
    row: 'download',
    primary: { label: 'Microsoft Store', url: 'https://apps.microsoft.com/detail/9MTFKC2QBFC2' },
    secondary: []
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
    row: 'download',
    primary: { label: 'Vedi su itch.io', url: 'https://laternightlab.itch.io/' },
    secondary: []
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
    row: 'download',
    primary: { label: 'Vedi su itch.io', url: 'https://laternightlab.itch.io/' },
    secondary: []
  }
];
