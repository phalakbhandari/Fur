/**
 * Inline vector glyphs for controls.
 *
 * The icon set is raster artwork drawn for an older palette — a PNG cross
 * stays blue no matter what the button around it is doing. These are drawn
 * with `currentColor`, so a close button that inverts on hover inverts its
 * cross too.
 */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const Cross = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
    <path d="M4 4l8 8M12 4l-8 8" {...base} />
  </svg>
);

export const ArrowRight = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
    <path d="M2 8h11M9 4l4 4-4 4" {...base} />
  </svg>
);

export const Check = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
    <path d="M3 8.5 6.5 12 13 4.5" {...base} />
  </svg>
);

export const HeartGlyph = ({ className = 'h-4 w-4', filled = true }) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
    <path
      d="M10 17s-6.5-4.2-6.5-8.4A3.6 3.6 0 0 1 10 6.2a3.6 3.6 0 0 1 6.5 2.4C16.5 12.8 10 17 10 17Z"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);
