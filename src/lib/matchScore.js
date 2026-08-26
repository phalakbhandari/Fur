/**
 * Scoring for the match quiz.
 *
 * The quiz used to run the same hard filters as the Browse page, which made it
 * a worse copy of a page we already had: answer four questions, get a shorter
 * list, with no sense of which answer mattered. Worse, one mismatched
 * preference removed a pet entirely, so a visitor who said "Small" never saw
 * the medium dog that suited them in every other way.
 *
 * Scoring instead of filtering fixes both. Every pet is scored against every
 * answer, the list is sorted best-first, and a near-miss still appears — lower
 * down, with a percentage that says how close it was.
 */

/**
 * How much each answer is worth.
 *
 * Species is weighted highest because it is the one preference people rarely
 * bend on. Breed and area are worth least: they are typed hints, not choices,
 * and someone who types "Indie" usually means "ideally" rather than "only".
 *
 * The weights are a judgement, not a measurement. They are in one object so
 * they can be argued with and changed in one place.
 */
export const WEIGHTS = {
  species: 40,
  age: 20,
  size: 20,
  breed: 12,
  area: 8,
};

/** The most any pet can score, used to turn a score into a percentage. */
const MAX_SCORE = Object.values(WEIGHTS).reduce((total, weight) => total + weight, 0);

/** A pet below this percentage is not worth showing. */
const THRESHOLD = 45;

const contains = (haystack, needle) =>
  String(haystack ?? '')
    .toLowerCase()
    .includes(needle.trim().toLowerCase());

/**
 * Score one pet against one set of answers.
 *
 * An answer left as "All" or blank is not an opinion, so it awards its full
 * weight to every pet. That keeps the percentage meaningful: a visitor who
 * answers nothing sees 100% for everyone, which is honest, because they have
 * not told us anything to rank on.
 *
 * `reasons` is returned but not yet shown. The first version printed it under
 * each result and it read badly: after filtering for dogs, every card said
 * "is a dog". It is kept because a "why this matched" panel on the pet profile
 * is the obvious next use, and the information is free to collect here.
 *
 * @returns {{ score: number, percent: number, reasons: string[] }}
 */
export function scorePet(pet, answers) {
  const { species = 'All', age = 'All', size = 'All', breed = '', area = '' } = answers;

  let score = 0;
  const reasons = [];

  if (species === 'All') {
    score += WEIGHTS.species;
  } else if (pet.animalType === species) {
    score += WEIGHTS.species;
    reasons.push(`is a ${pet.animalType.toLowerCase()}`);
  }

  if (age === 'All') {
    score += WEIGHTS.age;
  } else if (pet.ageCategory === age) {
    score += WEIGHTS.age;
    reasons.push(`is ${pet.age} old`);
  }

  if (size === 'All') {
    score += WEIGHTS.size;
  } else if (pet.size === size) {
    score += WEIGHTS.size;
    reasons.push(`is ${pet.size.toLowerCase()}-sized`);
  }

  if (breed.trim() === '') {
    score += WEIGHTS.breed;
  } else if (contains(pet.breed, breed)) {
    score += WEIGHTS.breed;
    reasons.push(`is a ${pet.breed}`);
  }

  if (area.trim() === '') {
    score += WEIGHTS.area;
  } else if (contains(pet.location, area)) {
    score += WEIGHTS.area;
    reasons.push(`is in ${pet.location.split(',')[0]}`);
  }

  return {
    score,
    percent: Math.round((score / MAX_SCORE) * 100),
    reasons,
  };
}

/**
 * Score every pet, drop the ones that are too far off, and sort the rest
 * best-first.
 *
 * Ties are broken by name so the order is stable. Without that, two pets on
 * the same score could swap places between renders for no reason the visitor
 * can see.
 */
export function rankPets(pets, answers) {
  return pets
    .map((pet) => ({ pet, ...scorePet(pet, answers) }))
    .filter((entry) => entry.percent >= THRESHOLD)
    .sort((a, b) => b.score - a.score || a.pet.name.localeCompare(b.pet.name));
}

export const MATCH_THRESHOLD = THRESHOLD;
