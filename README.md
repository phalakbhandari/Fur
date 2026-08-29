# FUREVER

A pet adoption site for Bengaluru shelters. Browse animals looking for homes,
get a sense of their temperament before you go and meet them, apply to adopt,
and list a stray you have found yourself.

Adoption here still mostly happens over WhatsApp groups and phone calls. You
hear about a dog through a friend, ring three numbers, and hope someone picks
up. FUREVER is the boring, useful version of that: one place to look, enough
detail to decide, and a form instead of phone tag.

Built by [Sakina](https://github.com/sakinaeae) and
[Phalak](https://github.com/phalakbhandari).

## Running it

```bash
npm install
npm run dev
```

That is the whole setup. No server, no database, no API keys. Everything runs
in the browser and persists to `localStorage`, and it builds to static files.
Needs Node 20 or newer.

| Command          | What it does                              |
| ---------------- | ----------------------------------------- |
| `npm run dev`    | Dev server on port 3000                   |
| `npm run build`  | Production build into `dist/`             |
| `npm test`       | 30 Playwright tests, unit and end-to-end  |
| `npm run verify` | Lint, formatting, both checks and a build |

Running the tests needs the browser once: `npx playwright install chromium`.

## What it does

**Browse** — filter 50 pets by species, age, size, locality and temperament.

**Swipe** — a card deck for when you would rather react than filter. Drag or
use the arrow keys; right saves, left passes, and you can undo.

**Match quiz** — five questions, and every pet is scored and ranked against
your answers. Near misses still appear, lower down, with a percentage.

**Apply to adopt** — a form that asks what a shelter would ask, tracked
afterwards under My Applications.

**List a pet** — found a stray, or rehoming your own? Add a photo and a
description and it joins the catalogue.

## How it is built

React 19 and Vite 6, Tailwind v4, Motion for animation. Plain JavaScript
rather than TypeScript, deliberately: the type surface is one `pet` shape, and
the toolchain would cost more than it caught. Fraunces and Inter are
self-hosted, so no request goes to a font CDN.

State lives in `App.jsx` and passes down as props — no state library, because
at this size it would not earn its keep. Persistence goes through
`src/lib/storage.js` rather than touching `localStorage` directly, which gives
one place to handle a quota error and one seam to replace with a real backend.
Every dialog renders through `ModalShell`, which owns focus trapping, focus
restoration, Escape and scroll locking. Modals are behind `React.lazy`.

Sign-in is a real credential check. `src/lib/password.js` derives a key with
PBKDF2-SHA256 at 210,000 iterations over a per-account 16-byte salt, and only
the salt and the digest are stored — never the password. Verification compares
in constant time. The same error covers a wrong password and an unknown
address, so the form cannot be used to discover which addresses are
registered.

## Two checks worth knowing about

Both were written after a real problem, and both found something immediately.

`npm run check:assets` verifies magic bytes, counts replacement characters and
enforces a size budget. Early on, all 94 images in the project were silently
corrupted — the binaries had gone through a text filter that rewrote every byte
above `0x7F`, so files kept their names, grew by 60%, and read as "large
images" rather than "broken" ones. `.gitattributes` stops it recurring; this
check fails the build if it happens anyway. The same pass found icons shipping
as 2048x2048 PNGs rendered at 40 pixels, twice over: 35 MB down to 154 KB.

`npm run check:contrast` reads the real hex values out of `src/index.css` and
measures every pairing against WCAG 2.1 AA. It found two shipped failures on
the day it was written, including a success green at 3.7:1 on cream. One
pairing is a documented exemption — the cream-on-ochre wordmark at 1.8:1, which
WCAG allows for a logotype — and a test asserts nothing else on the page uses
it.

## Honest limitations

- **Accounts are per-browser.** Passwords are salted and hashed with PBKDF2
  before storage and the wrong one is refused, but the accounts live in
  `localStorage`, so this is a genuine credential check rather than a security
  boundary. It needs a server to be one.
- **Nothing is shared between people.** A listing is visible to you, in that
  browser, until you clear your site data.
- **Most catalogue photos are hotlinked from Unsplash** and will not load
  offline, though they degrade to a paw print rather than a broken icon.
- **The quiz weights are a judgement**, not measured from real adoptions.

## Documentation

- [DOCUMENTATION.md](DOCUMENTATION.md) — how it works, the data design, the ER
  diagram, and the decisions behind it.
- [UNDERSTAND.md](UNDERSTAND.md) — a walkthrough of the code by topic. Which
  file to open for classes, loops, storage, validation and the rest.

## Licence

MIT. See [LICENSE](LICENSE). Fraunces and Inter are under the SIL Open Font
License; icon artwork is original to the project.
