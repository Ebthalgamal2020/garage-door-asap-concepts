# Garage Door ASAP Service — homepage concepts

Homepage redesign concepts for [garagedoorasapservice.com](https://garagedoorasapservice.com/), built for client review.
**Nothing here is deployed, and the live site has not been touched.**

Stack: **HTML5 + Tailwind CSS 3.4 + vanilla JavaScript.** No frameworks. The only dependency is the Tailwind CLI, which is a dev dependency used to compile CSS.

## Preview

```bash
npm install        # once — installs the Tailwind CLI
npm start          # zero-dependency static server → http://localhost:5173
```

| Route | Concept |
|---|---|
| `/` | Concept hub: previews, verified facts and open questions for the client |
| `/a-classic-chic/` | A — Classic |
| `/b-modern-architectural/` | B — Modern Architectural |
| `/c-modern-friendly/` | C — Modern Friendly |
| `/v4-k1-journey/` | Version 4 — Customer Journey |

* Every concept has a small **concept switcher** pill in the bottom-left corner, rendered in Shadow DOM so it can't affect page styles.
* Add **`?present`** to any concept URL to hide the switcher for a clean screen-share. Its ✕ button hides it for the rest of the browser session.
* The compiled `styles.css` files are committed, so the pages also open from any static server without a build step.

## Editing styles

Each concept is fully isolated, with its own Tailwind config, design tokens and compiled stylesheet:

```
a-classic-chic/          index.html · main.js · tailwind.config.js · src/input.css → styles.css
b-modern-architectural/  …same structure
c-modern-friendly/       …same structure
v4-k1-journey/           …same structure
assets/
  img/                   licensed stock photography, two sizes each (see assets/CREDITS.md)
  brand/                 emblem.svg (vector redraw), mascot and financing badge from the live site, brand tokens
  js/quote-form.js       shared form validation and the honest demo hand-off (window.GDAForm)
  switcher.js            presentation switcher
  previews/              hero screenshots used by the hub
index.html               the concept hub (styled by assets/hub.css)
serve.mjs                local preview server
```

```bash
npm run build      # rebuild every stylesheet
npm run watch:b    # rebuild one concept on change (watch:a / watch:b / watch:c)
```

Custom CSS lives only in each `src/input.css`. It covers reusable components defined with `@apply`, plus each concept's signature motion (for example B's sectional-door hero reveal). All animation respects `prefers-reduced-motion`.

## Business content

Business details were verified on 18 October 2026 against the live website and the Google Business Profile:

* **Phone:** (877) 787-7121. This is the number in every tap-to-call link on the live homepage.
* **Email:** info@garagedoorasapservice.com
* **Address:** 17649 US-27, Unit 16, Clermont, FL 34711
* **Google:** 4.7★ from 1,337 reviews. All quoted reviews are real recent Google reviews, quoted as written. Excerpts are marked with "…" and reviewer names are shortened to first name and last initial.
* **From the live site:** family owned, 30 years; 24/7 emergency; same-day service; 6,000+ doors serviced; 90+ cities; licensed, bonded and insured; best price guarantee; satisfaction guarantee with parts warranty; American-made products when available; financing (no payment, no interest for 25 months).

### Open questions for the client
1. **Phone number.** The live About and Contact pages show **(877) 919-7828**, not 787-7121. Confirm which number to publish, and whether either one is a tracking line.
2. **Review figures.** The live site's "5/5 from 600 reviews" and "300+ five-star reviews" don't match Google, so the concepts use the Google figures.
3. **Form delivery.** There is no backend. Forms validate fully, then tell the visitor plainly that nothing was sent, and offer a pre-filled email (`mailto:`) and a call link. At launch, connect the form to the real inbox (the live site uses Contact Form 7).
4. **Photography.** The photos are stock (see `assets/CREDITS.md`). Real team, truck and job photos would strengthen any concept.
5. **Financing terms.** The wording comes from the live homepage badge. Confirm it is current.

## QA performed

The concepts were checked in headless Chrome at 360, 390, 768, 1024, 1280 and 1440 px, covering:
* horizontal overflow
* console errors
* broken images
* in-page anchors
* `tel:` and `mailto:` links
* duplicate IDs
* the mobile menu (open, link, close, tap-through)
* the mobile call bar
* form validation (errors, focus, phone formatting, honest submission state)
* each concept's interactive features: B's anatomy tabs, hotspots and quick-quote strip; C's fix finder, city checker and FAQ
