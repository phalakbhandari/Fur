const TONES = {
  sky: 'bg-sky text-ink',
  sage: 'bg-sage-wash text-ink',
  mist: 'bg-mist text-ink',
  ochre: 'bg-ochre-wash text-ink',
  outline: 'text-ink-muted ring-1 ring-ink/12',
};

/**
 * Small uppercase chip for status and metadata. Text is always ink — the
 * grounds here are pale enough that a muted grey would drop under AA on the
 * lighter ones.
 */
export const Tag = ({ tone = 'sky', className = '', children }) => (
  <span
    className={`label inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 leading-none ${TONES[tone] ?? TONES.sky} ${className}`}
  >
    {children}
  </span>
);
