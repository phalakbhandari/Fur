/**
 * Thin wrapper around localStorage.
 *
 * Everything here is written defensively: Safari in private mode throws on
 * setItem, and a half-written value from an older build can fail JSON.parse.
 * A broken cache should never take the whole page down, so every failure
 * degrades to "no saved value" rather than throwing.
 */

const PREFIX = 'furever:';

/** Bump when the shape of stored data changes in a non-backwards-compatible way. */
export const SCHEMA_VERSION = 5;

export const KEYS = {
  user: 'user',
  likes: 'likes',
  applications: 'applications',
  listings: 'listings',
};

const fullKey = (key) => `${PREFIX}v${SCHEMA_VERSION}:${key}`;

export function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(fullKey(key));
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function write(key, value) {
  try {
    window.localStorage.setItem(fullKey(key), JSON.stringify(value));
    return true;
  } catch {
    // Quota exceeded or storage disabled — the app still works, it just forgets.
    return false;
  }
}

export function remove(key) {
  try {
    window.localStorage.removeItem(fullKey(key));
  } catch {
    /* nothing useful to do here */
  }
}

/**
 * Drop keys written by older schema versions so they don't sit around
 * forever eating the origin's storage quota.
 */
export function pruneOldVersions() {
  try {
    const stale = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(PREFIX) && !key.startsWith(`${PREFIX}v${SCHEMA_VERSION}:`)) {
        stale.push(key);
      }
      // Keys from before this module existed.
      if (key && key.startsWith('furever_')) stale.push(key);
    }
    stale.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    /* ignore */
  }
}
