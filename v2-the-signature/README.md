# V2 — The Signature (local preview, not published)

A premium editorial **business website**, styled like a high-end contractor or architect firm's site rather than a magazine.
Its signature is **sharp corners and fine red rules**. A 2 px red rule marks the seam between the charcoal hero panel and the
photo, a short red rule sits under every heading, a 1 px red offset frame sits behind the About photo, and thin red dividers
separate the trust badges. There are no pills, track curves (V1) or rounded cards (V3).

Preview: `npm start` from the project root, then open http://localhost:5173/v2-the-signature/
Rebuild CSS: `npm run build:v2`

## Brand
Colours and font come only from `assets/brand/brand-tokens.js`: red `#DB0000`, deep red `#AD2529`, charcoal `#2F2D2E`,
ink `#1C1F2A`, the theme's greys, and white. The typeface is Poppins; headlines mix 300 light and 800 extra-bold.
Red is never used as text on charcoal: on dark backgrounds, red appears only as a rule or a filled block behind white.

## Sections (K1 order)
1. Charcoal top bar (24/7 + phone) and a sticky header: mascot logo, nav, the phone number as text, and a red "Free quote" button.
2. Hero: a charcoal panel (45%) with "Garage doors, fixed properly. / And fixed ASAP.", red Call and white-outline Quote
   buttons, and the Google rating line. The client's banner photo (55%) bleeds to the right edge, with a 2 px red seam and
   an emergency/not-urgent card overlapping the photo. On phones the photo sits on top and both actions are in the first screen.
3. Trust strip: Google 4.7 · We Finance badge · licensed, bonded & insured · 30+ years · lifetime parts warranty.
4. About: a real shifted-door job photo in a red offset frame, the copy, a genuine review sentence, and Mr. ASAP.
5. Services: a featured "Spring replacement" block (springs photo plus the broken-spring photo) and six service blocks,
   each with a real photo (or a charcoal icon tile for cables), a symptom, "Book this repair" (pre-fills the form) and "Call".
6. Red emergency band: the phone number in huge type, four situations, a safety note, and Mr. ASAP breaking the top edge.
7. How it works: four steps joined by one thin red rule.
8. Why choose us (charcoal): the parts photo strip, financing, and six promises with red icon blocks.
9. Reviews: the 4.7 / 1,337 summary, one featured review with previous/next, three more reviews, and the before/after photo.
10. Service areas: city checker, 12 main cities, and "Show all 73 cities". No county claims.
11. FAQ accordion.
12. Quote (charcoal): contact details, a big call button, and the approved form on a white card.
13. Footer, plus an always-visible mobile call bar (the body reserves room for it, so it never covers content).

## Content sources (verified 18 Oct 2026)
- Phone, address, email, services, guarantees, financing and the 73 cities: garagedoorasapservice.com.
- Google 4.7★ from 1,337 reviews, and the eight review texts: the Google Business Profile, quoted as written, with names
  shortened and long reviews excerpted (…).
- Photos and Mr. ASAP: the client's own assets in `assets/img/brand-*` and `assets/brand/`. No stock photography is used.
  No image is ever shown larger than its file, including object-cover crops, which is checked by the test suite.

## Form
Uses the shared `assets/js/quote-form.js` with the approved fields: name, phone, city, problem, optional details, and
preferred timing. No form service is connected, so a valid request offers a pre-filled email or a call and never claims
to have been sent.

## Tested
Headless Chrome via puppeteer-core plus axe-core, at 1440×900, 820×1180, 390×844, 360×740, and 390 with reduced motion.
The suite reports 82/82 checks passing. It covers:
- no console errors, failed requests or broken images, and no horizontal overflow;
- no upscaled images (layout size against the real file pixels, including object-cover);
- every `tel:` link is `+18777877121`, in-page anchors resolve, and no banned claims appear;
- both hero actions are above the fold;
- the mobile menu (open, Escape, link), and the mobile bar staying visible without covering the submit button or footer;
- form errors and focus, the honest hand-off and mailto contents, and "Book this repair" pre-fill;
- featured-review cycling, the city checker and the 73-city expand;
- touch targets of at least 44 px, axe with 0 violations, and reduced motion (static reveals, no parallax).
