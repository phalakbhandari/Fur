# UNDERSTAND — what to open and what to say

A cheat sheet for explaining this project out loud.

Each section says **which file to open**, **what to point at**, and **what to
say**. If a line number has moved, search for the code shown instead.

**Before you start:** run `npm run dev` and keep the site open in one window
and the code in another. Answer with the running site first, then show the code
behind it. It reads much better than reading code cold.

---

## Contents

- [The 30-second summary](#the-30-second-summary)
- [Q: Show me a class](#q-show-me-a-class)
- [Q: Show me objects](#q-show-me-objects)
- [Q: Show me functions](#q-show-me-functions)
- [Q: Show me loops](#q-show-me-loops)
- [Q: Show me conditions](#q-show-me-conditions)
- [Q: Show me arrays and collections](#q-show-me-arrays-and-collections)
- [Q: Where is the backend?](#q-where-is-the-backend)
- [Q: Show me how data is stored](#q-show-me-how-data-is-stored)
- [Q: Show me input validation](#q-show-me-input-validation)
- [Q: Show me an algorithm](#q-show-me-an-algorithm)
- [Q: What are components, props and state?](#q-what-are-components-props-and-state)
- [Q: Show me events](#q-show-me-events)
- [Q: Show me file handling](#q-show-me-file-handling)
- [Q: Show me error handling](#q-show-me-error-handling)
- [Q: How do you test it?](#q-how-do-you-test-it)
- [Q: What is the ER diagram?](#q-what-is-the-er-diagram)
- [Harder questions](#harder-questions)
- [If something breaks during the demo](#if-something-breaks-during-the-demo)
- [Who wrote what](#who-wrote-what)

---

## The 30-second summary

> FUREVER is a pet adoption site for Bengaluru shelters. You can browse
> animals, filter them, swipe through them, take a quiz that ranks them against
> what you want, apply to adopt, and list a stray you have found.
>
> It is built with React and Vite. There is no server: everything a visitor
> does is saved in the browser's `localStorage`. All of that goes through one
> file, so a real backend could be added later by changing that file and
> nothing else.

---

## Q: Show me a class

**Open:** `src/components/ErrorBoundary.jsx`, lines 8 to 21.

```js
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled error in the React tree:', error, info.componentStack);
  }

  render() { ... }
}
```

**Say:**

> This is the one class in the project. It uses `extends` to inherit from
> React's `Component`, a `constructor` that calls `super(props)` to run the
> parent's setup first, `this.state` for instance data, an instance method
> `componentDidCatch`, and a static method `getDerivedStateFromError`.
>
> Static means it belongs to the class itself, not to an object made from it.
> React calls it without needing an instance.

**If asked "why is only this a class?"**

> React has two ways to write components: classes and functions. Functions are
> simpler and are what React recommends now, so everything else is a function.
> But catching an error from a child component is the one thing only a class
> can still do. There is no hook for it. So this file has to be a class, and
> that is exactly why it is one.

**What it does for the user:** if any component below it crashes while
rendering, the visitor sees a recovery screen with "Reload the page" and "Reset
saved data" instead of a blank white page.

---

## Q: Show me objects

**Open:** `src/data/petsData.js`, line 1 onwards.

```js
{
  id: 'pet-speckles',
  name: 'Speckles',
  animalType: 'Dog',
  personality: ['Energetic', 'Curious', 'Loyal', 'Social'],   // array in an object
  medicalInfo: {                                              // object in an object
    vaccinated: true,
    spayedNeutered: true,
    microchipped: true,
    healthNotes: 'Fully vaccinated, dewormed, healthy shelter intake.'
  },
  ...
}
```

**Say:**

> Every pet is an object: named values grouped together. There are 50 of them
> in an array.
>
> Two things worth pointing out. `personality` is an **array inside an object**,
> which is how one pet holds many tags without a second table. And
> `medicalInfo` is an **object inside an object**, grouping the medical fields
> so they travel together.

**Other objects to mention:** an application (`AdoptionFormModal.jsx`), a user
(`useAuth.js`), a listing (`ListPetModal.jsx`).

**Accessing them:**

```js
pet.name                        // dot notation
pet.medicalInfo.vaccinated      // nested
pet.personality[0]              // first item of the array inside
pet.medicalInfo?.healthNotes    // safe access if medicalInfo might be missing
```

---

## Q: Show me functions

Show one kind from each of three files.

### 1. A named function — `src/utils/shuffle.js`

```js
export function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
```

> A plain function. Takes an array, returns a new shuffled one. It copies first
> with `[...array]` so the original is not changed, which is called keeping the
> function *pure*.

### 2. An arrow function — `src/App.jsx`

```js
const likedPets = pets.filter((pet) => likedPetIds.includes(pet.id));
```

> A short function written inline and passed to `.filter()`.

### 3. A function that returns a function — `src/components/ListPetModal.jsx`

```js
const update = (field) => (event) => {
  setForm((prev) => ({ ...prev, [field]: event.target.value }));
  setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
};

// used like this on nine different inputs:
onChange={update('name')}
onChange={update('breed')}
```

> `update('name')` runs and returns a *new function* that already knows it is
> for the name field. That is why one handler serves nine inputs instead of
> writing nine handlers.
>
> The `[field]` in square brackets is a computed key: it uses the value of the
> `field` variable as the property name.

---

## Q: Show me loops

**Open:** `src/utils/shuffle.js` for the classic one.

```js
for (let i = result.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [result[i], result[j]] = [result[j], result[i]];   // swap
}
```

> A `for` loop counting **down**. This is the Fisher-Yates shuffle: walk
> backwards, and swap each item with a random one at or before it. Every
> possible order is equally likely, which is not true if you just sort by a
> random number.
>
> The swap line uses destructuring: it assigns both sides at once, so no
> temporary variable is needed.

**Then show the array loops:**

| Loop | Where | What it does |
| --- | --- | --- |
| `.map()` | `HomeView.jsx` | Turns each pet into a `<PetCard>` |
| `.filter()` | `PetBrowseGrid.jsx` | Keeps only pets matching the filters |
| `.forEach()` | `lib/storage.js` | Deletes each stale key, returns nothing |
| `.reduce()` | `lib/matchScore.js` | Adds all the weights into one total |
| `.some()` | `useAuth.js` | True if any account already has that email |
| `.sort()` | `lib/matchScore.js` | Orders pets best match first |
| `for...of` | `scripts/check-contrast.mjs` | Walks the list of colour pairs |

**If asked which to use when:**

> `for` when I need the index or want to count in an unusual way. `.map()` when
> I want a new list the same length. `.filter()` when I want a shorter list.
> `.reduce()` when I want one value out of many. They all loop; the name says
> what the loop is *for*, which makes the code easier to read.

---

## Q: Show me conditions

**Open:** `src/App.jsx`, the `requestApplication` function.

```js
const requestApplication = useCallback((pet) => {
  setPetForProfile(null);
  if (currentUser) {
    setPetForApplication(pet);                 // signed in: open the form
  } else {
    setSignInIntent({ action: 'apply', pet }); // signed out: remember, then sign in
  }
}, [currentUser]);
```

Then the other three kinds:

```js
// ternary — a short if/else that produces a value
{isSignUp ? 'Create an account' : 'Welcome back'}

// guard clause — leave early instead of wrapping everything in an if
if (!isOpen) return null;

// optional chaining and nullish default
const notes = pet.medicalInfo?.healthNotes ?? 'Not recorded';
```

> The `?.` means "if `medicalInfo` is missing, stop and give `undefined` instead
> of crashing". The `??` means "if the left side is null or undefined, use the
> right side".

---

## Q: Show me arrays and collections

**Open:** `src/hooks/usePetCollection.js`

```js
const all = [...listings, ...INITIAL_PETS];             // spread: join arrays
const byId = new Map(all.map((pet) => [pet.id, pet]));  // Map: look up by key
const seen = new Set(ordered.map((pet) => pet.id));     // Set: no duplicates
```

**Say:**

> Three collection types in three lines.
>
> The spread `...` unpacks both arrays into one new array.
>
> A `Map` stores key-value pairs and finds a value instantly. I use it to
> re-apply a saved shuffle order: without it, finding each pet by ID would mean
> scanning the whole array 50 times.
>
> A `Set` only ever holds one of each value, so `seen.has(id)` is a fast way to
> ask "have I already added this pet?"

---

## Q: Where is the backend?

Answer this one carefully and honestly.

**Say:**

> There is no backend, and that is a deliberate choice, not something we ran out
> of time for.
>
> The site is a frontend that runs entirely in the browser. Everything a visitor
> does is saved in `localStorage`, which is a small store the browser keeps for
> each website. It builds to plain static files and can be hosted anywhere.

**Then show the seam.** Open `src/lib/storage.js`.

> This is the only file in the project that touches `localStorage`. No component
> ever calls it directly. That means adding a real backend is changing this one
> file to make network requests instead, and making the hooks asynchronous.
> Nothing in the twenty-odd components would change.

**If asked "so what would a real backend look like?"**

> Postgres for the data, and a small Express or FastAPI service in front of it
> with endpoints like `GET /pets`, `POST /applications`, `POST /listings`. The
> ER diagram in `DOCUMENTATION.md` section 4 is already drawn as tables, so it
> maps straight across.

**If asked "is the login real?"**

> No, and the site says so on the sign-in box. It stores a name and an email so
> applications and listings can be labelled, and so there is something to check
> before you apply. **No password is ever stored.** It is checked for length and
> thrown away. Storing a fake password, even locally, would teach a bad habit
> and become a real risk the moment somebody reused a real password.
>
> All of that lives in `src/hooks/useAuth.js`, which is the only file that would
> change if we added real authentication.

---

## Q: Show me how data is stored

**Open:** `src/lib/storage.js`

**Point at the keys:**

```js
export const SCHEMA_VERSION = 5;

export const KEYS = {
  user: 'user',
  likes: 'likes',
  applications: 'applications',
  listings: 'listings',
};
```

> Every key is namespaced and versioned, so they look like `furever:v5:likes` in
> the browser. If the shape of the saved data ever changes, we raise the
> version, all the old keys stop being read, and `pruneOldVersions()` deletes
> them on the next load.

**Point at `read` and `write`:**

```js
export function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(fullKey(key));
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}
```

> `JSON.stringify` turns an object into text on the way in, `JSON.parse` turns
> it back on the way out, because `localStorage` can only hold strings.
>
> Both are wrapped in `try/catch`. Safari in private mode throws an error when
> you write, and a half-written value from an older version can break
> `JSON.parse`. In both cases the app carries on with no saved data instead of
> showing a blank page.

**Then the hook.** `src/hooks/usePersistentState.js`:

```js
export function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => read(key, initialValue));
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;                    // don't immediately re-write what we just read
    }
    write(key, value);
  }, [key, value]);

  return [value, setValue];
}
```

> It works exactly like `useState`, but the value survives a refresh. Used in
> `App.jsx` for favourites and applications.

**Demo it live:** save a pet as a favourite, press F5, show it is still there.
Then open DevTools, Application, Local Storage, and show the actual key.

---

## Q: Show me input validation

**Open:** `src/components/ListPetModal.jsx`, the `validate` function near the top.

```js
function validate(form, photo) {
  const errors = {};

  if (!form.name.trim()) errors.name = 'Give the pet a name.';
  else if (form.name.trim().length > 30) errors.name = 'Keep the name under 30 characters.';

  if (!form.contactEmail.trim()) errors.contactEmail = 'Adopters need a way to reach you.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail.trim())) {
    errors.contactEmail = 'That does not look like a valid email address.';
  }

  if (!photo) errors.photo = 'A photo does most of the work. Please add one.';

  return errors;
}
```

**Say:**

> It collects **every** problem into one object and returns them together.
> Showing one error at a time turns a form into a guessing game.
>
> `.trim()` removes spaces at the ends, so a name of just spaces counts as
> empty.
>
> That pattern in the slashes is a **regular expression**. It checks the shape
> of an email: something, an `@`, something, a dot, something, with no spaces.
> Nothing stricter, because stricter patterns reject addresses that really work,
> and the only real proof an email exists is sending mail to it.

**Then show it announced properly:**

```jsx
<input
  id="list-pet-name"
  aria-invalid={errors.name ? 'true' : undefined}
  aria-describedby={errors.name ? 'list-pet-name-error' : undefined}
/>
{errors.name && <p id="list-pet-name-error" role="alert">{errors.name}</p>}
```

> `aria-describedby` links the message to the field, so a screen reader reads
> "Name, invalid, give the pet a name" instead of leaving the error floating as
> unrelated text.

**Demo it live:** open List a pet, press Publish with everything empty, show the
seven messages appear at once and that nothing typed is lost.

---

## Q: Show me an algorithm

This is the best question to get. **Open:** `src/lib/matchScore.js`.

```js
export const WEIGHTS = { species: 40, age: 20, size: 20, breed: 12, area: 8 };

export function scorePet(pet, answers) {
  let score = 0;
  if (answers.species === 'All') score += WEIGHTS.species;
  else if (pet.animalType === answers.species) score += WEIGHTS.species;
  // ...same shape for age, size, breed, area
  return { score, percent: Math.round((score / MAX_SCORE) * 100), reasons };
}

export function rankPets(pets, answers) {
  return pets
    .map((pet) => ({ pet, ...scorePet(pet, answers) }))
    .filter((entry) => entry.percent >= THRESHOLD)
    .sort((a, b) => b.score - a.score || a.pet.name.localeCompare(b.pet.name));
}
```

**Say:**

> Every pet is scored out of 100 against the five answers, then the list is
> sorted best-first.
>
> The first version of this quiz just filtered, the same as the Browse page.
> That was worse for two reasons: it was a duplicate of a page we already had,
> and one wrong answer removed a pet completely. Someone who picked "Small"
> would never see the medium dog that suited them in every other way.
>
> Scoring fixes both. Near misses still appear, lower down, with a percentage
> showing how close they were.

**Three details to volunteer** — this is what turns a good answer into a very
good one:

> Species is weighted highest at 40 because it is the preference people rarely
> bend on. Breed and area are worth least because they are typed hints, not
> choices.
>
> An answer left as "All" gives its full weight to every pet, because it is not
> an opinion. So answering nothing shows everyone at 100%, which is honest.
>
> Ties break on name with `localeCompare`, so two pets on the same score never
> swap places between renders for no visible reason.

**Demo it live:** go to the Match quiz, choose Dogs and Large, scroll to the
results. Point at the "Full match" ones at the top and the "80% match" ones
below.

---

## Q: What are components, props and state?

**Open:** `src/components/PetCard.jsx`

```jsx
export const PetCard = ({ pet, isFavorite, onToggleFavorite, onSelectPet }) => (
  <article>
    <h3>{pet.name}</h3>
    ...
  </article>
);
```

**Say:**

> A component is a function that takes data in and returns what to draw. The
> things in the curly brackets are **props**: data passed in from the parent.
> `PetCard` is used on the home page, the browse page and the quiz results, and
> it does not care which one it is in.
>
> **State** is data a component remembers between renders. Open `App.jsx` and
> look at the top: `currentTab` decides which view is showing, `likedPetIds` is
> the list of saved pets.
>
> Data flows **down** as props, and events flow **up** as functions. `PetCard`
> does not know how to save a favourite, it just calls `onToggleFavorite`, which
> `App.jsx` provided.

**If asked why no Redux:**

> The deepest chain here is two levels. You can follow any value from where it
> is created to where it is used without opening a third file. A state library
> would remove a few lines and add indirection to every one of them. If we added
> shelter accounts, that trade would flip.

---

## Q: Show me events

**Open:** `src/components/SwipeCardDeck.jsx`, the keyboard effect.

```js
useEffect(() => {
  const handleKeyDown = (event) => {
    if (document.querySelector('[role="dialog"]')) return;   // a dialog owns the keyboard
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (event.key === 'ArrowLeft') { event.preventDefault(); swipeRef.current('left'); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); swipeRef.current('right'); }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);   // cleanup
}, []);
```

**Say:**

> `addEventListener` starts listening, and the function returned from
> `useEffect` removes it when the component goes away. Forgetting that is a
> memory leak: the listener keeps running for a component that no longer exists.
>
> The two guards at the top fixed a real bug. The listener was global, so
> pressing an arrow key while reading a pet's profile silently swiped the card
> behind the dialog.

**Simpler examples if wanted:** `onClick`, `onChange`, `onSubmit` all over the
components, and a `scroll` listener in `Navbar.jsx`.

**Demo it live:** go to Swipe, press the left and right arrow keys.

---

## Q: Show me file handling

**Open:** `src/lib/image.js`

```js
export function processPetPhoto(file) {
  return new Promise((resolve, reject) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      reject(new Error('That file type is not supported...'));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      reject(new Error('That image is larger than 8 MB...'));
      return;
    }

    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.src = URL.createObjectURL(file);
  });
}
```

**Say:**

> When someone uploads a pet photo, this checks the type and size, then draws it
> onto a `<canvas>` at a smaller size and re-encodes it as JPEG.
>
> The reason is a real constraint. A photo from a phone is 3 to 6 MB, and the
> whole `localStorage` quota is about 5 MB. One photo would fill it. After this
> it is roughly 200 KB, so there is room for many listings.
>
> It returns a **Promise** because loading an image is asynchronous: the code
> has to wait for `img.onload` before it can measure it.

---

## Q: Show me error handling

Three levels, worth showing in this order.

**1. Expected failure — `src/lib/storage.js`**

```js
try {
  window.localStorage.setItem(fullKey(key), JSON.stringify(value));
  return true;
} catch {
  return false;   // quota full, or storage disabled
}
```

**2. Missing resource — `src/components/PetImage.jsx`**

```jsx
const [failed, setFailed] = useState(false);
if (!src || failed) return <PawPlaceholder />;
return <img src={src} onError={() => setFailed(true)} ... />;
```

> Most catalogue photos come from Unsplash. If one does not load, the card shows
> a paw print instead of a broken image icon.

**3. Unexpected crash — `src/components/ErrorBoundary.jsx`**

> The class from the first question. It is the last line of defence.

---

## Q: How do you test it?

**Run it:** `npm test` — 28 tests pass.

**Say:**

> Two kinds. `tests/matchScore.spec.js` is **unit tests** for the quiz scoring:
> plain functions with no browser, so they can be tested directly. It checks
> that an unanswered quiz gives everyone 100%, that near misses are kept but
> ranked lower, and that ties break predictably.
>
> `tests/smoke.spec.js` is **end-to-end tests**. It opens a real browser, clicks
> through the site on a desktop and a phone screen size, and checks the journeys
> work: a favourite survives a refresh, the sign-in gate holds, a dialog traps
> focus and closes on Escape, an empty form is refused.

**The one to be proud of:**

> One test fails if any image on the home page finishes loading with zero width.
> That is what a corrupted file looks like from the browser's side. We added it
> because every image in this project was silently corrupted at one point, and
> nobody noticed until the pages were opened by hand. That test would have
> caught it the same day.

**Also mention:** `npm run verify` runs the linter, the formatter, an image
integrity check, a colour contrast check and a build. All of it runs
automatically on GitHub with every push.

---

## Q: What is the ER diagram?

**Open:** `DOCUMENTATION.md`, section 4. It renders as a diagram on GitHub.

**Say:**

> There is no database, so this shows how the data *would* be laid out as
> tables. Seven boxes: USER, PET, PET_MEDICAL, PET_PERSONALITY, PET_GOOD_WITH,
> APPLICATION, and a join table FAVOURITE.

**The two things worth explaining:**

> **FAVOURITE has its own box** because it is a many-to-many relationship. One
> person saves many pets, and one pet is saved by many people. That cannot be
> stored on either side, so a database needs a join table holding two foreign
> keys. In our code it is an array of pet IDs, which is the same relationship
> with only one user in it.
>
> **PET_PERSONALITY is separate** because a database column cannot hold a list.
> In JavaScript it can, so in the code it is
> `personality: ['Energetic', 'Curious']`. The diagram shows the version a
> database would need.

---

## Harder questions

**"Why React and not plain HTML and JavaScript?"**

> The same pet card appears on three pages. In plain JavaScript I would either
> copy the HTML three times or write code to build it by hand and keep it in
> sync when the data changes. React lets me write it once as a function and
> re-run it whenever the data changes.

**"Why no TypeScript?"**

> The type surface here is basically one shape, the pet. TypeScript would catch
> a typo in a field name and not much else, in exchange for a build step and a
> type layer to keep in sync. With a real backend and real API responses that
> trade would be worth it.

**"What is the hardest bug you fixed?"**

> Early on, every image in the project was corrupted. 94 of 98 files. They had
> been copied as text at some point, which replaced every byte above 0x7F with
> the Unicode replacement character. The files kept their names and got about
> 60% bigger, so it looked like a compression problem for a while.
>
> An earlier fix patched only the first byte. That restored the PNG header, so
> the `file` command reported a valid PNG and the images stayed broken. The
> lesson was that a header check is not an integrity check.
>
> The real fix had two parts: restore the files, and stop it happening again.
> `.gitattributes` marks binary formats so no checkout can convert them, and
> `npm run check:assets` fails the build if replacement characters appear.

**"What would you do next?"**

> A real backend, so listings are shared between people instead of living in one
> browser. Then shelter accounts, so a shelter manages its own listings and sees
> applications. The storage layer is already behind one file, so the first step
> is contained.

**"What is the weakest part?"**

> Most catalogue photos are linked from Unsplash rather than hosted by us, so
> they do not load offline. There is a fallback, but the real fix is hosting
> them. And the quiz weights are our judgement, not measured from real
> adoptions.

---

## If something breaks during the demo

**The site will not start.** Delete `node_modules`, run `npm install` again.
Node must be version 20 or higher — check with `node -v`.

**PowerShell says scripts are disabled.** Use `npm.cmd run dev` instead.

**Port 3000 is busy.** `npm run dev -- --port 3001`.

**Images do not load.** The pet photos in `public/pets` are local and always
work. The rest come from Unsplash and need internet. If the college wifi is
blocking them, say so and point at the paw-print fallback, which is deliberate.

**Favourites behaving strangely.** Open DevTools, Application, Local Storage,
delete the `furever:v5:*` keys, then refresh. That resets the app.

---

## Who wrote what

**Sakina** — the design and the initial build. The colour system and typography
in `src/index.css`, the layout, the navigation, the hero, the pet card, and the
seed data.

**Phalak** — most of the features and everything underneath them. Browse and
filtering, the swipe deck, the match quiz and its scoring, the adoption form,
applications tracking, sign-in, list-a-pet, the storage layer, the image
pipeline, accessibility fixes, the tests and the CI setup.

Run `git log --oneline` to show the history. `git shortlog -sn` shows the commit
counts per person.
