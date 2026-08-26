const QUESTIONS = [
  {
    q: 'What happens after I send an application?',
    a: 'The shelter reads it, calls you for a short chat, and arranges a time for you to meet the pet in person. Everything stays visible under My Applications while that plays out.',
  },
  {
    q: 'Are all the pets health checked?',
    a: 'Every pet listed by a partner shelter has been seen by a vet, vaccinated, and dewormed before going up. Community listings are posted by individuals, so their medical history is whatever the person listing them tells you — ask.',
  },
  {
    q: 'Can I apply for more than one pet?',
    a: 'Yes. Save as many favourites as you like and apply for whichever ones feel right. Shelters would rather you applied for two and picked well than applied for one and were unsure.',
  },
  {
    q: 'What does adoption cost?',
    a: 'Most shelter adoptions here are free. What you are signing up for is the cost of keeping an animal — food, vaccinations, and a vet you can call. Budget for that rather than for the adoption itself.',
  },
  {
    q: 'I found a stray. Can I list them?',
    a: 'That is what List a Pet is for. Add a photo, where you found them, and what they are like around people. It takes about two minutes.',
  },
];

export const FaqSection = () => (
  <section className="max-w-4xl mx-auto px-4 py-16">
    <div className="text-center mb-10">
      <span className="inline-block px-3 py-1 rounded-full bg-ochre-wash text-ink-muted text-xs font-semibold uppercase tracking-wider">
        Adoption FAQ
      </span>
      <h2 className="text-3xl sm:text-4xl font-display text-ink mt-3">Things people ask</h2>
    </div>

    <div className="space-y-3">
      {QUESTIONS.map(({ q, a }) => (
        <details
          key={q}
          className="group bg-paper rounded-2xl border border-ink/8 open:border-ink/10 open:shadow-card transition-all"
        >
          <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none">
            <h3 className="text-base font-semibold text-ink">{q}</h3>
            <span
              aria-hidden="true"
              className="shrink-0 w-6 h-6 rounded-lg bg-ochre-wash border border-ink/10 flex items-center justify-center text-ink font-semibold text-sm leading-none transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="px-5 pb-5 -mt-1 text-sm text-ink-muted font-medium leading-relaxed">{a}</p>
        </details>
      ))}
    </div>
  </section>
);
