import { PetImage } from './PetImage';
import { HeartGlyph } from './ui/Glyph';
import { Cross } from './ui/Glyph';
import { ModalShell } from './ModalShell';
import { CustomIcon } from './CustomIcon';

export const SavedMatchesModal = ({
  isOpen,
  onClose,
  likedPets,
  onRemoveMatch,
  onSelectPet,
  onApplyPet,
  onStartSwiping,
}) => {
  if (!isOpen) return null;

  return (
    <ModalShell onClose={onClose} labelledBy="saved-matches-title">
      <div
        id="saved-matches-modal-card"
        className="relative bg-cream rounded-[var(--radius-panel)] max-w-3xl w-full overflow-hidden shadow-lift ring-1 ring-ink/10 my-8 animate-scale-up max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-paper p-5 sm:p-7 border-b border-ink/10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-ochre-wash text-ink border border-ink/10 text-xs font-semibold uppercase tracking-wider mb-1">
              <HeartGlyph className="w-3.5 h-3.5" />
              <span>Favourites</span>
            </div>
            <h2 id="saved-matches-title" className="text-2xl sm:text-3xl font-display text-ink">
              YOUR FAVOURITES ({likedPets.length})
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted font-medium">
              Pets you swiped right on or saved while browsing.
            </p>
          </div>

          <button
            id="saved-matches-close-btn"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-paper text-ink ring-1 ring-ink/10 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-ink hover:text-cream hover:rotate-90 cursor-pointer"
            title="Close"
          >
            <Cross className="w-4 h-4" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {likedPets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {likedPets.map((pet) => (
                <div
                  key={pet.id}
                  id={`saved-match-item-${pet.id}`}
                  className="group bg-paper rounded-2xl p-3.5 border border-ink/12 hover:border-ink/10 shadow-soft transition-all flex flex-col justify-between"
                >
                  <div className="flex gap-3">
                    <PetImage
                      src={pet.image}
                      alt={pet.name}
                      className="w-18 h-18 rounded-xl object-cover object-center border border-ink/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-display text-ink truncate">{pet.name}</h4>
                        <button
                          onClick={() => onRemoveMatch(pet.id)}
                          className="p-1 text-ink-faint hover:text-brick transition-colors cursor-pointer"
                          title="Remove from favourites"
                        >
                          <Cross className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs font-bold text-ink-muted truncate">{pet.breed}</p>

                      <div className="flex items-center gap-1 text-[11px] text-ink-muted mt-1 font-bold">
                        <CustomIcon name="location" className="w-3 h-3" />
                        <span>{pet.location.split(',')[0]}</span>
                        <span>·</span>
                        <span>{pet.age}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 pt-2.5 border-t border-ink/8 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectPet(pet);
                      }}
                      className="text-xs font-semibold text-ink hover:underline cursor-pointer"
                    >
                      View Bio
                    </button>

                    <button
                      id={`saved-match-apply-${pet.id}`}
                      onClick={() => {
                        onClose();
                        onApplyPet(pet);
                      }}
                      disabled={pet.status !== 'AVAILABLE'}
                      className="px-3.5 py-1.5 rounded-xl bg-ink hover:bg-[#111] text-cream font-semibold text-xs uppercase tracking-wider border border-ink/10 shadow-soft disabled:bg-stone-300 disabled:border-stone-300 disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                    >
                      <span>Apply</span>
                      <CustomIcon name="right-arrow" className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-ochre-wash border border-ink/10 text-ink flex items-center justify-center mx-auto shadow-soft">
                <HeartGlyph className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-display text-ink">Nothing here yet.</h3>
              <p className="text-xs sm:text-sm text-ink-muted max-w-sm mx-auto font-medium">
                Start browsing and tap the heart when someone catches your eye.
              </p>
              <button
                id="saved-start-swipe-btn"
                onClick={() => {
                  onClose();
                  onStartSwiping();
                }}
                className="px-5 py-2.5 rounded-xl bg-ink hover:bg-[#111] text-cream font-semibold text-xs uppercase tracking-wider border border-ink/10 shadow-soft inline-flex items-center gap-1.5 cursor-pointer"
              >
                <CustomIcon name="sparkle" className="w-3.5 h-3.5" />
                <span>Start Swiping</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-paper px-6 py-3.5 border-t border-ink/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-ink hover:bg-[#111] text-cream font-semibold text-xs border border-ink/10 shadow-soft cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </ModalShell>
  );
};
