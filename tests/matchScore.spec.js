import { expect, test } from '@playwright/test';
import { rankPets, scorePet, WEIGHTS } from '../src/lib/matchScore.js';

/**
 * Unit tests for the quiz scoring.
 *
 * Playwright runs these in Node without a browser, because `matchScore.js` is
 * plain JavaScript with no DOM in it. Pure functions like this are the easiest
 * thing in the project to test properly, so they are worth testing properly.
 */

const PETS = [
  {
    id: 'a',
    name: 'Speckles',
    animalType: 'Dog',
    ageCategory: 'Young',
    age: '1.5 years',
    size: 'Medium',
    breed: 'Indian Hound Mix',
    location: 'Shelter Yard, Bengaluru',
  },
  {
    id: 'b',
    name: 'Mochi',
    animalType: 'Cat',
    ageCategory: 'Adult',
    age: '3 years',
    size: 'Small',
    breed: 'Indian Domestic',
    location: 'Indiranagar, Bengaluru',
  },
  {
    id: 'c',
    name: 'Rocky',
    animalType: 'Dog',
    ageCategory: 'Adult',
    age: '3 years',
    size: 'Large',
    breed: 'Brindle Indie Mix',
    location: 'Sanctuary Yard, Bengaluru',
  },
];

test.describe('match scoring', () => {
  test('an unanswered quiz scores every pet full marks', () => {
    // Nothing has been said, so there is nothing to rank on. Pretending
    // otherwise would show a confident ordering built from no information.
    const ranked = rankPets(PETS, {});
    expect(ranked).toHaveLength(PETS.length);
    expect(ranked.every((entry) => entry.percent === 100)).toBe(true);
  });

  test('an exact match scores 100', () => {
    const { percent } = scorePet(PETS[1], { species: 'Cat', age: 'Adult', size: 'Small' });
    expect(percent).toBe(100);
  });

  test('a near miss is kept, ranked below the exact match', () => {
    // This is the whole reason for scoring rather than filtering: asking for a
    // large dog should not hide the medium one.
    const ranked = rankPets(PETS, { species: 'Dog', size: 'Large' });
    const names = ranked.map((entry) => entry.pet.name);

    expect(names).toContain('Speckles');
    expect(names.indexOf('Rocky')).toBeLessThan(names.indexOf('Speckles'));
  });

  test('a pet that matches nothing is dropped', () => {
    const ranked = rankPets(PETS, {
      species: 'Rabbit',
      age: 'Senior',
      size: 'Small',
      breed: 'Lop',
      area: 'Whitefield',
    });
    expect(ranked).toHaveLength(0);
  });

  test('species is weighted above every other single answer', () => {
    // Encodes the judgement call, so changing it is a deliberate act rather
    // than something that happens by accident.
    expect(WEIGHTS.species).toBeGreaterThan(WEIGHTS.age);
    expect(WEIGHTS.species).toBeGreaterThan(WEIGHTS.size);
    expect(WEIGHTS.species).toBeGreaterThan(WEIGHTS.breed + WEIGHTS.area);
  });

  test('ties are broken by name so the order never jumps around', () => {
    const twins = [
      { ...PETS[0], id: 'x', name: 'Zara' },
      { ...PETS[0], id: 'y', name: 'Ash' },
    ];
    expect(rankPets(twins, { species: 'Dog' }).map((e) => e.pet.name)).toEqual(['Ash', 'Zara']);
  });
});
