import { lazy, Suspense, useCallback, useMemo, useState } from 'react';

import { KEYS } from './lib/storage';
import { celebrate } from './lib/celebrate';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import { usePetCollection } from './hooks/usePetCollection';
import { usePersistentState } from './hooks/usePersistentState';

import { Navbar } from './components/Navbar';
import { HowItWorks } from './components/HowItWorks';
import { PetBrowseGrid } from './components/PetBrowseGrid';
import { SwipeCardDeck } from './components/SwipeCardDeck';
import { MatchQuizFinder } from './components/MatchQuizFinder';
import { MyApplicationsView } from './components/MyApplicationsView';
import { HomeView } from './components/HomeView';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { PawIcon } from './components/PawDecorations';
import { useReveal } from './hooks/useReveal';

/**
 * Modals are behind a dynamic import. None of them is on the first paint
 * path, and together they are a meaningful slice of the bundle — the adoption
 * form alone pulls in canvas-confetti.
 */
const PetProfileModal = lazy(() =>
  import('./components/PetProfileModal').then((m) => ({ default: m.PetProfileModal })),
);
const AdoptionFormModal = lazy(() =>
  import('./components/AdoptionFormModal').then((m) => ({ default: m.AdoptionFormModal })),
);
const SavedMatchesModal = lazy(() =>
  import('./components/SavedMatchesModal').then((m) => ({ default: m.SavedMatchesModal })),
);
const SignInModal = lazy(() =>
  import('./components/SignInModal').then((m) => ({ default: m.SignInModal })),
);
const ListPetModal = lazy(() =>
  import('./components/ListPetModal').then((m) => ({ default: m.ListPetModal })),
);

const TABS = ['home', 'browse', 'swipe', 'quiz', 'how-it-works', 'applications'];

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');

  // One IntersectionObserver for the whole page, re-attached on tab change so
  // freshly mounted content is picked up.
  useReveal([currentTab]);

  const { currentUser, knownEmails, signIn, signOut } = useAuth();
  const { toast, showToast } = useToast();
  const { pets, shuffle, addListing } = usePetCollection();

  const [likedPetIds, setLikedPetIds] = usePersistentState(KEYS.likes, []);
  const [applications, setApplications] = usePersistentState(KEYS.applications, []);

  // Which modal is open, and what it is operating on.
  const [petForProfile, setPetForProfile] = useState(null);
  const [petForApplication, setPetForApplication] = useState(null);
  const [isMatchesOpen, setIsMatchesOpen] = useState(false);
  const [isListPetOpen, setIsListPetOpen] = useState(false);
  const [signInIntent, setSignInIntent] = useState(null);

  /** Every tab change scrolls back to the top; doing it in one place keeps
   *  a dozen call sites from each remembering to. */
  const goToTab = useCallback((tab) => {
    if (!TABS.includes(tab)) return;
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleFavorite = useCallback(
    (petId, event) => {
      event?.stopPropagation();
      setLikedPetIds((prev) => {
        const pet = pets.find((p) => p.id === petId);
        const label = pet?.name ?? 'that pet';
        if (prev.includes(petId)) {
          showToast(`Removed ${label} from your favourites`);
          return prev.filter((id) => id !== petId);
        }
        showToast(`Saved ${label} to your favourites`);
        return [...prev, petId];
      });
    },
    [pets, setLikedPetIds, showToast],
  );

  const handleSwipeRight = useCallback(
    (pet) => {
      setLikedPetIds((prev) => (prev.includes(pet.id) ? prev : [...prev, pet.id]));
      showToast(`Saved ${pet.name} to your favourites`);
    },
    [setLikedPetIds, showToast],
  );

  const handleSwipeLeft = useCallback(
    (pet) => {
      showToast(`Passed on ${pet.name}`);
    },
    [showToast],
  );

  const removeMatch = useCallback(
    (petId) => {
      setLikedPetIds((prev) => prev.filter((id) => id !== petId));
    },
    [setLikedPetIds],
  );

  /**
   * Applying requires an identity, so a signed-out visitor is routed through
   * sign-in and dropped back into the form they were reaching for.
   */
  const requestApplication = useCallback(
    (pet) => {
      setPetForProfile(null);
      if (currentUser) {
        setPetForApplication(pet);
      } else {
        setSignInIntent({ action: 'apply', pet });
      }
    },
    [currentUser],
  );

  const requestListing = useCallback(() => {
    if (currentUser) {
      setIsListPetOpen(true);
    } else {
      setSignInIntent({ action: 'list' });
    }
  }, [currentUser]);

  const handleAuthenticated = useCallback(
    (user) => {
      signIn(user);
      const intent = signInIntent;
      setSignInIntent(null);
      if (intent?.action === 'apply' && intent.pet) setPetForApplication(intent.pet);
      if (intent?.action === 'list') setIsListPetOpen(true);
    },
    [signIn, signInIntent],
  );

  const handleSignOut = useCallback(() => {
    signOut();
    showToast('Signed out. Your favourites are still here.');
  }, [signOut, showToast]);

  const handleApplicationSubmitted = useCallback(
    (application) => {
      setApplications((prev) => [application, ...prev]);
      showToast(`Application for ${application.petName} is on its way`);
    },
    [setApplications, showToast],
  );

  const handleListingPublished = useCallback(
    (listing) => {
      addListing(listing);
      celebrate();
      showToast(`${listing.name} is now listed for adoption`);
      goToTab('browse');
    },
    [addListing, showToast, goToTab],
  );

  const handleShuffle = useCallback(() => {
    shuffle();
    showToast('Shuffled the pets');
  }, [shuffle, showToast]);

  const selectPetById = useCallback(
    (petId) => {
      const found = pets.find((p) => p.id === petId);
      if (found) setPetForProfile(found);
    },
    [pets],
  );

  const likedPets = useMemo(
    () => pets.filter((pet) => likedPetIds.includes(pet.id)),
    [pets, likedPetIds],
  );

  const availableCount = useMemo(
    () => pets.filter((pet) => pet.status === 'AVAILABLE').length,
    [pets],
  );

  const signInReason =
    signInIntent?.action === 'apply'
      ? `Sign in to apply for ${signInIntent.pet?.name ?? 'this pet'}`
      : signInIntent?.action === 'list'
        ? 'Sign in to list a pet for adoption'
        : undefined;

  return (
    <div className="relative flex min-h-screen flex-col bg-cream">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2.5 focus:rounded-xl focus:bg-paper focus:text-ink focus:font-semibold focus:text-xs focus:uppercase focus:tracking-wider focus:border focus:border-ink/10 focus:shadow-soft"
      >
        Skip to content
      </a>

      {/* Announced politely so a screen reader hears confirmations without
  the focus being yanked away from whatever the user is doing. */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {toast?.text}
      </div>

      {toast && (
        <div
          key={toast.id}
          className="animate-slide-up fixed bottom-6 left-1/2 z-50 flex max-w-[calc(100vw-3rem)] -translate-x-1/2 items-center gap-3 rounded-full bg-ink py-3 pl-4 pr-6 text-sm text-cream shadow-lift sm:left-auto sm:right-8 sm:translate-x-0"
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ochre">
            <PawIcon className="h-3.5 w-3.5 fill-ink" />
          </span>
          <span>{toast.text}</span>
        </div>
      )}

      <Navbar
        currentTab={currentTab}
        onSelectTab={goToTab}
        likedCount={likedPetIds.length}
        applicationCount={applications.length}
        onOpenMatches={() => setIsMatchesOpen(true)}
        onListPet={requestListing}
        onFindYourMatch={() => goToTab('swipe')}
        pets={pets}
        onSelectPet={setPetForProfile}
        currentUser={currentUser}
        onSignIn={() => setSignInIntent({ action: 'signin' })}
        onSignOut={handleSignOut}
      />

      <main
        id="main-content"
        /* The header is fixed, so it takes no space in the flow. The hero
           paints its own top padding to run underneath it; every other view
           needs clearance. */
        className={`relative z-10 flex-1 ${currentTab === 'home' ? '' : 'pt-24'}`}
      >
        {currentTab === 'home' && (
          <HomeView
            pets={pets}
            likedPetIds={likedPetIds}
            availableCount={availableCount}
            onToggleFavorite={toggleFavorite}
            onSelectPet={setPetForProfile}
            onShuffle={handleShuffle}
            onNavigate={goToTab}
            onListPet={requestListing}
          />
        )}

        {currentTab === 'browse' && (
          <PetBrowseGrid
            pets={pets}
            favoriteIds={likedPetIds}
            onToggleFavorite={toggleFavorite}
            onSelectPet={setPetForProfile}
            onOpenMatchFinder={() => goToTab('quiz')}
            onShufflePets={handleShuffle}
          />
        )}

        {currentTab === 'swipe' && (
          <SwipeCardDeck
            pets={pets}
            likedPetIds={likedPetIds}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            onOpenMatches={() => setIsMatchesOpen(true)}
            onSelectPet={setPetForProfile}
            onApplyPet={requestApplication}
          />
        )}

        {currentTab === 'quiz' && (
          <MatchQuizFinder
            pets={pets}
            favoriteIds={likedPetIds}
            onToggleFavorite={toggleFavorite}
            onSelectPet={setPetForProfile}
          />
        )}

        {currentTab === 'how-it-works' && (
          <div className="py-12 bg-cream relative z-10">
            <HowItWorks
              onDiscoverClick={() => goToTab('browse')}
              onMeetClick={() => goToTab('quiz')}
              onConnectClick={() => goToTab('applications')}
            />
            <FaqSection />
          </div>
        )}

        {currentTab === 'applications' && (
          <MyApplicationsView
            applications={applications}
            currentUser={currentUser}
            onSignIn={() => setSignInIntent({ action: 'signin' })}
            onExplorePets={() => goToTab('browse')}
            onSelectPetById={selectPetById}
          />
        )}
      </main>

      <Suspense fallback={null}>
        {petForProfile && (
          <PetProfileModal
            pet={petForProfile}
            isOpen
            isFavorite={likedPetIds.includes(petForProfile.id)}
            onClose={() => setPetForProfile(null)}
            onToggleFavorite={toggleFavorite}
            onApply={requestApplication}
          />
        )}

        {petForApplication && (
          <AdoptionFormModal
            pet={petForApplication}
            isOpen
            onClose={() => setPetForApplication(null)}
            onSubmitSuccess={handleApplicationSubmitted}
            currentUser={currentUser}
            onGoToApplications={() => {
              setPetForApplication(null);
              goToTab('applications');
            }}
          />
        )}

        {isMatchesOpen && (
          <SavedMatchesModal
            isOpen
            onClose={() => setIsMatchesOpen(false)}
            likedPets={likedPets}
            onRemoveMatch={removeMatch}
            onSelectPet={(pet) => {
              setIsMatchesOpen(false);
              setPetForProfile(pet);
            }}
            onApplyPet={(pet) => {
              setIsMatchesOpen(false);
              requestApplication(pet);
            }}
            onStartSwiping={() => {
              setIsMatchesOpen(false);
              goToTab('swipe');
            }}
          />
        )}

        {signInIntent && (
          <SignInModal
            isOpen
            reason={signInReason}
            knownEmails={knownEmails}
            onClose={() => setSignInIntent(null)}
            onAuthenticate={handleAuthenticated}
          />
        )}

        {isListPetOpen && (
          <ListPetModal
            isOpen
            currentUser={currentUser}
            onClose={() => setIsListPetOpen(false)}
            onSubmit={handleListingPublished}
          />
        )}
      </Suspense>

      <Footer onSelectTab={goToTab} onFindYourMatch={() => goToTab('swipe')} />
    </div>
  );
}
