import { useCallback, useEffect, useRef, useState } from 'react';

const DISMISS_AFTER_MS = 3000;

/**
 * Single-slot toast. A new message replaces the current one and restarts the
 * timer, so rapid-fire actions (spamming the heart button) don't queue up a
 * backlog of stale notifications.
 */
export function useToast() {
  const [message, setMessage] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((text) => {
    setMessage({ text, id: Date.now() });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setMessage(null), DISMISS_AFTER_MS);
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { toast: message, showToast };
}
