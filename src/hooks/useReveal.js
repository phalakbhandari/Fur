import { useEffect } from 'react';

/**
 * Scroll-triggered reveals, for the whole page, from one observer.
 *
 * Any element carrying `data-reveal` fades and rises into place the first
 * time it crosses into view. The initial state is CSS (see index.css), so
 * nothing is visible before this runs and there is no flash of positioned
 * content.
 *
 * Deliberately one IntersectionObserver over a live NodeList rather than a
 * hook per component: a page of forty cards would otherwise mean forty
 * observers. Elements are unobserved once revealed, so scrolling back up
 * costs nothing and content never animates twice.
 */
export function useReveal(deps = []) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const targets = document.querySelectorAll('[data-reveal]:not([data-revealed])');

    // With reduced motion the CSS already shows everything; just mark it done
    // so the observer never runs.
    if (prefersReducedMotion) {
      targets.forEach((el) => el.setAttribute('data-revealed', ''));
      return undefined;
    }

    // No IntersectionObserver (old browsers, some test runners) means content
    // must still be readable — show everything rather than hiding it forever.
    if (typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.setAttribute('data-revealed', ''));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-revealed', '');
          observer.unobserve(entry.target);
        });
      },
      {
        // Fire a little before the element reaches the fold, so it has
        // finished moving by the time it is properly in view, and ignore the
        // bottom 10% so something scrolled past quickly is not missed.
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.05,
      },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
