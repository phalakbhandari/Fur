import { useEffect, useState } from 'react';
import { HeartGlyph } from './ui/Glyph';
import { PawIcon } from './PawDecorations';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'browse', label: 'Browse' },
  { id: 'swipe', label: 'Swipe' },
  { id: 'quiz', label: 'Match quiz' },
  { id: 'applications', label: 'Applications' },
];

/**
 * The header.
 *
 * Transparent by default so it sits on the ochre hero rather than cutting a
 * bar across it, and it fades to a frosted cream panel once the page moves —
 * which is the point at which it stops being part of the hero and starts
 * being chrome.
 *
 * The reference this design borrows from hides everything behind a MENU pill.
 * That is a lovely piece of styling and the wrong call for an app with five
 * views a visitor moves between constantly: it charges a click for every
 * navigation to save a row of text. The pill is kept for narrow viewports,
 * where there genuinely is no room, and the links stay visible everywhere else.
 */
export const Navbar = ({
  currentTab,
  onSelectTab,
  likedCount,
  applicationCount,
  onOpenMatches,
  onListPet,
  currentUser,
  onSignIn,
  onSignOut,
}) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock the page behind the drawer, and let Escape close it.
  useEffect(() => {
    if (!menuOpen) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const go = (tab) => {
    onSelectTab(tab);
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        hasScrolled ? 'bg-cream/92 shadow-soft backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-4 sm:px-10">
        {/* ------------------------------------------------------ Wordmark */}
        <button
          type="button"
          onClick={() => go('home')}
          aria-label="FUREVER — go to the home page"
          className="group flex shrink-0 items-baseline gap-2.5 cursor-pointer"
        >
          <PawIcon className="w-5 h-5 shrink-0 translate-y-0.5 fill-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-12" />
          <span className="font-display text-2xl leading-none tracking-tight text-ink">
            furever
          </span>
        </button>

        {/* ------------------------------------------------- Desktop links */}
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                aria-current={active ? 'page' : undefined}
                className="group relative px-3.5 py-2 text-sm text-ink cursor-pointer"
              >
                <span className={active ? 'font-medium' : ''}>{item.label}</span>
                {item.id === 'applications' && applicationCount > 0 && (
                  <span className="tabular ml-1.5 text-xs text-ink-muted">
                    ({applicationCount})
                  </span>
                )}
                {/* One rule, scaled from the left on hover and pinned open
                    when the view is active. */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3.5 bottom-1 h-px origin-left bg-ink transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* ----------------------------------------------------- Right side */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onListPet}
            className="hidden rounded-full px-4 py-2 text-sm text-ink ring-1 ring-ink/15 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-paper hover:shadow-soft hover:ring-ink/25 cursor-pointer xl:block"
          >
            List a pet
          </button>

          <button
            type="button"
            onClick={onOpenMatches}
            aria-label={`Favourites, ${likedCount} saved`}
            className="group relative flex items-center gap-2 rounded-full px-3.5 py-2 text-sm text-ink transition-colors duration-300 hover:bg-ink/5 cursor-pointer"
          >
            <HeartGlyph
              filled={likedCount > 0}
              className="w-4 h-4 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-115"
            />
            <span className="hidden sm:inline">Favourites</span>
            {likedCount > 0 && (
              <span className="tabular grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1.5 text-[0.6875rem] text-cream">
                {likedCount}
              </span>
            )}
          </button>

          {currentUser ? (
            <div className="hidden items-center gap-1 md:flex">
              <span className="px-2 text-sm text-ink-muted">{currentUser.name.split(' ')[0]}</span>
              <button
                type="button"
                onClick={onSignOut}
                className="link-draw text-sm text-ink cursor-pointer"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onSignIn}
              className="hidden rounded-full bg-ink px-5 py-2.5 text-sm text-cream transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#111] hover:shadow-[0_10px_24px_-10px_rgba(34,26,16,0.55)] cursor-pointer md:block"
            >
              Sign in
            </button>
          )}

          {/* --------------------------------------------- The MENU pill */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="group flex items-center gap-2.5 rounded-full bg-ink py-1.5 pl-4 pr-1.5 text-cream transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 cursor-pointer lg:hidden"
          >
            <span className="label">{menuOpen ? 'Close' : 'Menu'}</span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-cream text-ink">
              <span className="relative block h-2.5 w-3.5">
                <span
                  className={`absolute left-0 h-px w-full bg-current transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    menuOpen ? 'top-1/2 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 h-px w-full bg-current transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    menuOpen ? 'top-1/2 -rotate-45' : 'top-full'
                  }`}
                />
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------ The drawer */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="animate-fade-in absolute inset-x-0 top-full border-t border-ink/8 bg-cream/95 backdrop-blur-xl lg:hidden"
        >
          <nav aria-label="Primary" className="px-6 py-4 sm:px-10">
            {NAV_ITEMS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                aria-current={currentTab === item.id ? 'page' : undefined}
                style={{ animationDelay: `${index * 45}ms` }}
                className="animate-slide-up flex w-full items-baseline justify-between border-b border-ink/8 py-4 text-left cursor-pointer"
              >
                <span className="font-display text-3xl text-ink">{item.label}</span>
                <span aria-hidden="true" className="tabular label text-ink-faint">
                  0{index + 1}
                </span>
              </button>
            ))}

            <div className="flex flex-wrap gap-3 pt-6">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onListPet();
                }}
                className="rounded-full px-5 py-3 text-sm text-ink ring-1 ring-ink/15 cursor-pointer"
              >
                List a pet
              </button>

              {currentUser ? (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onSignOut();
                  }}
                  className="rounded-full bg-ink px-5 py-3 text-sm text-cream cursor-pointer"
                >
                  Sign out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onSignIn();
                  }}
                  className="rounded-full bg-ink px-5 py-3 text-sm text-cream cursor-pointer"
                >
                  Sign in
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
