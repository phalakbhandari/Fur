#!/usr/bin/env node
/**
 * Contrast check for the design tokens.
 *
 * Palettes drift. Someone nudges a grey two steps lighter because it looks
 * better on their monitor and quietly drops a body-text pairing under 4.5:1 —
 * which nobody notices, because it still looks fine on their monitor.
 *
 * This reads the real hex values out of `src/index.css` and asserts the
 * pairings the app actually uses against WCAG 2.1 AA. It runs in CI, so the
 * palette cannot drift without the build saying so.
 *
 * Usage: npm run check:contrast
 */

import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');

/** Pull `--color-name: #hex;` declarations out of the @theme block. */
const tokens = Object.fromEntries(
  [...css.matchAll(/--color-([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map(([, name, hex]) => [
    name,
    hex.toLowerCase(),
  ]),
);

const channel = (value) => {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

/**
 * AA needs 4.5:1 for body text, 3:1 for large text (>=24px, or >=18.66px bold)
 * and for the boundary of a UI control.
 */
const BODY = 4.5;
const LARGE = 3.0;

const pairings = [
  // Primary text, every ground it is set on.
  ['ink', 'cream', BODY],
  ['ink', 'paper', BODY],
  ['ink', 'linen', BODY],
  ['ink', 'ochre', BODY],
  ['ink', 'ochre-wash', BODY],
  ['ink', 'mist', BODY],
  ['ink', 'sky', BODY],
  ['ink', 'sage', BODY],
  ['ink', 'sage-wash', BODY],

  // Secondary text. Note the absence of `ochre` — at 3.4:1 it is not allowed
  // there, and `sage` is excluded for the same reason at 4.4:1.
  ['ink-muted', 'cream', BODY],
  ['ink-muted', 'paper', BODY],
  ['ink-muted', 'linen', BODY],
  ['ink-muted', 'mist', BODY],
  ['ink-muted', 'sky', BODY],

  // Errors.
  ['brick', 'cream', BODY],
  ['brick', 'paper', BODY],
  ['brick', 'linen', BODY],

  // Affirmative states.
  ['moss', 'cream', BODY],
  ['moss', 'paper', BODY],
  ['moss', 'linen', BODY],
  ['moss', 'sage-wash', BODY],

  // Inverted: cream text on the dark primary button.
  ['cream', 'ink', BODY],
  ['paper', 'ink', BODY],

  // Rules and dividers — large-text threshold is the right bar for these.
  ['ink-faint', 'cream', LARGE],
  ['ink-faint', 'linen', LARGE],
];

/**
 * Pairings that are deliberately below the bar, with the reason. Listing them
 * here rather than omitting them means the exemption is a decision on the
 * record, not an oversight.
 */
const exemptions = [
  ['cream', 'ochre', 'The oversized wordmark only. A logotype, which WCAG 1.4.3 exempts.'],
];

const failures = [];

for (const [fg, bg, threshold] of pairings) {
  if (!tokens[fg] || !tokens[bg]) {
    failures.push(`unknown token in pairing ${fg} on ${bg}`);
    continue;
  }
  const ratio = contrast(tokens[fg], tokens[bg]);
  if (ratio < threshold) {
    failures.push(
      `${fg} on ${bg}: ${ratio.toFixed(2)}:1 — needs ${threshold}:1 ` +
        `(${tokens[fg]} on ${tokens[bg]})`,
    );
  }
}

if (failures.length > 0) {
  console.error('\nContrast check failed:\n');
  failures.forEach((f) => console.error(`  ✗ ${f}`));
  console.error('');
  process.exit(1);
}

console.log(`Contrast check passed — ${pairings.length} pairings meet WCAG AA.`);
for (const [fg, bg, why] of exemptions) {
  console.log(
    `  Exempt: ${fg} on ${bg} (${contrast(tokens[fg], tokens[bg]).toFixed(2)}:1) — ${why}`,
  );
}
