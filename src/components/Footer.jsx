import { PawIcon } from './PawDecorations';
import { Reveal } from './ui/Reveal';

const COLUMNS = [
  {
    heading: 'Adopt',
    links: [
      { label: 'Browse every pet', tab: 'browse' },
      { label: 'Swipe to match', tab: 'swipe' },
      { label: 'Take the match quiz', tab: 'quiz' },
      { label: 'My applications', tab: 'applications' },
    ],
  },
  {
    heading: 'About',
    links: [
      { label: 'How it works', tab: 'how-it-works' },
      { label: 'Partner shelters', tab: 'browse' },
      { label: 'Adoption FAQ', tab: 'how-it-works' },
    ],
  },
];

/**
 * The footer.
 *
 * Ochre, so the page closes on the same colour it opened with, and the
 * oversized wordmark bleeds off the bottom edge — the one place besides the
 * hero where the logotype is allowed to be cream on ochre.
 */
export const Footer = ({ onSelectTab, onFindYourMatch }) => (
  <footer className="relative mt-auto overflow-hidden bg-ochre">
    <div className="mx-auto max-w-[1600px] px-6 pt-20 sm:px-10">
      <div className="grid gap-12 border-b border-ink/15 pb-16 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
        <Reveal>
          <p className="label text-ink/70">Bengaluru</p>
          <h2 className="mt-4 max-w-md text-3xl leading-[1.15] text-ink sm:text-4xl">
            There is an animal in this city that would suit your life.
          </h2>
          <button
            type="button"
            onClick={onFindYourMatch}
            className="group mt-8 inline-flex items-center gap-3 rounded-full bg-ink py-3 pl-6 pr-2 text-sm text-cream transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 cursor-pointer"
          >
            Find yours
            <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-ochre text-ink">
              <span className="relative block h-3.5 w-3.5 overflow-hidden">
                <Arrow className="absolute inset-0 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-4" />
                <Arrow className="absolute inset-0 -translate-x-4 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
              </span>
            </span>
          </button>
        </Reveal>

        {COLUMNS.map((column, index) => (
          <Reveal key={column.heading} delay={(index + 1) * 80}>
            <h3 className="label font-sans text-ink/70">{column.heading}</h3>
            <ul className="mt-5 space-y-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => onSelectTab(link.tab)}
                    className="link-draw text-sm text-ink cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}

        <Reveal delay={240} className="lg:text-right">
          <h3 className="label font-sans text-ink/70">Shelters</h3>
          <p className="mt-5 max-w-[22ch] text-sm leading-relaxed text-ink lg:ml-auto">
            Listing animals with us is free. Write to
            <a
              href="mailto:shelters@furever.example"
              className="link-draw ml-1 font-medium text-ink"
            >
              shelters@furever.example
            </a>
          </p>
        </Reveal>
      </div>

      {/* Fine print sits above the wordmark, so the wordmark is the last
          thing on the page rather than a caption for the legal line. */}
      <div className="flex flex-col gap-4 py-8 text-xs text-ink/75 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2">
          <PawIcon className="h-3.5 w-3.5 fill-ink/60" />
          Every animal here is real and looking for a home.
        </p>
        <p>© {new Date().getFullYear()} FUREVER · Built in Bengaluru</p>
      </div>
    </div>

    {/* The wordmark, clipped by the viewport edge. aria-hidden because the
        footer already names the site in its copyright line. */}
    <div aria-hidden="true" className="select-none px-6 sm:px-10">
      <p className="display-hero mx-auto max-w-[1600px] -mb-[0.18em] -ml-[0.02em] text-[clamp(4rem,17vw,17rem)] text-cream/55">
        furever
      </p>
    </div>
  </footer>
);

const Arrow = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M2 8h11M9 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
