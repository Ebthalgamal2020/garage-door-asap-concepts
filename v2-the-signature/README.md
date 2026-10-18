# V2 · The Signature — Garage Door ASAP homepage (round 4, local preview)

A soft, premium and interactive business site. Every section floats as a large rounded "sheet" on a soft grey page.
The dark sheets carry a quiet red glow, glass panels sit over the client's own photos, and there are no sharp corners.
This build replaces the earlier sharp, editorial version, which the user rejected. That version is preserved in git commit 7918567.

Preview: `npm start` from the project root, then open http://localhost:5173/v2-the-signature/
Rebuild CSS: `npm run build:v2`

## Design system
- **Radius scale:** pill / 28 px (`rounded-card`) / 40 px (`rounded-sheet`).
- **Shadow scale:** `soft` / `medium` / `lifted` (plus a red glow on the main CTA).
- **Icons:** 1.75 stroke.
- **Colours and font:** only from `assets/brand/brand-tokens.js`: red #DB0000, deep red #AD2529, charcoal #2F2D2E, ink #1C1F2A, greys, white, and Poppins 300–600. There is no red text on dark backgrounds.
- **Motion (restrained):**
  - One entrance per section: a fade-up or a rounded mask reveal.
  - Gentle hover lifts, and crossfades in the interactive parts.
  - A magnetic effect on the main hero CTA only.
  - A slow glow is the only continuous motion.
  - Everything is off under `prefers-reduced-motion`.

## Sections (K1 order) and what they do
1. **Announcement pill and floating glass header:** call number and Free quote, with a rounded mobile menu sheet.
2. **Hero, "How can we help today?":** three intents, each with its own headline, photo and actions, and a call action in every one:
   - "It's an emergency": call first.
   - "Something's broken": quote first.
   - "Tune-up or upgrade": book a tune-up.

   A sliding indicator moves between the intents. Glass chips on the photo show the Google rating and the crew photo.
3. **Trust ribbon:** Google 4.7, 24/7, 30+ years family owned, licensed, the We Finance badge.
4. **About and real work:** the crew and trucks photo, plus a drag-to-compare before/after of a real job and a genuine review.
5. **Services as an accordion gallery:**
   - Desktop: seven rounded panels; hover, click, focus or the arrow keys expand one.
   - Phones: a smooth accordion.
   - Every panel has "Book this repair" (fills in the form) and Call.
6. **Spring life estimator:** a slider for uses per day gives years = cycles ÷ (uses × 365) for 10,000, 10,000–20,000 and up to 50,000 cycles. The figures are quoted from the live spring page.
7. **How it works:** four steps on a line that fills as you scroll.
8. **29-point tune-up:**
   - A counting ring and two tabs: Inspect (17) and Maintain (12).
   - The checklist items are exactly as on the live maintenance page.
   - "Show all" expands the list.
9. **Why us and financing:** six verified promises, plus a red financing card.
10. **Reviews:**
    - The Google 4.7 ring.
    - Topic filters: All, Springs, Openers, Service & staff.
    - A manual carousel with previous/next and swipe (no autoplay), using the 8 genuine reviews verbatim.
11. **Emergency:** a red sheet with Mr. ASAP, a large call button and two safety tips.
12. **Areas:** a city search with instant suggestions (a keyboard-accessible combobox), 12 popular cities, and "Show all 73". No counties.
13. **FAQ:** an accordion that opens smoothly in Chrome 131+.
14. **Quote:**
    - Three steps (Problem → Timing → Your details) with a live "Your request" summary.
    - Emergency timing shows a call panel.
    - Uses the shared `GDAForm` honest email/call hand-off; nothing is ever claimed as sent.
    - A "What happens next" strip sits below the form.
15. **Footer**, plus a glass mobile call bar that is always visible and respects the safe-area inset.

## Photos (all the client's own; none shown larger than the file)
- **From the live site:** `brand-home-banner` (homepage hero), `brand-crew-trucks` (crew photo), `brand-job-spring-a/b` (spring-page job photos), `brand-shifted-door` and the before/after.
- **Service-page images:** `brand-springs-pair`, `brand-svc-*`.

Sources are in `assets/CREDITS.md`.

## Tested (headless Chrome)
- **V2 suite: 62/62.** At 1440, 1024, 820, 390 and 360 px plus reduced motion:
  - call and quote are visible in the first screen
  - no image is shown larger than its file, including cover crops in every hero intent and service panel
  - every interaction listed above, the estimator maths, and the checklist counts
  - the quote steps and the honest hand-off
- **Shared harness: 57/57** (`node qa.mjs v2-the-signature`):
  - zero axe accessibility violations at every size
  - no console errors or failed requests, no sideways scrolling, no duplicate ids
  - every phone link is `tel:+18777877121`; no banned claims
  - the mobile menu and call bar work
- **Layout shift (CLS):** about 0.008 at desktop and phone sizes.
