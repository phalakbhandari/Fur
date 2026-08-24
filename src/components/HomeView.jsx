import { PetCard } from './PetCard';
import { HeroSection } from './HeroSection';
import { HowItWorks } from './HowItWorks';
import { AnimalMarqueeTape } from './AnimalMarqueeTape';
import { Button } from './ui/Button';
import { Reveal } from './ui/Reveal';
import { SectionIntro } from './ui/SectionIntro';

const SHOWCASE_COUNT = 6;

/**
 * The landing page.
 *
 * Lives outside App.jsx so that file stays a map of the application —
 * routing and state — rather than several hundred lines of marketing markup.
 */
export const HomeView = ({
  pets,
  likedPetIds,
  availableCount,
  onToggleFavorite,
  onSelectPet,
  onShuffle,
  onNavigate,
  onListPet,
}) => (
  <>
    <HeroSection
      onFindYourMatch={() => onNavigate('swipe')}
      onExplorePets={() => onNavigate('browse')}
      availableCount={availableCount}
    />

    <AnimalMarqueeTape />

    <HowItWorks
      onDiscoverClick={() => onNavigate('browse')}
      onMeetClick={() => onNavigate('quiz')}
      onConnectClick={() => onNavigate('applications')}
      onSwipeClick={() => onNavigate('swipe')}
    />

    {/* ------------------------------------------------------- Showcase */}
    <section className="px-6 py-20 sm:px-10 lg:py-28" aria-labelledby="showcase-heading">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col justify-between gap-8 border-b border-ink/8 pb-10 lg:flex-row lg:items-end">
          <SectionIntro
            eyebrow="Looking for a home"
            title={
              <span id="showcase-heading">
                Some of the animals
                <br />
                waiting right now.
              </span>
            }
          >
            Every one of them has been seen by a vet and is ready to go home today.
          </SectionIntro>

          <Reveal delay={200} className="flex shrink-0 flex-wrap gap-3">
            <Button variant="secondary" onClick={onShuffle}>
              Shuffle
            </Button>
            <Button variant="primary" onClick={() => onNavigate('swipe')}>
              Find my match
            </Button>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {pets.slice(0, SHOWCASE_COUNT).map((pet, index) => (
            // Stagger by column rather than by index, so a row appears to
            // settle together instead of sweeping across three at a time.
            <Reveal key={pet.id} delay={(index % 3) * 90}>
              <PetCard
                pet={pet}
                isFavorite={likedPetIds.includes(pet.id)}
                onToggleFavorite={onToggleFavorite}
                onSelectPet={onSelectPet}
              />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex flex-wrap justify-center gap-3">
          <Button variant="secondary" size="lg" onClick={() => onNavigate('browse')}>
            See all {pets.length} pets
          </Button>
        </Reveal>
      </div>
    </section>

    {/* -------------------------------------------------- List-a-pet band */}
    <section className="px-6 pb-24 sm:px-10">
      <Reveal className="mx-auto max-w-[1600px] overflow-hidden rounded-[var(--radius-panel)] bg-mist">
        <div className="grid items-center gap-10 p-10 sm:p-14 lg:grid-cols-[1.15fr_1fr] lg:p-16">
          <div>
            <p className="label text-ink-muted">The other side of it</p>
            <h2 className="mt-5 text-4xl leading-[1.05] text-ink sm:text-5xl">
              Found a stray? Rehoming your own?
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-muted">
              Put them in front of people who are already looking. Add a photo, where you found
              them, and what they are like around people. It takes about two minutes.
            </p>
            <Button variant="primary" size="lg" className="mt-8" onClick={onListPet}>
              List a pet
            </Button>
          </div>

          <div className="relative hidden aspect-[4/3] lg:block">
            <div className="mask-arch h-full w-full overflow-hidden bg-sky">
              <img
                src="/pets/goldie.jpg"
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  </>
);
