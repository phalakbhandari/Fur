import { PetImage } from './PetImage';
import { Button } from './ui/Button';
import { Reveal } from './ui/Reveal';

/**
 * Local, not hotlinked. This is the largest image on the first screen — the
 * one the page's LCP is measured against — and pointing it at a third party
 * means the hero is blank whenever that host is slow, blocked, or offline.
 */
const HERO_PHOTO = '/pets/daisy.jpg';

/**
 * The hero.
 *
 * Built around one idea: the wordmark is the artwork. It runs at a size that
 * would be absurd for a heading and is set in cream on ochre — a pairing that
 * measures 1.8:1 and would fail AA for any real text, but a logotype is
 * exempt under WCAG 1.4.3. Every other word on this ground is ink at 8.2:1.
 *
 * The photograph is clipped to a house silhouette, which is the shape the
 * whole site borrows for framed imagery.
 */
export const HeroSection = ({ onFindYourMatch, onExplorePets, availableCount }) => (
  <section className="relative isolate overflow-hidden bg-ochre">
    <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-y-10 px-6 pb-16 pt-28 sm:px-10 lg:grid-cols-[1fr_minmax(0,46%)] lg:gap-x-12 lg:pb-20 lg:pt-32">
      {/* ------------------------------------------------------------ Left */}
      <div className="flex flex-col justify-between">
        <div>
          <Reveal as="p" className="max-w-[15ch] text-lg leading-tight font-medium text-ink">
            Adoption, from Bengaluru shelters
          </Reveal>

          {/* The wordmark. -0.06em pulls the f back under the label above it,
              which is what makes it read as a masthead rather than a heading. */}
          <Reveal
            as="h1"
            delay={90}
            className="display-hero mt-2 -ml-[0.06em] text-cream select-none text-[clamp(5rem,15vw,15rem)]"
          >
            furever
          </Reveal>
        </div>

        {/* Scroll cue: a rotated label, a rule that grows on load, and an
            arrow. Hidden below lg, where there is no room and no mouse. */}
        <div className="hidden items-start gap-6 pt-16 lg:flex">
          <Reveal delay={260} className="flex flex-col items-center gap-3">
            <span
              className="label whitespace-nowrap text-ink/70"
              style={{ writingMode: 'vertical-rl' }}
            >
              Meet the pets
            </span>
            <span aria-hidden="true" className="h-16 w-px bg-ink/30" />
            <svg viewBox="0 0 12 20" className="h-4 w-3 text-ink/50" aria-hidden="true">
              <path
                d="M6 0v18M1 13l5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Reveal>

          <div className="max-w-md pt-1">
            <Reveal as="p" delay={300} className="text-[0.95rem] leading-relaxed text-ink">
              {availableCount} animals are waiting in shelters across the city right now. Get to
              know their temperament before you meet them, apply in one place, and follow what
              happens next.
            </Reveal>

            <Reveal delay={360} className="mt-7 flex flex-wrap gap-3">
              <Button variant="onOchre" size="lg" onClick={onExplorePets}>
                Meet the pets
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={onFindYourMatch}
                className="bg-transparent ring-ink/25 hover:bg-paper hover:ring-ink/10"
              >
                Find my match
              </Button>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------- Right */}
      <Reveal
        delay={140}
        variant="blur"
        className="group relative aspect-[4/5] w-full self-start sm:aspect-[5/6] lg:aspect-auto lg:h-[min(78vh,860px)]"
      >
        <div className="mask-house h-full w-full overflow-hidden bg-ochre-deep/20">
          <PetImage
            priority
            src={HERO_PHOTO}
            alt="Daisy, a young Labrador Indie mix, waiting for a home"
            className="media-zoom h-full w-full object-cover object-center"
          />
        </div>

        {/* Caption plate. Sits on the photograph rather than inside the mask,
            so the roof line stays unbroken. */}
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
          <div className="rounded-2xl bg-cream/95 px-5 py-4 shadow-card backdrop-blur-sm">
            <p className="label text-ink-muted">Looking for a home</p>
            <p className="mt-1 font-display text-2xl leading-none text-ink">Daisy</p>
            <p className="mt-1.5 text-xs text-ink-muted">Labrador Indie mix · 1 yr</p>
          </div>
        </div>
      </Reveal>

      {/* Mobile copy and actions. The desktop layout tucks these into the
          left column beside the scroll cue, which has no room here. */}
      <div className="lg:hidden">
        <Reveal as="p" className="text-[0.95rem] leading-relaxed text-ink">
          {availableCount} animals are waiting in shelters across the city right now. Get to know
          their temperament before you meet them, apply in one place, and follow what happens next.
        </Reveal>

        <Reveal delay={80} className="mt-6 flex flex-wrap gap-3">
          <Button variant="onOchre" onClick={onExplorePets}>
            Meet the pets
          </Button>
          <Button
            variant="secondary"
            onClick={onFindYourMatch}
            className="bg-transparent ring-ink/25"
          >
            Find my match
          </Button>
        </Reveal>
      </div>
    </div>
  </section>
);
