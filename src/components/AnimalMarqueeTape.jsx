import { CustomIcon } from './CustomIcon';

const SPECIES = [
  { icon: 'dog', label: 'Dogs' },
  { icon: 'cat', label: 'Cats' },
  { icon: 'rabbit', label: 'Rabbits' },
  { icon: 'bird', label: 'Birds' },
  { icon: 'small-animals', label: 'Small animals' },
];

/**
 * A running band naming the species in the catalogue.
 *
 * It used to be a row of coloured pictograms at 56px, which read as clip art
 * against everything else on the page. Setting the words in the display serif
 * and dropping the icons to small ink marks turns the same idea into
 * typography.
 *
 * Two identical halves scroll as one and the animation translates by exactly
 * -50%, so the seam lands where the second half starts and the loop is
 * invisible. Marked aria-hidden: it is decorative, and a screen reader would
 * otherwise read the species list twice.
 */
export const AnimalMarqueeTape = () => {
  const half = [...SPECIES, ...SPECIES, ...SPECIES];

  return (
    <div
      aria-hidden="true"
      className="relative flex w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] items-center overflow-hidden border-y border-ink/8 bg-linen py-5"
    >
      <div className="animate-marquee-tape">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {half.map((item, index) => (
              <span key={`${copy}-${index}`} className="flex shrink-0 items-center">
                <span className="flex items-center gap-3 px-8">
                  <CustomIcon name={item.icon} tone="muted" className="h-6 w-6" />
                  <span className="font-display text-2xl text-ink/75">{item.label}</span>
                </span>
                <span className="h-1 w-1 shrink-0 rounded-full bg-ink/20" />
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Fade the band into the page at both ends so it reads as continuous
          rather than cut off. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-linen to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-linen to-transparent" />
    </div>
  );
};
