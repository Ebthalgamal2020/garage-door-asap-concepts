# Door diagram backup (The Lift)

The animated door diagram from the services / fix finder section, removed on 19 Oct 2026 and replaced by a service photo card.

- `diagram.html`: the markup (SVG door, track, spring, opener, sensors, numbered hotspots, "Open the door" button)
- `diagram.js`: panels riding the track, opener arm, open/close animation, plus the hooks it needs in `selectSymptom()`
- `diagram.css`: part highlighting and hotspot pills

To restore: put the markup back inside `[data-stage]` before the result panel, paste the script after `selectSymptom()` in `main.js` with the hooks listed at its top, add the CSS back under `@layer utilities`, then `npm run build:lift`.
