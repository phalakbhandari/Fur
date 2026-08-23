import { useEffect, useState } from 'react';
import { PawIcon } from './PawDecorations';

/**
 * Pet photo with a graceful failure.
 *
 * Most of the seeded catalogue points at Unsplash, so any given image can be
 * missing for reasons that have nothing to do with this app — an offline
 * demo, a corporate proxy, a URL that rotted. Rather than leaving a broken
 * image icon in the middle of a card, the slot falls back to a paw print on
 * the brand cream.
 */
export const PetImage = ({ src, alt, className = '', priority = false, ...rest }) => {
  const [failed, setFailed] = useState(false);

  // A different pet in the same slot deserves a fresh attempt.
  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-paper text-ink/35 ${className}`}
        role="img"
        aria-label={alt ? `${alt} — photo unavailable` : 'Photo unavailable'}
      >
        <PawIcon className="w-10 h-10 fill-current" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">No photo</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      referrerPolicy="no-referrer"
      className={className}
      {...rest}
    />
  );
};
