# V2 · Bold brand red — Garage Door ASAP homepage (local preview)

Status: built locally on 18 Oct 2026 after the user chose "Bold brand red". Not published. The previous V2 (soft premium) is on GitHub Pages and in git (`origin/main` ee4f709).

Preview: `npm start` from the project root, then open http://localhost:5173/v2-the-signature/ (add `?present` to hide the concept switcher).
Rebuild CSS: `npm run build:v2`.

## Idea
Energetic and brand-forward. Big red surfaces with a soft deep-red stripe pattern, Mr. ASAP as the star mascot, truck-style
stickers, punchy Poppins 800 headlines, friendly rounded corners and pill buttons. Contrast rules: only full white text on red
(small text sits on deep red #AD2529), never red text on red or charcoal.

## Sections (K1 order) and what each one does
1. Top bar (24/7 + phone) and a white sticky header with a big red call button; mobile menu (Escape closes).
2. Red hero: "Garage door trouble? Call ASAP!", white call pill (emergencies) and outline quote pill (not urgent), four
   "What's wrong?" chips that prefill the quote form, Mr. ASAP with stickers and a genuine Google review card.
3. Trust strip: Google 4.7 · 1,337, licensed/bonded/insured, lifetime parts warranty, financing badge, American made.
4. Services as "Problem → fix": eight selectable problem rows (radiogroup, arrow keys) and a red-framed "The fix" panel with
   the likely service, a real photo (never enlarged; bold icon block for cable and reverse), what we do, an urgency sticker,
   Mr. ASAP's safety tip, and Book this fix (prefills problem, plus emergency timing for urgent ones) or Call.
5. About: the real crew-and-trucks photo, count-up stats (30+, 73, 4.7), and a before/after drag slider of a real job.
6. Red emergency band: huge phone pill, four emergency situations, Mr. ASAP with four safety tips (manual prev/next).
7. How it works: four steps joined by a dotted red line that draws once.
8. Spring life (charcoal): the verified cycle figures and an estimator (uses per day → years for 10,000 / 10–20k / 50,000 cycles).
9. Why choose us: six verified promises and a red financing card.
10. Reviews: Google summary and the eight genuine reviews in a swipeable carousel (no autoplay).
11. 29-point tune-up: Inspect (17) / Maintain (12) tabs from the live General Maintenance page, and Book a tune-up.
12. Areas: city search with keyboard suggestions (73 cities, no counties) and "Show all 73".
13. FAQ. 14. Two-step quote (problem + timing, then details) with the shared honest email/call hand-off. 15. Footer.
Plus an always-visible mobile call bar.

## Sources
All facts, reviews, cities and photos are the verified ones used across V1–V3 (see `assets/CREDITS.md`). Spring cycle figures
and the tune-up list are quoted from the live spring-replacement and general-maintenance pages.

## Tests
`qa.mjs` (shared, 57 checks) and `v2red/qa-red.mjs` (62 interaction checks) at 1440, 1024, 820, 390 and 360, plus reduced
motion and no-JS: all pass.
