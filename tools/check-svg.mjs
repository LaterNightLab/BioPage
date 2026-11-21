#!/usr/bin/env node
// Usage: node tools/check-svg.mjs <file.svg> <id>...
// Exits non-zero if the file is missing, is over 60 KB, or lacks any <g id="..."> listed.
import { readFileSync, statSync } from 'node:fs';

const MAX_BYTES = 60 * 1024;
const [file, ...ids] = process.argv.slice(2);

if (!file) {
  console.error('usage: node tools/check-svg.mjs <file.svg> <id>...');
  process.exit(2);
}

const errors = [];
let size = 0;
let text = '';
try {
  size = statSync(file).size;
  text = readFileSync(file, 'utf8');
} catch {
  console.error(`FAIL ${file}: file not found`);
  process.exit(1);
}

if (size > MAX_BYTES) errors.push(`size ${size} B > ${MAX_BYTES} B`);
if (!/<svg[\s>]/.test(text)) errors.push('not an SVG (no <svg> root)');

const groupIds = new Set(
  [...text.matchAll(/<g\b[^>]*?\sid\s*=\s*["']([^"']+)["']/g)].map((m) => m[1]),
);
for (const id of ids) {
  if (!groupIds.has(id)) errors.push(`missing <g id="${id}">`);
}

if (errors.length) {
  for (const e of errors) console.error(`FAIL ${file}: ${e}`);
  process.exit(1);
}
console.log(`PASS ${file} (${size} B, ${ids.length} ids)`);
