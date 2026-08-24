import { useCallback, useEffect, useRef } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * The dialog chrome every modal in the app shares: backdrop, scroll lock,
 * Escape to close, a focus trap, and focus restored to whatever the user was
 * on before it opened.
 *
 * Each modal still owns its own card markup — this only handles the
 * behaviour that is identical everywhere and easy to get subtly wrong.
 */
export const ModalShell = ({ onClose, labelledBy, children, className = '' }) => {
  const panelRef = useRef(null);
  const previouslyFocused = useRef(null);

  // Remember the trigger so focus can go back to it on close.
  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    return () => {
      const el = previouslyFocused.current;
      if (el && typeof el.focus === 'function') el.focus();
    };
  }, []);

  // Move focus into the dialog once it has rendered.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const first = panel.querySelector(FOCUSABLE);
    (first ?? panel).focus({ preventScroll: true });
  }, []);

  // Stop the page behind the dialog from scrolling.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;

      const items = Array.from(panel.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  return (
    /* The backdrop is decoration. Dismissing by clicking it is a mouse
  affordance only — Escape is the keyboard equivalent and is handled on
  the dialog below, so no keyboard handler belongs here. */
    <div
      role="presentation"
      className={`fixed inset-0 z-50 overflow-y-auto flex items-start sm:items-center justify-center p-3 sm:p-6 bg-[#221a10]/45 backdrop-blur-md animate-fade-in ${className}`}
      onMouseDown={(event) => {
        // Only a press that lands on the backdrop itself dismisses — dragging
        // a text selection out of the dialog should not close it.
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="w-full flex justify-center my-auto focus:outline-none"
      >
        {children}
      </div>
    </div>
  );
};
