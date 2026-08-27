import { Reveal } from './Reveal';

/**
 * The heading block that opens a section: a small eyebrow, a display-serif
 * title, and an optional line of supporting copy.
 *
 * Exists so every section on the site shares one vertical rhythm. When they
 * were written per-section they drifted — four different eyebrow sizes and
 * three different gaps between title and body.
 */
export const SectionIntro = ({
  eyebrow,
  title,
  children,
  align = 'left',
  className = '',
  titleClass = 'text-4xl sm:text-5xl lg:text-[3.5rem]',
}) => (
  <div className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}>
    {eyebrow && (
      <Reveal
        as="p"
        className={`label flex items-center gap-3 text-ink-muted ${align === 'center' ? 'justify-center' : ''}`}
      >
        <span aria-hidden="true" className="h-px w-8 bg-ink-faint" />
        {eyebrow}
      </Reveal>
    )}

    <Reveal as="h2" delay={80} className={`${titleClass} mt-5 text-ink`}>
      {title}
    </Reveal>

    {children && (
      <Reveal as="div" delay={160} className="mt-5 text-base leading-relaxed text-ink-muted">
        {children}
      </Reveal>
    )}
  </div>
);
