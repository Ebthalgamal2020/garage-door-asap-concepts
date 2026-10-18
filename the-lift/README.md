# V1 · The Lift — Garage Door ASAP homepage

Status: the first version of this page reached GitHub Pages when PR #1 merged `the-lift` into `main` (18 Oct 2026).
The updates below live on the `three-concepts` branch and are **not published** until the user approves them.

One creative idea runs through the page: **the bend of a garage-door track**. The same curve shapes the section edges
(each one sweeps in as it scrolls into view), the arch-topped photo frame, the hero door rolling up, the "How it works"
line and the door diagram.

Preview: `npm start` from the project root, then open http://localhost:5173/the-lift/
Rebuild CSS: `npx tailwindcss -c the-lift/tailwind.config.js -i the-lift/src/input.css -o the-lift/styles.css --minify`

## Brand system
Colours and font come only from `assets/brand/brand-tokens.js`, extracted from the live site's theme CSS:
red `#DB0000`, deep red `#AD2529` (hover), charcoal `#2F2D2E`, ink `#1C1F2A`, the theme's grey scale, white.
Font: Poppins (declared by the live theme; loaded here from Google Fonts because the live site never loads it).

## Section order (K1 Mobile Tyres journey)
Announcement bar → Header → Hero (split: "Emergency right now?" call vs. "Not urgent?" two-field quick quote) → Trust ribbon → About (before/after slider) → Services: door diagram + fix finder →
How it works → Why choose us (guarantees, financing) → Service areas → Google reviews → Emergency → FAQ → Quote form → Footer,
plus a mobile contact bar that stays visible at all times below 1024 px (scroll padding keeps focused fields clear of it).

## Content sources (verified 18 Oct 2026)
| Item | Source |
|---|---|
| Phone (877) 787-7121, address, email | garagedoorasapservice.com homepage (email decoded from the site's protected link) |
| 30+ years, family owned, same-day, 24/7, licensed/bonded/insured, best price & 100% satisfaction guarantees, lifetime warranty on all parts, American-made, cable replacement | live homepage and /about |
| Financing: no payment, no interest for 25 months | "We Finance" badge on the live site |
| 73 cities | city list in the live site footer (county claims removed until the client confirms them) |
| Google 4.7★, 1,337 reviews, review texts | Google Business Profile, read 18 Oct 2026 |

Open discrepancy for the client: /about and /contact show (877) 919-7828; the homepage and this page use (877) 787-7121.

## Imagery
No placeholder imagery is used. Every image comes from the client:
- Hero photo: the banner image on garagedoorasapservice.com (cropped).
- Service photos and the before/after: the live site's service pages.
- Mr. ASAP: cut-out of the client's mascot artwork.

The service photos are low resolution (259–741 px), so they are shown at modest sizes. Recommended: ask the client for
6–10 high-resolution photos of technicians, branded trucks and finished jobs to replace the hero and finder images.

## Form delivery — not connected yet
There is no approved form service. The form validates, then offers a pre-filled email to info@garagedoorasapservice.com
or a call, and never claims a request was sent (shared `assets/js/quote-form.js`).

To make it send automatically, we need:
1. An approved provider: Formspree or Web3Forms (free tiers; the client confirms the account by email), or the client's
   WordPress Contact Form 7 REST endpoint (needs client approval and CORS), or Netlify Forms if hosted on Netlify.
2. The email address that should receive quote requests.
3. Spam protection (honeypot plus Cloudflare Turnstile or reCAPTCHA) and a short consent/privacy line.

## Tested (Chrome, 1440×900, 820×1180, 390×844, plus reduced motion)
No console or network errors, no horizontal scroll, axe-core: no violations. Fix finder (symptoms, hotspots, door
animation, "Book this fix" pre-fill), before/after slider, area checker, reviews carousel, FAQ, quick quote → full form,
form validation and email/call hand-off, mobile menu (Escape closes), mobile bar hides at the form.
