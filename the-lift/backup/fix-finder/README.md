# Fix finder backup (The Lift)

The "What is your door doing?" symptom picker with the service photo card and result panel, replaced on 19 Oct 2026 by a grid of service cards.
The animated door diagram that came before it is in `../door-diagram/`.

To restore: swap `fix-finder.html` back in for section 5 of `index.html`, paste `fix-finder.js` before the "Steps" block in `main.js`, add `fix-finder.css` under `@layer utilities` in `src/input.css`, then `npm run build:lift`.
