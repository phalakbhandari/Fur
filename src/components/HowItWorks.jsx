import { CustomIcon } from './CustomIcon';
import { Reveal } from './ui/Reveal';
import { SectionIntro } from './ui/SectionIntro';

/**
 * The three-step explainer.
 *
 * Previously three boxed cards of unequal height, centred, with an all-caps
 * heading — the layout fought the content, because step two has half as much
 * to say as steps one and three and an equal-height card made that a hole.
 *
 * As numbered rows on a rule, uneven content is the natural state rather than
 * a defect, and the eye has a single left edge to travel down.
 */

const STEPS = [
  {
    number: '01',
    icon: 'discover',
    title: 'Look around',
    body: 'Filter by species, size, area and temperament — or let the deck show you one at a time and go on instinct.',
    action: 'Browse the catalogue',
    key: 'discover',
  },
  {
    number: '02',
    icon: 'sparkle',
    title: 'Find a fit',
    body: 'Tell us the species, age, size and area you have in mind. Every pet is scored against your answers and ranked, so near misses still show up.',
    action: 'Take the match quiz',
    key: 'meet',
  },
  {
    number: '03',
    icon: 'file',
    title: 'Take the next step',
    body: 'Send an application to the shelter, then follow it through the call, the meeting, and the day they come home.',
    action: 'See my applications',
    key: 'connect',
  },
];

export const HowItWorks = ({ onDiscoverClick, onMeetClick, onConnectClick }) => {
  const handlers = {
    discover: onDiscoverClick,
    meet: onMeetClick,
    connect: onConnectClick,
  };

  return (
    <section className="px-6 py-20 sm:px-10 lg:py-28" aria-labelledby="how-it-works-heading">
      <div className="mx-auto max-w-[1600px]">
        <SectionIntro
          eyebrow="How it works"
          title={
            <span id="how-it-works-heading">Three steps, and none of them are a phone call.</span>
          }
        >
          Adoption in this city still mostly runs on WhatsApp groups and word of mouth. This is the
          same process, in one place, where you can see what is happening.
        </SectionIntro>

        <div className="mt-16 border-t border-ink/8">
          {STEPS.map((step, index) => (
            <Reveal
              key={step.number}
              delay={index * 90}
              as="button"
              type="button"
              onClick={handlers[step.key]}
              className="group grid w-full grid-cols-1 items-start gap-6 border-b border-ink/8 py-10 text-left transition-colors duration-500 hover:bg-linen/60 sm:grid-cols-[auto_1fr_auto] sm:gap-10 sm:px-4 cursor-pointer"
            >
              <span className="font-display text-5xl leading-none text-ink-faint transition-colors duration-500 group-hover:text-ochre sm:w-24">
                {step.number}
              </span>

              <span className="grid gap-3 sm:grid-cols-[1fr_1.3fr] sm:gap-10">
                <span className="flex items-baseline gap-3">
                  <CustomIcon
                    name={step.icon}
                    tone="muted"
                    className="h-5 w-5 shrink-0 translate-y-1"
                  />
                  <span className="font-display text-3xl leading-tight text-ink sm:text-4xl">
                    {step.title}
                  </span>
                </span>

                <span className="block max-w-xl text-[0.95rem] leading-relaxed text-ink-muted">
                  {step.body}
                </span>
              </span>

              <span className="label flex items-center gap-2 self-center whitespace-nowrap text-ink">
                <span className="link-draw">{step.action}</span>
                <span className="relative block h-3 w-3 overflow-hidden">
                  <Arrow className="absolute inset-0 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-4" />
                  <Arrow className="absolute inset-0 -translate-x-4 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
                </span>
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

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
