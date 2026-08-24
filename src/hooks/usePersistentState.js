import { useEffect, useRef, useState } from 'react';
import { read, write } from '../lib/storage';

/**
 * useState that mirrors its value into localStorage.
 *
 * The initial read is lazy so it happens once, not on every render, and the
 * first write is skipped so mounting the app never rewrites what it just read.
 */
export function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => read(key, initialValue));
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    write(key, value);
  }, [key, value]);

  return [value, setValue];
}
