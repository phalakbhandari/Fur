import { useEffect, useRef, useState } from 'react';
import { Cross } from './ui/Glyph';
import { PetImage } from './PetImage';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { CustomIcon } from './CustomIcon';
import { HeartGlyph } from './ui/Glyph';

export const SwipeCardDeck = ({
  pets,
  likedPetIds,
  onSwipeRight,
  onSwipeLeft,
  onOpenMatches,
  onSelectPet,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [, setDragDirection] = useState(null);

  // Motion values for the top card
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-18, 18]);
  const opacityPass = useTransform(x, [-180, -30], [1, 0]);
  const opacityLike = useTransform(x, [30, 180], [0, 1]);
  const scaleUnder = useTransform(x, [-200, 0, 200], [1, 0.95, 1]);

  const currentPet = pets[currentIndex];
  const nextPet = pets[currentIndex + 1];
  const petsLeft = pets.length - currentIndex;

  const handleSwipe = (direction) => {
    if (!currentPet) return;

    if (direction === 'right') {
      onSwipeRight(currentPet);
      setHistory((prev) => [...prev, { pet: currentPet, action: 'like' }]);
    } else {
      onSwipeLeft(currentPet);
      setHistory((prev) => [...prev, { pet: currentPet, action: 'pass' }]);
    }

    setCurrentIndex((prev) => prev + 1);
    x.set(0);
    setDragDirection(null);
  };

  const handleUndo = () => {
    if (currentIndex > 0 && history.length > 0) {
      setHistory((prev) => prev.slice(0, -1));
      setCurrentIndex((prev) => prev - 1);
      x.set(0);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setHistory([]);
    x.set(0);
  };

  // Arrow keys swipe the deck. The handler is held in a ref so the listener
  // is attached once rather than being torn down and rebuilt on every render.
  const swipeRef = useRef(handleSwipe);
  swipeRef.current = handleSwipe;

  useEffect(() => {
    const handleKeyDown = (event) => {
      // A dialog on top owns the keyboard; arrow keys must not reach the deck
      // underneath it. Same for anywhere the visitor is actually typing.
      if (document.querySelector('[role="dialog"]')) return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        swipeRef.current('left');
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        swipeRef.current('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="py-2 sm:py-4 min-h-[calc(100vh-4.5rem)] flex flex-col justify-center">
      <div className="max-w-3xl mx-auto px-4 w-full">
        {/* Page Header */}
        <div className="text-center space-y-1.5 mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-lg bg-ochre-wash text-ink text-[11px] font-semibold uppercase tracking-wider border border-ink/10">
            <CustomIcon name="sparkle" className="w-3 h-3 text-brick" />
            <span>Swipe to Match</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display text-ink tracking-normal">
            Let&rsquo;s play matchmaker
          </h1>

          <p className="text-xs sm:text-sm text-ink-muted font-medium max-w-md mx-auto">
            Swipe through a few pets and save the ones you like.
          </p>

          <div className="flex items-center justify-center gap-3 pt-0.5">
            <span className="font-semibold text-ink-muted uppercase tracking-wider text-[11px]">
              {petsLeft > 0 ? `${petsLeft} pets left to see` : 'All done!'}
            </span>

            {/* Top Bar Match Drawer Button */}
            <button
              id="view-my-matches-top-btn"
              onClick={onOpenMatches}
              className="px-3 py-1 rounded-lg bg-ink hover:bg-[#111] text-cream flex items-center gap-1.5 border border-ink/10 shadow-soft transition-all hover:-translate-y-0.5 text-[10px] font-semibold cursor-pointer"
            >
              <HeartGlyph className="w-3 h-3 text-ochre" />
              <span>Your Favourites ({likedPetIds.length})</span>
            </button>
          </div>
        </div>

        {/* Swipe Card Deck Area */}
        <div className="relative w-full max-w-[340px] sm:max-w-[360px] mx-auto h-[380px] sm:h-[400px] mb-3 select-none">
          {currentPet ? (
            <div className="relative w-full h-full">
              {/* Next Card Sitting Underneath */}
              {nextPet && (
                <motion.div
                  style={{ scale: scaleUnder }}
                  className="absolute inset-0 bg-paper rounded-2xl border border-ink/10 shadow-card p-3.5 overflow-hidden pointer-events-none opacity-60 flex flex-col"
                >
                  <div className="relative w-full h-[210px] sm:h-[225px] bg-paper rounded-xl overflow-hidden mb-2 border border-ink/12">
                    <PetImage
                      src={nextPet.image}
                      alt={nextPet.name}
                      className="w-full h-full object-cover object-center filter blur-[0.5px]"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-display text-ink">{nextPet.name}</h3>
                    <p className="text-sm text-ink-muted">
                      {nextPet.breed} • {nextPet.age}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Active Top Draggable Card */}
              <motion.div
                id={`swipe-card-${currentPet.id}`}
                style={{ x, rotate }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.9}
                onDrag={(_, info) => {
                  if (info.offset.x > 30) setDragDirection('right');
                  else if (info.offset.x < -30) setDragDirection('left');
                  else setDragDirection(null);
                }}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 100 || info.velocity.x > 500) {
                    handleSwipe('right');
                  } else if (info.offset.x < -100 || info.velocity.x < -500) {
                    handleSwipe('left');
                  } else {
                    setDragDirection(null);
                  }
                }}
                className="absolute inset-0 bg-paper rounded-2xl border border-ink/10 shadow-card p-3.5 flex flex-col justify-between overflow-hidden cursor-grab active:cursor-grabbing z-20"
              >
                {/* Pet Image */}
                <div className="relative h-[210px] sm:h-[225px] w-full bg-paper rounded-xl overflow-hidden border border-ink/10">
                  <PetImage
                    src={currentPet.image}
                    alt={currentPet.name}
                    className="w-full h-full object-cover object-center pointer-events-none"
                  />

                  {/* LIKE Floating Indicator Overlay */}
                  <motion.div
                    style={{ opacity: opacityLike }}
                    className="absolute top-3 right-3 px-3.5 py-1 rounded-lg bg-moss border border-white text-cream font-semibold text-xs tracking-wider uppercase shadow-md transform rotate-12 flex items-center gap-1 pointer-events-none"
                  >
                    <HeartGlyph className="w-3.5 h-3.5" />
                    <span>LIKE</span>
                  </motion.div>

                  {/* PASS Floating Indicator Overlay */}
                  <motion.div
                    style={{ opacity: opacityPass }}
                    className="absolute top-3 left-3 px-3.5 py-1 rounded-lg bg-ink border border-white text-cream font-semibold text-xs tracking-wider uppercase shadow-md transform -rotate-12 flex items-center gap-1 pointer-events-none"
                  >
                    <Cross className="w-3.5 h-3.5" />
                    <span>PASS</span>
                  </motion.div>
                </div>

                {/* Card Information Body */}
                <div className="flex-1 flex flex-col justify-between pt-2">
                  <div>
                    <div id="swipe-name" className="text-2xl font-display text-ink leading-tight">
                      {currentPet.name}
                    </div>

                    <p id="swipe-meta" className="mt-1 mb-2 text-sm text-ink-muted">
                      {currentPet.breed} • {currentPet.age} • {currentPet.gender} •{' '}
                      {currentPet.location.split(',')[0]}
                    </p>

                    <div className="flex flex-wrap gap-1" id="swipe-tags">
                      {currentPet.personality.slice(0, 3).map((trait, idx) => (
                        <span
                          key={idx}
                          className="bg-paper text-ink border border-ink/12 px-1.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wide"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* View Full Profile link */}
                  <div className="pt-1.5 flex items-center justify-between border-t border-ink/8">
                    <button
                      id={`swipe-view-details-${currentPet.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPet(currentPet);
                      }}
                      className="flex cursor-pointer items-center gap-2 text-sm text-ink transition-colors"
                    >
                      <CustomIcon name="search" className="w-3.5 h-3.5" />
                      <span className="link-draw">Meet {currentPet.name}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            /* Deck Finished State */
            <div className="w-full h-full bg-paper rounded-2xl border border-ink/10 p-6 text-center flex flex-col items-center justify-center space-y-3 shadow-card">
              <div className="w-12 h-12 rounded-xl bg-ochre-wash border border-ink/10 text-moss flex items-center justify-center mx-auto shadow-inner">
                <CustomIcon name="circle-tick" className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display text-ink">You've seen all the pets!</h3>
              <p className="text-xs text-ink-muted max-w-xs font-medium">
                You've swiped through everyone. Check out your favourites or start over from the
                beginning.
              </p>
              <div className="pt-1 flex flex-col gap-2 w-full max-w-xs">
                <button
                  id="deck-view-matches-btn"
                  onClick={onOpenMatches}
                  className="w-full py-2.5 rounded-xl bg-ink hover:bg-[#111] text-cream font-semibold text-xs border border-ink/10 shadow-soft flex items-center justify-center gap-2 cursor-pointer"
                >
                  <HeartGlyph className="w-3.5 h-3.5" />
                  <span>View Favourites ({likedPetIds.length})</span>
                </button>
                <button
                  id="deck-reset-btn"
                  onClick={handleReset}
                  className="w-full py-2 rounded-xl bg-paper hover:bg-ochre-wash text-ink font-semibold text-xs border border-ink/10 shadow-soft flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CustomIcon name="retry" className="w-3.5 h-3.5" />
                  <span>Start Over</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Interaction Buttons Below Card */}
        {currentPet && (
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center gap-4 sm:gap-5">
              {/* PASS BUTTON */}
              <button
                id="swipe-btn-pass"
                onClick={() => handleSwipe('left')}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-paper border border-ink/10 text-ink-muted flex items-center justify-center hover:bg-ink-muted hover:text-cream transition-all shadow-soft hover:-translate-y-0.5 cursor-pointer"
                title="Swipe Left: Pass"
              >
                <Cross className="w-6 h-6" />
              </button>

              {/* UNDO BUTTON */}
              <button
                id="swipe-btn-undo"
                onClick={handleUndo}
                disabled={currentIndex === 0}
                className="p-2.5 rounded-xl bg-ochre-wash hover:bg-ochre text-ink border border-ink/10 shadow-soft disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                title="Undo last swipe"
                aria-label="Undo last swipe"
              >
                <CustomIcon name="undo" className="w-4 h-4" />
              </button>

              {/* LIKE BUTTON */}
              <button
                id="swipe-btn-like"
                onClick={() => handleSwipe('right')}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-ink border border-ink/10 text-cream flex items-center justify-center hover:bg-[#111] transition-all shadow-card hover:-translate-y-0.5 cursor-pointer"
                title="Swipe Right: Like"
              >
                <HeartGlyph className="w-8 h-8" />
              </button>
            </div>

            {/* Keyboard hint */}
            <p className="text-center text-[11px] font-bold text-ink-muted uppercase tracking-wider mt-2">
              Keyboard:{' '}
              <kbd className="px-1.5 py-0.5 bg-paper rounded border border-ink/10 text-ink font-semibold text-[10px]">
                ←
              </kbd>{' '}
              Pass or{' '}
              <kbd className="px-1.5 py-0.5 bg-paper rounded border border-ink/10 text-ink font-semibold text-[10px]">
                →
              </kbd>{' '}
              Like
            </p>
          </div>
        )}
      </div>

      {/* Moving Animal Icons Marquee Tape (Full Width Edge to Edge) */}
    </div>
  );
};
