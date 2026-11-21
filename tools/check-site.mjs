// Site integrity check: node tools/check-site.mjs (run from repo root)
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const fail = (m) => failures.push(m);
const exists = (rel) => fs.existsSync(path.join(root, rel));

// 1. Load titles.js
let titles = [];
const titlesPath = path.join(root, 'assets/js/titles.js');
if (!fs.existsSync(titlesPath)) {
  fail('assets/js/titles.js: missing');
} else {
  try {
    const ctx = { window: {} };
    vm.runInNewContext(fs.readFileSync(titlesPath, 'utf8'), ctx);
    titles = ctx.window.LNL_TITLES;
    if (!Array.isArray(titles) || !titles.length) fail('titles.js: window.LNL_TITLES is not a non-empty array');
  } catch (e) {
    fail('titles.js: ' + e.message);
  }
}

// 2. Per-title checks
for (const t of Array.isArray(titles) ? titles : []) {
  const id = `title "${t.slug}"`;
  if (!exists(`${t.slug}.html`)) fail(`${id}: ${t.slug}.html missing`);
  if (!/^#[0-9a-fA-F]{6}$/.test(t.accent || '')) fail(`${id}: accent is not #rrggbb`);
  if (!['browser', 'download', 'app'].includes(t.row)) fail(`${id}: bad row "${t.row}"`);
  const imgs = [t.icon, t.cover, ...(t.shots || [])].filter((x) => x != null);
  for (const img of imgs) if (!exists(img)) fail(`${id}: image missing: ${img}`);
  if (!t.primary || !/^https:\/\/\S+/.test(t.primary.url || '')) fail(`${id}: primary.url empty or not https`);
  for (const c of t.secondary || []) if (!/^https:\/\/\S+/.test(c.url || '')) fail(`${id}: secondary url not https: ${c.label}`);
}

// 3. Local href/src in every top-level html
const skip = /^(https?:|mailto:|#|data:|tel:|javascript:|\/\/)/i;
for (const file of fs.readdirSync(root).filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const re = /\b(?:href|src)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  let m;
  while ((m = re.exec(html))) {
    const raw = (m[1] ?? m[2]).trim();
    if (!raw || skip.test(raw)) continue;
    let ref = raw.split('#')[0].split('?')[0];
    if (!ref) continue;
    try { ref = decodeURIComponent(ref); } catch { /* keep raw */ }
    ref = ref.replace(/^\.\//, '');
    if (ref.endsWith('/')) ref += 'index.html';
    if (!exists(ref)) fail(`${file}: unresolved local reference "${raw}"`);
  }
}

if (failures.length) {
  for (const f of failures) console.log('FAIL ' + f);
  console.log(`${failures.length} failure(s)`);
  process.exit(1);
}
console.log(`OK: ${titles.length} titles, all references resolve`);
