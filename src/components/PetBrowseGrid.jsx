import { useState, useMemo } from 'react';
import { HeartGlyph } from './ui/Glyph';
import { Cross } from './ui/Glyph';
import { PetImage } from './PetImage';
import { CustomIcon } from './CustomIcon';
import { PetCard } from './PetCard';
import { Reveal } from './ui/Reveal';
import { PawIcon } from './PawDecorations';

export const PetBrowseGrid = ({
  pets,
  favoriteIds,
  onToggleFavorite,
  onSelectPet,
  onOpenMatchFinder,
  onShufflePets,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAge, setSelectedAge] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedActivity, setSelectedActivity] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedTrait, setSelectedTrait] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [visibleCount, setVisibleCount] = useState(12);

  const categories = [
    { type: 'All', label: 'All Pets', icon: 'any-pet' },
    { type: 'Dog', label: 'Dogs', icon: 'dog' },
    { type: 'Cat', label: 'Cats', icon: 'cat' },
    { type: 'Rabbit', label: 'Rabbits', icon: 'rabbit' },
    { type: 'Bird', label: 'Birds', icon: 'bird' },
    { type: 'Other', label: 'Small Animals', icon: 'small-animals' },
  ];

  // Distinct locations available
  const availableLocations = useMemo(() => {
    const locs = Array.from(new Set(pets.map((p) => p.location.split(',')[0].trim())));
    return ['All', ...locs];
  }, [pets]);

  // Distinct traits
  const traitFilters = [
    { id: 'All', label: 'All Personalities' },
    { id: 'Children', label: 'Good with Kids' },
    { id: 'Dogs', label: 'Good with Dogs' },
    { id: 'Cats', label: 'Good with Cats' },
    { id: 'Apartment Living', label: 'Apartment Friendly' },
    { id: 'First-time Owners', label: 'First-Time Friendly' },
    { id: 'Playful', label: 'Playful & Active' },
    { id: 'Gentle', label: 'Gentle & Calm' },
    { id: 'Bonded Pair', label: 'Bonded Pairs' },
  ];

  // Filter and search logic
  const filteredPets = useMemo(() => {
    return pets
      .filter((pet) => {
        // Category match
        if (selectedCategory !== 'All' && pet.animalType !== selectedCategory) {
          return false;
        }
        // Age filter
        if (selectedAge !== 'All' && pet.ageCategory !== selectedAge) {
          return false;
        }
        // Size filter
        if (selectedSize !== 'All' && pet.size !== selectedSize) {
          return false;
        }
        // Gender filter
        if (selectedGender !== 'All' && pet.gender !== selectedGender) {
          return false;
        }
        // Activity level filter
        if (selectedActivity !== 'All' && pet.activityLevel !== selectedActivity) {
          return false;
        }
        // Location filter
        if (
          selectedLocation !== 'All' &&
          !pet.location.toLowerCase().includes(selectedLocation.toLowerCase())
        ) {
          return false;
        }
        // Trait filter
        if (selectedTrait !== 'All') {
          const inGoodWith = pet.goodWith?.some((g) =>
            g.toLowerCase().includes(selectedTrait.toLowerCase()),
          );
          const inPersonality = pet.personality?.some((p) =>
            p.toLowerCase().includes(selectedTrait.toLowerCase()),
          );
          if (!inGoodWith && !inPersonality) {
            return false;
          }
        }
        // Search query
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchesName = pet.name.toLowerCase().includes(q);
          const matchesBreed = pet.breed.toLowerCase().includes(q);
          const matchesLocation = pet.location.toLowerCase().includes(q);
          const matchesShelter = (pet.shelterName || '').toLowerCase().includes(q);
          const matchesPersonality = pet.personality.some((p) => p.toLowerCase().includes(q));
          if (
            !matchesName &&
            !matchesBreed &&
            !matchesLocation &&
            !matchesShelter &&
            !matchesPersonality
          ) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'recent') {
          return (b.dateAdded || '').localeCompare(a.dateAdded || '');
        }
        if (sortBy === 'age') {
          return a.age.localeCompare(b.age);
        }
        return 0;
      });
  }, [
    pets,
    selectedCategory,
    searchQuery,
    selectedAge,
    selectedSize,
    selectedGender,
    selectedActivity,
    selectedLocation,
    selectedTrait,
    sortBy,
  ]);

  const activeFilterCount = [
    selectedCategory !== 'All',
    searchQuery !== '',
    selectedAge !== 'All',
    selectedSize !== 'All',
    selectedGender !== 'All',
    selectedActivity !== 'All',
    selectedLocation !== 'All',
    selectedTrait !== 'All',
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSelectedAge('All');
    setSelectedSize('All');
    setSelectedGender('All');
    setSelectedActivity('All');
    setSelectedLocation('All');
    setSelectedTrait('All');
    setSortBy('featured');
    setVisibleCount(12);
  };

  const paginatedPets = filteredPets.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPets.length;

  return (
    <section className="min-h-screen px-6 pb-24 sm:px-10">
      <div className="mx-auto max-w-[1600px]">
        {/* Header. Open on the page rather than boxed in a card — the filter
            controls below already carry enough chrome. */}
        <div className="flex flex-col justify-between gap-8 border-b border-ink/8 pb-10 lg:flex-row lg:items-end">
          <Reveal className="max-w-2xl">
            <p className="label flex items-center gap-3 text-ink-muted">
              <span aria-hidden="true" className="h-px w-8 bg-ink-faint" />
              {pets.length} looking for homes
            </p>
            <h1 className="mt-5 text-4xl leading-[1.05] text-ink sm:text-5xl lg:text-[3.5rem]">
              Who&rsquo;s waiting for you?
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-muted">
              Filter by what matters to you — species, age, size, the area of the city, or how they
              are around other animals.
            </p>
          </Reveal>

          <Reveal delay={140} className="flex shrink-0 flex-wrap items-center gap-3">
            {onShufflePets && (
              <button
                id="browse-shuffle-pets-btn"
                type="button"
                onClick={onShufflePets}
                className="rounded-full bg-paper px-5 py-3 text-sm text-ink shadow-soft ring-1 ring-ink/10 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-card cursor-pointer"
              >
                Shuffle
              </button>
            )}
            <button
              id="browse-open-quiz-btn"
              type="button"
              onClick={onOpenMatchFinder}
              className="rounded-full bg-ink px-6 py-3 text-sm text-cream transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgba(34,26,16,0.55)] cursor-pointer"
            >
              Take the match quiz
            </button>
          </Reveal>
        </div>

        <div className="mt-10">
          {/* Category Tabs Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-2 scrollbar-none">
            {categories.map((cat) => {
              const count =
                cat.type === 'All'
                  ? pets.length
                  : pets.filter((p) => p.animalType === cat.type).length;
              const isSelected = selectedCategory === cat.type;

              return (
                <button
                  key={cat.type}
                  id={`category-tab-${cat.type.toLowerCase()}`}
                  onClick={() => {
                    setSelectedCategory(cat.type);
                    setVisibleCount(12);
                  }}
                  className={`flex cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-full px-4 py-2.5 text-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isSelected
                      ? 'bg-ink text-cream'
                      : 'bg-paper text-ink ring-1 ring-ink/10 hover:-translate-y-0.5 hover:shadow-soft'
                  }`}
                >
                  <CustomIcon
                    name={cat.icon}
                    white={isSelected}
                    tone={isSelected ? 'default' : 'muted'}
                    className="w-5 h-5 object-contain"
                  />
                  <span>{cat.label}</span>
                  <span
                    className={`tabular rounded-full px-2 py-0.5 text-[11px] ${
                      isSelected ? 'bg-cream/20 text-cream' : 'bg-linen text-ink-muted'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filter Controls Card */}
          <div className="mt-4 pt-4 border-t border-ink/8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              {/* Search Input */}
              <div className="lg:col-span-4 relative">
                <CustomIcon
                  name="search"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted"
                />
                <input
                  id="pet-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(12);
                  }}
                  placeholder="Search by name, breed, Bangalore area, or shelter..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-paper ring-1 ring-ink/10 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ink"
                />
              </div>

              {/* Age Category Filter */}
              <div className="lg:col-span-2">
                <select
                  id="filter-age-select"
                  value={selectedAge}
                  onChange={(e) => {
                    setSelectedAge(e.target.value);
                    setVisibleCount(12);
                  }}
                  className="w-full px-4 py-2.5 rounded-full bg-paper ring-1 ring-ink/10 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink cursor-pointer"
                >
                  <option value="All">All Ages</option>
                  <option value="Young">Puppy / Kitten / Young</option>
                  <option value="Adult">Adult</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>

              {/* Size Filter */}
              <div className="lg:col-span-2">
                <select
                  id="filter-size-select"
                  value={selectedSize}
                  onChange={(e) => {
                    setSelectedSize(e.target.value);
                    setVisibleCount(12);
                  }}
                  className="w-full px-4 py-2.5 rounded-full bg-paper ring-1 ring-ink/10 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink cursor-pointer"
                >
                  <option value="All">All Sizes</option>
                  <option value="Small">Small (&lt; 10kg)</option>
                  <option value="Medium">Medium (10 - 25kg)</option>
                  <option value="Large">Large (&gt; 25kg)</option>
                </select>
              </div>

              {/* Location Filter */}
              <div className="lg:col-span-2">
                <select
                  id="filter-location-select"
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    setVisibleCount(12);
                  }}
                  className="w-full px-4 py-2.5 rounded-full bg-paper ring-1 ring-ink/10 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink cursor-pointer"
                >
                  <option value="All">All Localities</option>
                  {availableLocations
                    .filter((l) => l !== 'All')
                    .map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="lg:col-span-2">
                <select
                  id="filter-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full bg-paper ring-1 ring-ink/10 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink cursor-pointer"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="recent">Sort: Recently Added</option>
                  <option value="name">Sort: Name (A-Z)</option>
                  <option value="age">Sort: Age</option>
                </select>
              </div>
            </div>

            {/* Quick Lifestyle / Trait Filter Tags */}
            <div className="mt-3 pt-3 border-t border-ink/10 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider shrink-0 flex items-center gap-1">
                <CustomIcon name="filter" className="w-3 h-3" />
                <span>Personality:</span>
              </span>
              {traitFilters.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTrait(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-all uppercase tracking-wider cursor-pointer ${
                    selectedTrait === t.id
                      ? 'bg-ink text-cream border border-ink/10'
                      : 'bg-paper text-ink hover:bg-ochre-wash border border-ink/8'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Bottom Bar with Count, Active Filter Tokens, View Switcher */}
            <div className="mt-3 pt-3 border-t border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold text-ink-muted">
              <div className="flex items-center gap-3">
                <span>
                  Showing <strong className="text-ink text-sm">{filteredPets.length}</strong> of{' '}
                  {pets.length} pets
                </span>

                {activeFilterCount > 0 && (
                  <button
                    id="browse-reset-filters-btn"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-ink/10 text-brick hover:bg-ink hover:text-cream transition-all text-[10px] cursor-pointer"
                  >
                    <Cross className="w-3 h-3" />
                    <span>CLEAR FILTERS ({activeFilterCount})</span>
                  </button>
                )}
              </div>

              {/* View Mode Toggle: Grid vs List */}
              <div className="flex items-center gap-1 bg-paper p-1 rounded-xl border border-ink/12">
                <button
                  id="view-mode-grid-btn"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'grid' ? 'bg-ink text-cream' : 'text-ink hover:bg-paper'
                  }`}
                  title="Grid View"
                >
                  <CustomIcon name="three lines" white={viewMode === 'grid'} className="w-4 h-4" />
                </button>
                <button
                  id="view-mode-list-btn"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'list' ? 'bg-ink text-cream' : 'text-ink hover:bg-paper'
                  }`}
                  title="Detailed List View"
                >
                  <CustomIcon name="file" white={viewMode === 'list'} className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Moving Animal Icons Marquee Tape */}

        {/* Pets Presentation: Grid View */}
        {filteredPets.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {paginatedPets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  isFavorite={favoriteIds.includes(pet.id)}
                  onToggleFavorite={onToggleFavorite}
                  onSelectPet={onSelectPet}
                />
              ))}
            </div>
          ) : (
            /* Pets Presentation: Detailed List / Table Mode */
            <div className="space-y-4">
              {paginatedPets.map((pet) => {
                const isFavorite = favoriteIds.includes(pet.id);
                return (
                  <article
                    key={pet.id}
                    className="group relative bg-paper rounded-2xl p-5 border border-ink/10 shadow-card hover:shadow-lift focus-within:shadow-lift hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                  >
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-ink/10 bg-paper relative">
                        <PetImage
                          src={pet.image}
                          alt={pet.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-2xl font-display text-ink group-hover:text-brick transition-colors leading-tight">
                            {pet.name}
                          </h3>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-ochre-wash border border-ink/10 text-ink uppercase">
                            {pet.breed}
                          </span>
                        </div>

                        <p className="text-xs text-ink-muted font-medium line-clamp-1 max-w-lg">
                          "{pet.description}"
                        </p>

                        <div className="flex items-center gap-3 text-xs font-bold text-ink-muted flex-wrap">
                          <span className="inline-flex items-center gap-1.5 text-ink">
                            <span className="w-5 h-5 rounded-md bg-ink border border-ink/10 flex items-center justify-center shrink-0">
                              <CustomIcon name="location" white className="w-3 h-3" />
                            </span>
                            <span>{pet.location}</span>
                          </span>
                          <span>•</span>
                          <span>{pet.gender}</span>
                          <span>•</span>
                          <span>
                            {pet.age} ({pet.ageCategory})
                          </span>
                          <span>•</span>
                          <span className="text-moss font-semibold">
                            {pet.adoptionFee || 'Free adoption'}
                          </span>
                        </div>

                        {/* Personality tags */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          {pet.personality.slice(0, 4).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-paper text-ink border border-ink/12 uppercase"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions on right */}
                    <div className="flex items-center justify-between md:justify-end gap-2.5 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-ink/8">
                      <button
                        type="button"
                        onClick={(e) => onToggleFavorite(pet.id, e)}
                        className="relative z-10 p-2.5 rounded-xl bg-paper hover:bg-ochre-wash text-brick border border-ink/10 shadow-soft transition-all cursor-pointer"
                        aria-label={
                          isFavorite
                            ? `Remove ${pet.name} from favourites`
                            : `Save ${pet.name} to favourites`
                        }
                        aria-pressed={isFavorite}
                      >
                        <HeartGlyph filled={isFavorite} className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectPet(pet)}
                        className="px-5 py-2.5 rounded-xl bg-ink hover:bg-ink text-cream font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all border border-ink/10 shadow-soft cursor-pointer after:absolute after:inset-0 after:content-['']"
                      >
                        <span>Meet {pet.name}</span>
                        <CustomIcon name="right-arrow" className="w-4 h-4" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )
        ) : (
          /* Empty State */
          <div className="bg-paper rounded-[28px] border border-ink/10 shadow-card p-10 text-center max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 rounded-xl bg-ochre-wash border border-ink/10 flex items-center justify-center mx-auto text-ink">
              <PawIcon className="w-7 h-7 fill-ochre" />
            </div>
            <h3 className="text-2xl font-display text-ink">No pets match these filters</h3>
            <p className="text-xs sm:text-sm text-ink-muted font-medium">
              Try clearing your filters to see everyone who's available.
            </p>
            <button
              id="empty-browse-clear-btn"
              onClick={handleResetFilters}
              className="px-5 py-3 rounded-xl bg-ink hover:bg-[#111] text-cream font-semibold text-xs border border-ink/10 shadow-soft transition-all cursor-pointer"
            >
              CLEAR FILTERS
            </button>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-10 text-center">
            <button
              id="browse-load-more-btn"
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className="px-7 py-3.5 rounded-xl bg-ink hover:bg-[#111] text-cream font-semibold text-xs uppercase tracking-wider border border-ink/10 shadow-lift hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>See More Pets ({filteredPets.length - visibleCount} remaining)</span>
              <CustomIcon name="right-arrow" className="w-4 h-4 rotate-90" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
