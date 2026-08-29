/**
 * Password hashing, in the browser.
 *
 * There is no server here, so "real authentication" has a ceiling: anything
 * this file does, a determined visitor with devtools can also do. What it can
 * honestly provide is the part that actually matters for a stored credential —
 * the password is never written down anywhere, in any form it could be read
 * back from.
 *
 * What is stored per account is a salt and a derived key. Signing in derives
 * the key again from what was typed and compares. A wrong password produces a
 * different key and is rejected, and reading `localStorage` gives an attacker
 * a PBKDF2 digest rather than the password itself — which matters because
 * people reuse passwords across sites.
 *
 * PBKDF2-SHA256 at 210,000 iterations is the OWASP recommendation for
 * PBKDF2-HMAC-SHA256 as of 2023. It is deliberately slow, so guessing at scale
 * costs real time. The salt is 16 random bytes per account, so two people who
 * choose the same password do not end up with the same stored digest, and a
 * precomputed table is useless.
 *
 * `crypto.subtle` needs a secure context: HTTPS, or localhost. That covers the
 * dev server and any real deployment.
 */

const ITERATIONS = 210_000;
const KEY_BITS = 256;
const SALT_BYTES = 16;

const toBase64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));

const fromBase64 = (value) => Uint8Array.from(atob(value), (char) => char.charCodeAt(0));

export const isSupported = () =>
  typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined';

async function derive(password, salt) {
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );

  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    material,
    KEY_BITS,
  );

  return new Uint8Array(bits);
}

/**
 * Turns a password into the pair of values worth storing. The password itself
 * is not among them.
 */
export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await derive(password, salt);
  return { salt: toBase64(salt), hash: toBase64(hash), iterations: ITERATIONS };
}

/**
 * Compares two digests without leaking which byte differed.
 *
 * A plain `===` on strings returns as soon as it finds a mismatch, so how long
 * it takes says something about how much of the guess was right. This always
 * looks at every byte. The practical risk in a local demo is nil; doing it
 * correctly costs one line and is the answer to "why not just use ===".
 */
function equal(a, b) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) {
    difference |= a[index] ^ b[index];
  }
  return difference === 0;
}

/**
 * True when `password` is the one this credential was created from.
 */
export async function verifyPassword(password, credential) {
  if (!credential?.salt || !credential?.hash) return false;
  const derived = await derive(password, fromBase64(credential.salt));
  return equal(derived, fromBase64(credential.hash));
}
