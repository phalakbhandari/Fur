import confetti from 'canvas-confetti';

const BRAND_COLORS = ['#FB4504', '#F6D97B', '#0F5C94', '#0F942D', '#ffca42'];

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Confetti burst for genuinely good news — a submitted application, a new
 * listing going live. Silently does nothing when the visitor has asked their
 * OS for reduced motion, and never throws if the canvas can't be created.
 */
export function celebrate({ particleCount = 90, spread = 75, origin = { y: 0.6 } } = {}) {
  if (prefersReducedMotion()) return;
  try {
    confetti({
      particleCount,
      spread,
      origin,
      colors: BRAND_COLORS,
      disableForReducedMotion: true,
    });
  } catch {
    /* confetti is decoration; failing to draw it is not an error */
  }
}
