# V3 — The Garage Door Lab (local preview, not published)

A friendly, modern home-services homepage with a built-in **"Find my fix"** tool. The diagnosis is a product-quality
widget inside a real website, not a separate diagram. Rounded cards (12–16 px), soft shadows, line icons and red
buttons with a 10 px radius. That keeps it distinct from V1 The Lift (pill buttons, track curves, arch photo) and
V2 The Signature (sharp editorial layout, red rules).

Preview: `npm start` from the project root, then open http://localhost:5173/v3-garage-door-lab/
Rebuild CSS: `npm run build:v3`

## Find my fix (hero widget)
1. **What's your door doing?** Eight symptoms as large tappable rows with icons.
2. **Likely fix.** A coloured front-view door illustration marks the affected part in red and shows the fault: the
   spring gap, the door tilting, a slack cable, a blinking sensor beam, jittering rollers or the opener light. Below
   it are the likely repair, a Mr. ASAP safety tip, then two safety questions, one at a time.
3. **Call now**: any "yes" leads to a big tel button and a safety card. **Book a visit**: "no, no" pre-fills the
   form's problem and timing and scrolls to it.

It has Back and Start over, a 3-dot progress indicator, an aria-live status and focus that moves to each new step.
"Check this" on the service cards and "Check a symptom" in Know your door open the widget preselected. The same
illustration powers **Know your door**: part buttons, plus hotspots on tablet and desktop, and a detail panel.

## Common problems (asymmetric, urgent first)
The cards are ordered by urgency and customer value under two labels:
- **"Urgent: call now"** comes first. A large broken-spring feature tile (real photo, "Often urgent", Call now / Check
  this / Book) sits beside stacked "off track" (photo) and "cable" (charcoal, text-led) tiles. A full-width red-tint
  "won't open" banner follows.
- **"Routine repairs & upkeep"** comes second: opener, sensors, rollers and tune-up, in mixed widths with varied photo
  placement.

Tablet uses a 2-column asymmetric layout. Phones use a single column with the feature tile first. Every tile has
"Check this" (opens Find my fix preselected) and "Book".

## Know your door
A refined front-view illustration sits on a soft stage: gradients, depth shadow, wall and trim, an opener on the
ceiling, springs with drums and winding cones, tracks, rollers, cables and sensors.
- Six numbered markers sit on the parts. They pulse gently and show a leader-line label on hover and focus.
- Selecting a part turns it red, dims the rest and cross-fades the detail panel. The panel shows the part number, an
  urgency chip, what the part does, a real photo where one exists, warning signs with icons, what we do, and Check
  this / Book / Call.
- The minimal numbered selector is an ARIA tablist: arrow keys plus Home and End move between parts, and prev/next
  buttons cycle them.
- On desktop the illustration has a subtle pointer parallax. All motion is off under reduced motion.

## Section order (K1 journey)
Top bar + header → Hero with Find my fix → Trust bar → Common problems (8 photo cards) → Know your door → About
(real shifted-door job + before/after) → How it works → Safety + client video → Why choose us + financing →
Google reviews → Emergency band → Service areas + FAQ → Quote form + contact → Footer, plus the mobile call bar.

## Content and images
Facts, reviews and the 73 cities are the same verified set as V1 (see `the-lift/README.md`). There are **no county
claims**, no "90+ cities" and no "6,000+". All photos are the client's own (`assets/img/brand-*`, see
`assets/CREDITS.md`), and none is displayed larger than its file. `brand-springs-stock.jpg` is deliberately not used.
The YouTube video ("What should you do with a crooked garage door", `MboKo4BJUuU`) loads only after the visitor
presses play, through `youtube-nocookie.com`.

The form uses the approved fields (name, phone, city, problem, optional details, preferred timing) and the shared
`assets/js/quote-form.js`. It hands off honestly to email or a call and never says the request was sent.

## Tested (headless Chrome, 1440, 1280, 1024, 820, 390, 360 and 1920 px, plus reduced motion)
The following checks pass:
- axe-core reports 0 violations.
- No console errors or failed requests, no horizontal overflow, no duplicate ids.
- All `tel:` links point to `+18777877121`.
- No image is upscaled. This compares the rendered size with the real pixels of `currentSrc`.
- No button text wraps.
- There is no YouTube request before play.
- Every symptom produces its own illustration state, and Back works.
- Triage "yes" goes to Call now; "no, no" goes to Book, which pre-fills the form and scrolls to it.
- "Check this" preselects a symptom. Part buttons and hotspots work.
- Form: errors show and focus moves to the first invalid field; a valid entry gets the honest email/call hand-off.
- The city checker works, and "Show all 73" lists every city.
- The reviews rail and the video facade work.
- Mobile: the menu works (Escape closes it), and the call bar stays visible without covering the submit button or
  the footer.
- At 390×844 both hero actions show in the first screen.
