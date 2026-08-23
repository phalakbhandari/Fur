import { PetImage } from './PetImage';
import { Tag } from './ui/Tag';

/**
 * The catalogue card.
 *
 * Not a clickable `<div>`. The card is an `<article>` and the "Meet X" button
 * carries an `::after` overlay that covers it, so the whole surface stays
 * clickable by mouse while there is exactly one thing in the tab order with a
 * real accessible name. The favourite button sits above that overlay on z-10.
 *
 * Hover is three things moving together on the same curve: the card lifts,
 * the photograph scales inside its frame, and the arrow slides. Individually
 * each is a cliché; timed as one gesture they read as a single response.
 */
export const PetCard = ({ pet, isFavorite, onToggleFavorite, onSelectPet }) => (
  <article
    id={`pet-card-${pet.id}`}
    className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-paper shadow-soft ring-1 ring-ink/8 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-lift focus-within:-translate-y-1.5 focus-within:shadow-lift"
  >
    <div className="relative aspect-[4/3] overflow-hidden bg-linen">
      <PetImage
        src={pet.image}
        alt={pet.name}
        className="media-zoom h-full w-full object-cover object-center"
      />

      <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-1.5">
        {pet.isCommunityListing ? (
          <Tag tone="ochre">Community</Tag>
        ) : (
          <Tag tone="sky">{pet.animalType}</Tag>
        )}
      </div>

      <button
        type="button"
        id={`fav-btn-${pet.id}`}
        onClick={(e) => onToggleFavorite(pet.id, e)}
        aria-label={
          isFavorite ? `Remove ${pet.name} from favourites` : `Save ${pet.name} to favourites`
        }
        aria-pressed={isFavorite}
        className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-cream/90 shadow-soft backdrop-blur-sm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-110 active:scale-95 cursor-pointer"
      >
        <CustomHeart filled={isFavorite} />
      </button>
    </div>

    <div className="flex flex-1 flex-col p-6">
      <p className="label text-ink-muted">{pet.location.split(',')[0]}</p>

      <h3 className="mt-2 font-display text-[1.75rem] leading-none text-ink">{pet.name}</h3>

      <p className="mt-1.5 text-sm text-ink-muted">
        {pet.breed} · {pet.age}
      </p>

      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-ink-muted">{pet.description}</p>

      <div className="mt-auto flex items-center justify-between gap-4 pt-6">
        <span className="label flex items-center gap-1.5 text-moss">
          <Check />
          {pet.medicalInfo?.vaccinated ? 'Health checked' : 'Details on request'}
        </span>

        <button
          type="button"
          id={`meet-btn-${pet.id}`}
          onClick={() => onSelectPet(pet)}
          className="group/cta relative flex items-center gap-2 text-sm text-ink after:absolute after:inset-0 after:content-[''] cursor-pointer"
        >
          <span className="link-draw">Meet {pet.name}</span>
          <span className="relative block h-3.5 w-3.5 overflow-hidden">
            <ArrowGlyph className="absolute inset-0 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:translate-x-4" />
            <ArrowGlyph className="absolute inset-0 -translate-x-4 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:translate-x-0" />
          </span>
        </button>
      </div>
    </div>
  </article>
);

const CustomHeart = ({ filled }) => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
    <path
      d="M10 17s-6.5-4.2-6.5-8.4A3.6 3.6 0 0 1 10 6.2a3.6 3.6 0 0 1 6.5 2.4C16.5 12.8 10 17 10 17Z"
      fill={filled ? 'var(--color-brick)' : 'none'}
      stroke="var(--color-ink)"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

const Check = () => (
  <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
    <path
      d="M2 6.4 4.6 9 10 3.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowGlyph = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M2 8h11M9 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
