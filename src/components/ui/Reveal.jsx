/**
 * Marks a subtree to fade and rise into view when it is scrolled to.
 *
 * Rendering a plain element with `data-reveal` rather than wiring an observer
 * per instance — one observer in `useReveal` picks all of them up, so a page
 * with forty cards still has exactly one.
 *
 * `delay` staggers siblings. Keep it small: past roughly 300ms a stagger stops
 * reading as choreography and starts reading as lag.
 */
export const Reveal = ({
  as: Tag = 'div',
  delay = 0,
  variant,
  className = '',
  style,
  children,
  ...rest
}) => (
  <Tag
    data-reveal={variant ?? ''}
    style={delay ? { ...style, '--reveal-delay': `${delay}ms` } : style}
    className={className}
    {...rest}
  >
    {children}
  </Tag>
);
