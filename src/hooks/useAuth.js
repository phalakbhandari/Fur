import { useCallback, useMemo } from 'react';
import { usePersistentState } from './usePersistentState';
import { KEYS } from '../lib/storage';

/**
 * Demo identity, kept in the browser.
 *
 * This is not authentication and does not try to look like it — no password
 * is stored or verified. It exists so applications and listings can be
 * attributed to "this visitor", and so the apply flow has something to gate
 * on. Replacing it with a real provider means changing this file only.
 */
export function useAuth() {
  const [state, setState] = usePersistentState(KEYS.user, { current: null, accounts: [] });

  const signIn = useCallback(
    (user) => {
      setState((prev) => {
        const accounts = prev.accounts.some((a) => a.email === user.email)
          ? prev.accounts.map((a) => (a.email === user.email ? { ...a, ...user } : a))
          : [...prev.accounts, user];
        return { current: user, accounts };
      });
    },
    [setState],
  );

  const signOut = useCallback(() => {
    setState((prev) => ({ ...prev, current: null }));
  }, [setState]);

  const knownEmails = useMemo(() => state.accounts.map((a) => a.email), [state.accounts]);

  return { currentUser: state.current, knownEmails, signIn, signOut };
}
