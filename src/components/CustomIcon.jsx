import { RotateCcw, Undo2 } from 'lucide-react';

/**
 * The icon set is a folder of PNGs and SVGs served from /icons.
 *
 * They deliberately are *not* imported through the bundler. Doing that pulled
 * every icon into the JS chunk whether a page used it or not; served as static
 * files the browser fetches only what it renders and caches them across
 * navigations. Source PNGs are 128px — roughly 2x the largest place any icon
 * is drawn — so nothing is downscaled from a 2048px original at paint time.
 */

const ICONS = {
  ball: 'ball.png',
  bone: 'bone.png',
  calendar: 'calender.png',
  'circle-tick': 'circle-with-tick.png',
  cross: 'cross.png',
  discover: 'discover.png',
  exclamation: 'exclamation.png',
  female: 'female.png',
  file: 'file.png',
  flame: 'flame.png',
  'health-verified': 'health-verified.png',
  'heart-filled': 'heart-filled.png',
  'heart-illustration': 'heart-illustration.png',
  'heart-unfilled': 'heart-unfilled.png',
  home: 'home.png',
  'left-arrow': 'left-arrow.png',
  location: 'location-pin.png',
  mail: 'mail.png',
  male: 'male.png',
  message: 'message-box.png',
  paw: 'paw.png',
  'paw-illustration': 'paw-illustration.png',
  phone: 'phone.png',
  'right-arrow': 'right-arrow.png',
  search: 'search.png',
  share: 'share.png',
  smiley: 'smiley.png',
  sparkle: 'sparkle.png',
  'star-filled': 'star-filled.png',
  'star-unfilled': 'star-unfilled.png',
  menu: 'three-lines.png',
  tick: 'tick.png',
  user: 'user.png',
  upload: 'file.png',
  filter: 'three-lines.png',

  // Species artwork, drawn as vectors.
  dog: 'dog.svg',
  cat: 'cat.svg',
  rabbit: 'rabbit.svg',
  bird: 'bird.svg',
  'small-animals': 'small-animals.svg',
  'any-pet': 'any-pet.svg',
  'all-pets': 'all-pets.svg',
};

/**
 * Older call sites used a handful of alternative spellings. Rather than leave
 * them silently falling back to a paw print, they resolve to the real icon.
 */
const ALIASES = {
  calender: 'calendar',
  'circle-with-tick': 'circle-tick',
  'location-pin': 'location',
  'message-box': 'message',
  sparkles: 'sparkle',
  star: 'star-filled',
  'three-lines': 'menu',
  dogs: 'dog',
  cats: 'cat',
  rabbits: 'rabbit',
  birds: 'bird',
  other: 'any-pet',
};

const LUCIDE = {
  retry: RotateCcw,
  reset: RotateCcw,
  refresh: RotateCcw,
  undo: Undo2,
};

function resolve(name) {
  const key = String(name ?? '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');
  return ALIASES[key] ?? key;
}

/**
 * @param {object}  props
 * @param {string}  props.name  Icon key, e.g. "heart-filled".
 * @param {string}  [props.label] Accessible name. Omit for decorative icons
 *  that sit next to text saying the same thing —
 *  they are hidden from screen readers instead.
 * @param {boolean} [props.white] Force the icon to render white, for use on
 *  dark backgrounds.
 */
export const CustomIcon = ({
  name,
  label,
  className = 'w-5 h-5',
  size,
  white = false,
  tone = 'muted',
  ...rest
}) => {
  const toneClass = tone === 'muted' && !white ? 'grayscale-[0.85] opacity-70' : '';
  const key = resolve(name);

  const style = size
    ? {
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
      }
    : undefined;

  const Lucide = LUCIDE[key];
  if (Lucide) {
    return (
      <Lucide
        className={`inline-block shrink-0 ${className} ${toneClass} ${white ? 'text-cream' : ''}`}
        style={style}
        strokeWidth={2.8}
        aria-hidden={label ? undefined : true}
        aria-label={label}
        role={label ? 'img' : undefined}
        {...rest}
      />
    );
  }

  const file = ICONS[key];

  if (!file && import.meta.env.DEV) {
    console.warn(
      `<CustomIcon name="${name}"> is not in the icon set. Falling back to the paw print.`,
    );
  }

  return (
    <img
      src={`/icons/${file ?? ICONS.paw}`}
      alt={label ?? ''}
      aria-hidden={label ? undefined : true}
      width={128}
      height={128}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={`inline-block object-contain select-none shrink-0 ${className} ${toneClass} ${white ? 'brightness-0 invert' : ''}`}
      style={style}
      {...rest}
    />
  );
};
