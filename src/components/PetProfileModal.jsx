import { useState } from 'react';
import { HeartGlyph } from './ui/Glyph';
import { Cross } from './ui/Glyph';
import { PetImage } from './PetImage';
import { ModalShell } from './ModalShell';
import { CustomIcon } from './CustomIcon';
import { PawIcon } from './PawDecorations';

export const PetProfileModal = ({
  pet,
  isOpen,
  isFavorite,
  onClose,
  onToggleFavorite,
  onApply,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !pet) return null;

  const isAvailable = pet.status === 'AVAILABLE';

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <ModalShell onClose={onClose} labelledBy="pet-profile-title">
      {/* Modal Container */}
      <div
        id={`pet-profile-modal-${pet.id}`}
        className="relative bg-cream rounded-[var(--radius-panel)] max-w-4xl w-full overflow-hidden shadow-lift ring-1 ring-ink/10 my-8 animate-scale-up"
      >
        {/* Top Floating Close and Share Buttons */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-paper hover:bg-ochre-wash text-ink border border-ink/10 shadow-soft transition-all cursor-pointer"
            title="Share pet profile"
          >
            <CustomIcon name="share" className="w-4 h-4" />
          </button>

          <button
            id="pet-modal-close-btn"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-paper text-ink ring-1 ring-ink/10 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-ink hover:text-cream hover:rotate-90 cursor-pointer"
            title="Close profile"
          >
            <Cross className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Pet Visuals & Quick Highlights */}
          <div className="md:col-span-5 bg-paper p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r-3 border-ink/10">
            <div>
              {/* Primary Single Image */}
              <div className="relative aspect-4/5 rounded-2xl overflow-hidden border border-ink/10 shadow-card bg-paper">
                <PetImage
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-full object-cover object-center"
                />

                {/* Favorite Button on Image */}
                <button
                  onClick={(e) => onToggleFavorite(pet.id, e)}
                  className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-paper text-brick border border-ink/10 shadow-soft hover:bg-ochre-wash transition-all cursor-pointer"
                  title="Save to favorites"
                >
                  <HeartGlyph filled={isFavorite} className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="mt-5 pt-3 border-t border-ink/8 grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-paper p-2.5 rounded-xl border border-ink/12">
                <span className="text-ink-muted block font-bold text-[10px] uppercase">
                  Location
                </span>
                <span className="text-ink font-semibold flex items-center gap-1 mt-0.5 text-xs">
                  <CustomIcon name="location" className="w-3 h-3 text-brick" />
                  {pet.location.split(',')[0]}
                </span>
              </div>
              <div className="bg-paper p-2.5 rounded-xl border border-ink/12">
                <span className="text-ink-muted block font-bold text-[10px] uppercase">
                  Shelter
                </span>
                <span className="text-ink font-semibold block mt-0.5 truncate text-xs">
                  {pet.shelterName || 'CARE Rescue Center'}
                </span>
              </div>
            </div>

            {copiedLink && (
              <p className="text-center text-xs font-semibold text-moss mt-2">
                ✓ Link copied to clipboard!
              </p>
            )}
          </div>

          {/* Right Column: Detailed Profile Narrative & Action */}
          <div className="md:col-span-7 p-5 sm:p-7 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Pet Title & Core Specs */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-ochre-wash border border-ink/10 text-ink uppercase">
                    {pet.animalType}
                  </span>
                  <span className="text-[11px] font-bold text-ink-muted">
                    ID: #{pet.id.toUpperCase()}
                  </span>
                </div>

                <h2
                  id="pet-profile-title"
                  className="text-3xl sm:text-4xl font-display text-ink leading-tight"
                >
                  MEET {pet.name.toUpperCase()}
                </h2>

                <p className="text-xs sm:text-sm font-bold text-ink-muted mt-0.5">
                  {pet.breed} · {pet.age} · {pet.gender} · {pet.size}
                </p>
              </div>

              {/* Personality Badges */}
              <div>
                <h4 className="text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                  PERSONALITY
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {pet.personality.map((trait, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-paper text-ink border border-ink/12"
                    >
                      <CustomIcon name="sparkle" className="w-3 h-3" />
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* About Pet Narrative */}
              <div>
                <h4 className="text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                  A LITTLE ABOUT {pet.name.toUpperCase()}
                </h4>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed bg-paper p-3.5 rounded-xl border border-ink/8 font-medium">
                  "{pet.description}"
                </p>
              </div>

              {/* Good With Compatibility Chips */}
              <div>
                <h4 className="text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                  GOOD WITH
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {pet.goodWith.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-sage-wash text-moss border border-moss/40"
                    >
                      <CustomIcon name="circle-tick" className="w-3 h-3" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Medical Information */}
              <div className="bg-paper p-3.5 rounded-xl border border-ink/12 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <CustomIcon name="health-verified" className="w-4 h-4" />
                    GOOD TO KNOW
                  </h4>
                  <span className="text-[10px] font-semibold text-moss bg-paper border border-moss/30 px-2 py-0.5 rounded-md">
                    Vet Checked
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div
                    className={`p-2 rounded-lg border ${pet.medicalInfo.vaccinated ? 'bg-paper text-moss border-moss/40' : 'bg-stone-50 text-stone-400'}`}
                  >
                    <span className="font-bold block text-[10px]">Vaccinated</span>
                    <span className="font-semibold text-xs">
                      {pet.medicalInfo.vaccinated ? '✓ Yes' : 'No'}
                    </span>
                  </div>
                  <div
                    className={`p-2 rounded-lg border ${pet.medicalInfo.spayedNeutered ? 'bg-paper text-moss border-moss/40' : 'bg-stone-50 text-stone-400'}`}
                  >
                    <span className="font-bold block text-[10px]">Neutered/Spayed</span>
                    <span className="font-semibold text-xs">
                      {pet.medicalInfo.spayedNeutered ? '✓ Yes' : 'Pending'}
                    </span>
                  </div>
                  <div
                    className={`p-2 rounded-lg border ${pet.medicalInfo.microchipped ? 'bg-paper text-moss border-moss/40' : 'bg-stone-50 text-stone-400'}`}
                  >
                    <span className="font-bold block text-[10px]">Microchipped</span>
                    <span className="font-semibold text-xs">
                      {pet.medicalInfo.microchipped ? '✓ Yes' : 'No'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-ink-muted italic">
                  Note: {pet.medicalInfo.healthNotes}
                </p>
              </div>
            </div>

            {/* Bottom Adoption Action CTA */}
            <div className="pt-3 border-t border-ink/8 space-y-2">
              {isAvailable ? (
                <button
                  id="profile-apply-adopt-btn"
                  onClick={() => {
                    onClose();
                    onApply(pet);
                  }}
                  className="w-full py-3.5 rounded-xl bg-ink hover:bg-[#111] text-cream font-semibold text-sm tracking-wider uppercase border border-ink/10 shadow-card hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PawIcon className="w-4 h-4 fill-cream" />
                  <span>APPLY TO ADOPT {pet.name.toUpperCase()}</span>
                </button>
              ) : (
                <div className="space-y-2 bg-paper p-4 rounded-2xl border border-ink/12 text-center">
                  <h4 className="text-base font-display text-ink">
                    THIS PET HAS ALREADY FOUND A HOME 🏠
                  </h4>
                  <p className="text-xs font-semibold text-ink-muted">
                    They're no longer available, but there are plenty of other pets waiting.
                  </p>
                  <button
                    id="profile-see-other-pets-btn"
                    onClick={onClose}
                    className="w-full py-2.5 rounded-xl bg-ink hover:bg-[#111] text-cream font-semibold text-xs border border-ink/10 shadow-soft transition-all cursor-pointer mt-1"
                  >
                    SEE OTHER PETS
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
};
