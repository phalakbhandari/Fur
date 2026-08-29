# FUREVER

A zero-backend, client-side pet adoption platform designed to centralize Bengaluru’s fragmented shelter network. Built to replace chaotic WhatsApp chains and phone tag with a fast, accessible, and structured user experience.

**Tech Stack:** React 19, Vite 6, Tailwind v4, Motion, Playwright, Plain JavaScript.

## Technical & UX Highlights

This project was built with a strict focus on performance, accessibility, and custom tooling, deliberately avoiding bloated dependencies to ensure a seamless interface.

* **Accessible UI Foundations:** Designed and built a lightweight `ModalShell` to handle critical accessibility requirements: focus trapping, focus restoration, Escape-key binding, and scroll locking. Heavy UI components are bundle-split via `React.lazy` for faster initial paints.
* **Custom Asset & Contrast Tooling:** 
  * `check:assets`: A custom script that validates magic bytes, detects text-filter binary corruption, and enforces strict size budgets (successfully reduced asset footprint from 35MB to 154KB for optimized loading).
  * `check:contrast`: An automated build step that parses `src/index.css` hex values to strictly enforce WCAG 2.1 AA color contrast pairings across the interface.
* **Client-Side Cryptography:** Implemented a secure authentication flow running entirely in the browser. Uses PBKDF2-SHA256 (210,000 iterations) with 16-byte per-user salts. Passwords are never stored natively, verification operates in constant time, and error messages are generic to prevent account enumeration.
* **Zero Dependency State Management:** State is managed natively via React props, keeping the bundle lean. Persistence is abstracted through a unified storage interface (`src/lib/storage.js`), isolating `localStorage` quota errors and creating a clean seam for future API integration.

## Core Features

* **Algorithmic Match Quiz:** A 5-point questionnaire that scores and ranks the 50-pet catalogue against user preferences, surfacing near-misses with exact percentage scores.
* **Interactive Swiping:** A gesture-driven card deck with drag and arrow-key support (right to save, left to pass, with undo functionality) for a frictionless browsing experience.
* **Advanced Filtering:** Real-time catalogue filtering by species, age, size, locality, and temperament.
* **End-to-End Workflows:** Users can submit detailed adoption applications (tracked in a personal dashboard) and list new found/rehomed strays directly to the catalogue.

## Local Development

The application requires no server, database, or API keys. Everything runs in the browser, persists to `localStorage`, and builds to static files. Requires Node 20+.

```bash
npm install
npm run dev
```

| Command | What it does |
| :--- | :--- |
| `npm run dev` | Starts local development server on port 3000 |
| `npm run build` | Compiles production-ready static assets into `dist/` |
| `npm test` | Executes 30 Playwright tests (unit and end-to-end) |
| `npm run verify` | Runs linting, formatting, custom scripts (assets/contrast), and builds |

*Note: Running tests for the first time requires the Playwright browser binaries: `npx playwright install chromium`.*

## Architecture & Trade-offs

* **Stateless by Design:** To maintain a zero-cost static deployment, data and accounts are scoped to browser `localStorage`. Authentication acts as a genuine cryptographic credential check, but cannot serve as a cross-device security boundary without a remote server.
* **No TypeScript:** Deliberately opted for plain JavaScript. The data architecture relies on a single predictable `pet` object shape, making TS overhead unnecessary for this specific scope.
* **Self-Hosted Assets:** Fonts (Fraunces and Inter) are self-hosted to eliminate CDN request latency. Catalogue photos rely on Unsplash hotlinking but degrade gracefully to local SVG fallbacks offline.

## Documentation

* [DOCUMENTATION.md](DOCUMENTATION.md) — System architecture, data design, ER diagrams, and technical decision logs.
* [UNDERSTAND.md](UNDERSTAND.md) — A guided codebase walkthrough mapping out classes, loops, storage, and validation.

## License

MIT. See [LICENSE](LICENSE). 
Fonts are under the SIL Open Font License; all icon artwork is original to this project.
