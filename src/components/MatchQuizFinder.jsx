import { useState, useMemo } from 'react';
import { CustomIcon } from './CustomIcon';
import { PetCard } from './PetCard';
import { rankPets } from '../lib/matchScore';
import { PawIcon } from './PawDecorations';
import { AnimalMarqueeTape } from './AnimalMarqueeTape';

export const MatchQuizFinder = ({ pets, favoriteIds, onToggleFavorite, onSelectPet }) => {
  const [selectedType, setSelectedType] = useState('All');
  const [selectedAge, setSelectedAge] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [breedQuery, setBreedQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const animalTypes = [
    { type: 'All', label: 'Any Pet', iconKey: 'any-pet' },
    { type: 'Dog', label: 'Dogs', iconKey: 'dog' },
    { type: 'Cat', label: 'Cats', iconKey: 'cat' },
    { type: 'Rabbit', label: 'Rabbits', iconKey: 'rabbit' },
    { type: 'Bird', label: 'Birds', iconKey: 'bird' },
    { type: 'Other', label: 'Small Animals', iconKey: 'small-animals' },
  ];

  const ageOptions = [
    { value: 'All', label: 'Any Age', desc: 'Young to Senior' },
    { value: 'Young', label: 'Young / Puppy / Kitten', desc: 'Under 2 years' },
    { value: 'Adult', label: 'Adult', desc: '2 to 6 years' },
    { value: 'Senior', label: 'Senior', desc: '7+ years' },
  ];

  const sizeOptions = [
    { value: 'All', label: 'Any Size', desc: 'All sizes welcome' },
    { value: 'Small', label: 'Small', desc: 'Under 10 kg · Apartment friendly' },
    { value: 'Medium', label: 'Medium', desc: '10 - 25 kg · Versatile' },
    { value: 'Large', label: 'Large', desc: '25+ kg · Energetic' },
  ];

  /**
   * Every pet, scored against the five answers and sorted best-first.
   *
   * Deliberately not a filter. Filtering removed a pet outright the moment one
   * preference did not match, so someone who asked for a small dog never saw
   * the medium one that suited them in every other way. Scoring keeps the near
   * misses, ranks them below the exact matches, and shows how close each was.
   *
   * useMemo because this walks all 31 pets and runs on every keystroke in the
   * breed and area boxes.
   */
  const matches = useMemo(
    () =>
      rankPets(pets, {
        species: selectedType,
        age: selectedAge,
        size: selectedSize,
        breed: breedQuery,
        area: locationQuery,
      }),
    [pets, selectedType, selectedAge, selectedSize, breedQuery, locationQuery],
  );

  const handleClearFilters = () => {
    setSelectedType('All');
    setSelectedAge('All');
    setSelectedSize('All');
    setBreedQuery('');
    setLocationQuery('');
  };

  const handleFindMyMatchClick = () => {
    const resultsElement = document.getElementById('match-results-section');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="py-10 lg:py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-ochre-wash text-ink text-xs font-semibold uppercase tracking-wider border border-ink/10">
            <CustomIcon name="sparkle" className="w-3.5 h-3.5" tone="muted" />
            <span>Match Quiz</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] text-ink">Who&rsquo;s your type?</h1>

          <p className="text-xs sm:text-sm text-ink-muted font-medium max-w-xl mx-auto">
            Answer a few questions and we&rsquo;ll rank every pet by how well it fits.
          </p>
        </div>

        {/* Visual Interactive Quiz Filter Card */}
        <div className="bg-paper rounded-[28px] p-6 sm:p-10 border border-ink/10 shadow-lift max-w-5xl mx-auto space-y-8">
          {/* STEP 1: Animal Type Visual Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span
                id="quiz-step-1-label"
                className="text-xs sm:text-sm font-semibold text-ink uppercase tracking-wider flex items-center gap-2"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-xs text-cream">
                  1
                </span>
                WHAT ARE YOU LOOKING FOR?
              </span>
              <span className="text-xs font-bold text-ink-muted">Select one</span>
            </div>

            <div
              role="group"
              aria-labelledby="quiz-step-1-label"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3"
            >
              {animalTypes.map((item) => {
                const isSelected = selectedType === item.type;
                return (
                  <button
                    key={item.type}
                    id={`quiz-type-${item.type.toLowerCase()}`}
                    type="button"
                    onClick={() => setSelectedType(item.type)}
                    className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:-translate-y-0.5 ${
                      isSelected
                        ? 'bg-ink border-ink/10 text-cream shadow-card'
                        : 'bg-paper border-ink/12 text-ink hover:bg-ochre-wash/30 shadow-soft'
                    }`}
                  >
                    <CustomIcon
                      name={item.iconKey}
                      white={isSelected}
                      className="w-9 h-9 sm:w-10 sm:h-10 object-contain my-0.5"
                    />
                    <span className="text-xs font-semibold tracking-wide">{item.label}</span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-ochre-wash text-ink flex items-center justify-center text-[10px] font-semibold mt-0.5">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Age Category Pills */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span
                id="quiz-step-2-label"
                className="text-xs sm:text-sm font-semibold text-ink uppercase tracking-wider flex items-center gap-2"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-xs text-cream">
                  2
                </span>
                HOW OLD WOULD YOU LIKE THEM TO BE?
              </span>
            </div>

            <div
              role="group"
              aria-labelledby="quiz-step-2-label"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
            >
              {ageOptions.map((opt) => {
                const isSelected = selectedAge === opt.value;
                return (
                  <button
                    key={opt.value}
                    id={`quiz-age-${opt.value.toLowerCase()}`}
                    type="button"
                    onClick={() => setSelectedAge(opt.value)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-ink text-cream'
                        : 'bg-paper border-ink/12 text-ink hover:bg-ochre-wash/30 shadow-soft'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{opt.label}</span>
                      {isSelected && <CustomIcon name="tick" className="w-4 h-4 text-ochre" />}
                    </div>
                    <span
                      className={`text-[11px] block mt-0.5 ${isSelected ? 'text-cream/80' : 'text-ink-muted'}`}
                    >
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Size Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span
                id="quiz-step-3-label"
                className="text-xs sm:text-sm font-semibold text-ink uppercase tracking-wider flex items-center gap-2"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-xs text-cream">
                  3
                </span>
                HOW MUCH SPACE DO YOU HAVE?
              </span>
            </div>

            <div
              role="group"
              aria-labelledby="quiz-step-3-label"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
            >
              {sizeOptions.map((opt) => {
                const isSelected = selectedSize === opt.value;
                return (
                  <button
                    key={opt.value}
                    id={`quiz-size-${opt.value.toLowerCase()}`}
                    type="button"
                    onClick={() => setSelectedSize(opt.value)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-ink text-cream'
                        : 'bg-paper border-ink/12 text-ink hover:bg-ochre-wash/30 shadow-soft'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{opt.label}</span>
                      {isSelected && <CustomIcon name="tick" className="w-4 h-4 text-cream" />}
                    </div>
                    <span
                      className={`text-[11px] block mt-0.5 ${isSelected ? 'text-cream/80' : 'text-ink-muted'}`}
                    >
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 4: Breed & Location Searchable inputs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label
                htmlFor="quiz-breed-input"
                className="text-xs sm:text-sm font-semibold text-ink uppercase tracking-wider flex items-center gap-2"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-xs text-cream">
                  4
                </span>
                ANY OTHER PREFERENCES?
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Breed Selector / Search */}
              <div className="relative">
                <CustomIcon
                  name="search"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted"
                />
                <input
                  id="quiz-breed-input"
                  type="text"
                  value={breedQuery}
                  onChange={(e) => setBreedQuery(e.target.value)}
                  placeholder="Breed preference (e.g. Indie, Retriever, Beagle, Lop)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-paper border border-ink/12 text-xs sm:text-sm text-ink font-bold placeholder:text-ink-faint focus:outline-none focus:border-ink/10"
                />
              </div>

              {/* Location Selector / Search */}
              <div className="relative flex items-center">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-ink border border-ink/10 flex items-center justify-center shadow-xs pointer-events-none">
                  <CustomIcon name="location" white className="w-3.5 h-3.5" />
                </div>
                <input
                  id="quiz-location-input"
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Bangalore area (e.g. Indiranagar, Koramangala, Whitefield)..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-paper border border-ink/12 text-xs sm:text-sm text-ink font-bold placeholder:text-ink-faint focus:outline-none focus:border-ink/10"
                />
              </div>
            </div>
          </div>

          {/* Bottom Action Row with Live Counter and Match Button */}
          <div className="pt-4 border-t border-ink/8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-xs sm:text-sm font-semibold text-ink">
                {matches.length > 0 ? (
                  <>
                    <strong className="text-ink">{matches.length}</strong> pets ranked by how
                    closely they fit, best first
                  </>
                ) : (
                  <>Nothing scored high enough against these answers</>
                )}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                id="quiz-clear-filters-btn"
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2.5 rounded-xl bg-paper hover:bg-ochre-wash text-ink border border-ink/10 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-soft cursor-pointer"
              >
                <CustomIcon name="reset" className="w-3.5 h-3.5" />
                <span>Clear filters</span>
              </button>

              <button
                id="quiz-find-my-match-btn"
                type="button"
                onClick={handleFindMyMatchClick}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-ink hover:bg-[#111] text-cream font-semibold text-xs border border-ink/10 shadow-card hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Show my matches</span>
                <CustomIcon name="right-arrow" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Moving Animal Icons Marquee Tape */}
        <AnimalMarqueeTape className="my-8 sm:my-10" />

        {/* Live Match Results Section */}
        <div id="match-results-section" className="mt-8 sm:mt-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-4xl font-display text-ink">
              {matches.length > 0
                ? 'WE FOUND A FEW YOU MIGHT LIKE.'
                : 'HMM... NOTHING QUITE FITS YET.'}
            </h2>
            <p className="text-ink-muted font-medium mt-1 text-xs sm:text-sm">
              {matches.length > 0
                ? 'Based on what you told us, these pets could be a good fit.'
                : "Try changing one of your preferences and we'll have another look."}
            </p>
          </div>

          {matches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {matches.map(({ pet, percent }) => (
                // The score sits above the card rather than inside it, so
                // PetCard stays one component used identically everywhere.
                <div key={pet.id} className="flex flex-col">
                  <p className="label mb-3 flex items-center gap-2 text-ink-muted">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-ochre"
                      style={{ opacity: percent / 100 }}
                    />
                    {percent === 100 ? 'Full match' : `${percent}% match`}
                  </p>
                  <div className="flex-1">
                    <PetCard
                      pet={pet}
                      isFavorite={favoriteIds.includes(pet.id)}
                      onToggleFavorite={onToggleFavorite}
                      onSelectPet={onSelectPet}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-paper rounded-[28px] border border-ink/10 shadow-card p-8 text-center max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-ochre-wash border border-ink/10 flex items-center justify-center mx-auto text-ink">
                <PawIcon className="w-7 h-7 fill-ochre" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-ink">
                Try changing one of your preferences and we'll have another look.
              </p>
              <button
                id="quiz-no-results-clear-btn"
                onClick={handleClearFilters}
                className="px-5 py-2.5 rounded-xl bg-ink text-cream font-semibold text-xs border border-ink/10 shadow-card cursor-pointer"
              >
                CLEAR FILTERS
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
