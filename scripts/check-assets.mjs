#!/usr/bin/env node
/**
 * Asset integrity check.
 *
 * Two things have gone wrong in this repository's history, and this script
 * exists so neither can happen again quietly:
 *
 *   1. Every binary asset was committed through a text filter, which replaced
 *      each byte above 0x7F with the UTF-8 replacement character and left 94
 *      unopenable images behind. `.gitattributes` prevents it; this detects it.
 *
 *   2. Icons were shipped at 2048x2048 and rendered at 40px, so the page
 *      pulled tens of megabytes to draw a few hundred pixels.
 *
 * Run with `npm run check:assets`. Exits non-zero on any failure, so CI fails
 * the build rather than merging a broken picture.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// fileURLToPath, not `.pathname` — on Windows the latter yields
// "/C:/Users/..." with a leading slash, which every path API then rejects.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const ICON_DIR = join(ROOT, 'public/icons');
const PET_DIR = join(ROOT, 'public/pets');

/** Bytes 0xEF 0xBF 0xBD — U+FFFD. Never legitimately present in a PNG or JPEG. */
const REPLACEMENT_CHAR = Buffer.from([0xef, 0xbf, 0xbd]);

const MAGIC = {
  '.png': Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  '.jpg': Buffer.from([0xff, 0xd8, 0xff]),
  '.jpeg': Buffer.from([0xff, 0xd8, 0xff]),
};

// An icon is never drawn larger than 56 CSS px; 128px covers a 2x display.
const MAX_ICON_BYTES = 40 * 1024;
const MAX_PHOTO_BYTES = 400 * 1024;

const problems = [];

function walk(dir) {
  if (!safeStat(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function safeStat(p) {
  try {
    return statSync(p);
  } catch {
    return null;
  }
}

function checkFile(file, maxBytes) {
  const ext = extname(file).toLowerCase();
  const buf = readFileSync(file);
  const name = relative(ROOT, file);

  if (ext === '.svg') {
    if (buf.includes(REPLACEMENT_CHAR)) {
      problems.push(`${name}: contains U+FFFD — the file was mangled by a text-mode copy`);
    }
    return;
  }

  const magic = MAGIC[ext];
  if (!magic) return;

  if (!buf.subarray(0, magic.length).equals(magic)) {
    problems.push(`${name}: does not start with a valid ${ext.slice(1).toUpperCase()} header`);
    return;
  }

  // A valid PNG/JPEG can contain 0xEF 0xBF 0xBD by chance, but a corrupted one
  // is saturated with it. More than a handful per kilobyte is not coincidence.
  let hits = 0;
  for (let i = 0; i < buf.length - 2; i += 1) {
    if (buf[i] === 0xef && buf[i + 1] === 0xbf && buf[i + 2] === 0xbd) hits += 1;
  }
  const perKb = hits / (buf.length / 1024);
  if (perKb > 2) {
    problems.push(
      `${name}: ${hits} replacement-character sequences (${perKb.toFixed(1)}/KB) — this file is corrupted`,
    );
  }

  if (buf.length > maxBytes) {
    problems.push(
      `${name}: ${(buf.length / 1024).toFixed(0)} KB exceeds the ${(maxBytes / 1024).toFixed(0)} KB budget`,
    );
  }
}

walk(ICON_DIR).forEach((f) => checkFile(f, MAX_ICON_BYTES));
walk(PET_DIR).forEach((f) => checkFile(f, MAX_PHOTO_BYTES));

// Every icon name referenced in the source must exist on disk.
const iconModule = readFileSync(join(ROOT, 'src/components/CustomIcon.jsx'), 'utf8');
const referenced = [...iconModule.matchAll(/'([\w.-]+\.(?:png|svg))'/g)].map((m) => m[1]);
const onDisk = new Set(readdirSync(ICON_DIR));

for (const file of new Set(referenced)) {
  if (!onDisk.has(file)) problems.push(`CustomIcon maps to /icons/${file}, which does not exist`);
}

const unused = [...onDisk].filter((f) => !referenced.includes(f) && f !== 'favicon.svg');

if (problems.length > 0) {
  console.error('\nAsset check failed:\n');
  problems.forEach((p) => console.error(`  ✗ ${p}`));
  console.error('');
  process.exit(1);
}

const iconCount = onDisk.size;
const totalKb = walk(ICON_DIR).reduce((n, f) => n + statSync(f).size, 0) / 1024;
console.log(`Asset check passed — ${iconCount} icons, ${totalKb.toFixed(0)} KB total.`);
if (unused.length > 0) {
  console.log(`Note: ${unused.length} unreferenced (${unused.join(', ')}).`);
}
