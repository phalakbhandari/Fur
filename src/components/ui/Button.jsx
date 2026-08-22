const BASE =
  'relative inline-flex items-center justify-center gap-2.5 rounded-full font-medium ' +
  'transition-[transform,background-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ' +
  'cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:translate-y-0 ' +
  'active:translate-y-0 whitespace-nowrap';

const VARIANTS = {
  /** The one action a screen most wants you to take. Only ever one per view. */
  primary:
    'bg-ink text-cream hover:bg-[#111] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgba(34,26,16,0.55)]',

  /** Secondary actions: same weight of shape, far less pull. */
  secondary:
    'bg-paper text-ink ring-1 ring-ink/12 hover:ring-ink/30 hover:-translate-y-0.5 hover:shadow-card',

  /** On the ochre hero, where paper would glare and ink would shout. */
  onOchre:
    'bg-ink text-cream hover:bg-[#111] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgba(34,26,16,0.5)]',

  /** Brand-forward, used sparingly — the ochre is the loudest thing available. */
  accent:
    'bg-ochre text-ink hover:bg-ochre-deep hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgba(207,149,48,0.7)]',

  /** No fill until you reach for it. */
  ghost: 'text-ink hover:bg-ink/5',
};

const SIZES = {
  sm: 'text-xs px-4 py-2.5 tracking-wide',
  md: 'text-[0.8125rem] px-6 py-3.5 tracking-wide',
  lg: 'text-sm px-8 py-4 tracking-wide',
};

export const Button = ({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) => (
  <Tag
    className={`${BASE} ${VARIANTS[variant] ?? VARIANTS.primary} ${SIZES[size]} ${className}`}
    {...(Tag === 'button' ? { type: rest.type ?? 'button' } : null)}
    {...rest}
  >
    {children}
  </Tag>
);
