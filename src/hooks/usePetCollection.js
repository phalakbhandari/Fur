import { useCallback, useMemo } from 'react';
import { INITIAL_PETS } from '../data/petsData';
import { usePersistentState } from './usePersistentState';
import { KEYS } from '../lib/storage';
import { shuffleArray } from '../utils/shuffle';

/**
 * The catalogue the rest of the app reads from: the seeded shelter pets plus
 * anything visitors have listed themselves.
 *
 * Only the community listings are persisted. The seed data ships with the
 * bundle, so writing a copy of it into localStorage would waste the quota and
 * — worse — pin visitors to a stale catalogue after a deploy.
 */
export function usePetCollection() {
  const [listings, setListings] = usePersistentState(KEYS.listings, []);
  const [order, setOrder] = usePersistentState('order', null);

  const catalogue = useMemo(() => {
    const all = [...listings, ...INITIAL_PETS];
    if (!order) return all;

    // Re-apply a saved shuffle, appending anything the saved order predates.
    const byId = new Map(all.map((pet) => [pet.id, pet]));
    const ordered = order.map((id) => byId.get(id)).filter(Boolean);
    const seen = new Set(ordered.map((pet) => pet.id));
    return [...ordered, ...all.filter((pet) => !seen.has(pet.id))];
  }, [listings, order]);

  const shuffle = useCallback(() => {
    setOrder(shuffleArray(catalogue).map((pet) => pet.id));
  }, [catalogue, setOrder]);

  const addListing = useCallback(
    (listing) => {
      setListings((prev) => [listing, ...prev]);
    },
    [setListings],
  );

  const removeListing = useCallback(
    (id) => {
      setListings((prev) => prev.filter((pet) => pet.id !== id));
    },
    [setListings],
  );

  return { pets: catalogue, listings, shuffle, addListing, removeListing };
}
