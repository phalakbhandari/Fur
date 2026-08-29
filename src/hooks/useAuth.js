import { useCallback, useMemo } from 'react';
import { usePersistentState } from './usePersistentState';
import { KEYS } from '../lib/storage';
import { hashPassword, verifyPassword, isSupported } from '../lib/password';

/**
 * Accounts, kept in this browser.
 *
 * Passwords are salted and hashed with PBKDF2 before anything is written down
 * (see `src/lib/password.js`), and the wrong one is rejected. What this cannot
 * be, without a server, is a trust boundary: the accounts live in
 * `localStorage`, so they are per-browser and a visitor with devtools can edit
 * their own record. It is a genuine credential check, not a security barrier,
 * and the README says so plainly.
 *
 * Everything the rest of the app touches is in the return value below, so
 * swapping this for a hosted identity provider means changing this file and
 * nothing else.
 */
const EMPTY = { current: null, accounts: [] };

const publicFields = ({ id, name, email }) => ({ id, name, email });

export function useAuth() {
  const [state, setState] = usePersistentState(KEYS.user, EMPTY);

  const findAccount = useCallback(
    (email) => state.accounts.find((account) => account.email === email),
    [state.accounts],
  );

  /**
   * Creates an account, unless the email is already taken in this browser.
   * Resolves to `{ ok }` or `{ ok: false, error }` so the form can say what
   * went wrong rather than failing silently.
   */
  const signUp = useCallback(
    async ({ name, email, password }) => {
      if (!isSupported()) {
        return { ok: false, error: 'This browser cannot hash passwords securely.' };
      }
      if (findAccount(email)) {
        return {
          ok: false,
          error: 'There is already an account with that email on this device. Sign in instead.',
        };
      }

      const credential = await hashPassword(password);
      const account = {
        id: `user-${crypto.randomUUID()}`,
        name,
        email,
        ...credential,
        createdAt: new Date().toISOString(),
      };

      setState((prev) => ({
        current: publicFields(account),
        accounts: [...prev.accounts, account],
      }));

      return { ok: true };
    },
    [findAccount, setState],
  );

  /**
   * Checks a password against the stored digest.
   *
   * The same message covers "no such account" and "wrong password" on purpose.
   * Telling them apart hands an attacker a way to find out which addresses are
   * registered, one guess at a time.
   */
  const signIn = useCallback(
    async ({ email, password }) => {
      if (!isSupported()) {
        return { ok: false, error: 'This browser cannot hash passwords securely.' };
      }

      const account = findAccount(email);
      const matched = account ? await verifyPassword(password, account) : false;

      if (!matched) {
        return { ok: false, error: 'That email and password do not match an account here.' };
      }

      setState((prev) => ({ ...prev, current: publicFields(account) }));
      return { ok: true };
    },
    [findAccount, setState],
  );

  const signOut = useCallback(() => {
    setState((prev) => ({ ...prev, current: null }));
  }, [setState]);

  const knownEmails = useMemo(() => state.accounts.map((a) => a.email), [state.accounts]);

  return { currentUser: state.current, knownEmails, signIn, signUp, signOut };
}
