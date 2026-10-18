/* "The Garage Door Lab" — vanilla JS. Menu, reveals, the shared door illustration, the Find my fix widget
   (symptom → illustration + likely repair → two safety questions → call or book), Know your door,
   reviews rail, area checker, click-to-load video and the quote form. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smooth = reduced ? 'auto' : 'smooth';
  const TEL = 'tel:+18777877121';
  const PHONE = '(877) 787-7121';
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('[data-menu-btn]');
  const menu = $('#mobile-nav');
  const menuIcon = $('[data-menu-icon]');
  function setMenu(open) {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Open menu';
    menuIcon.setAttribute('d', open ? 'M6 6l12 12M18 6 6 18' : 'M4 8h16M4 16h16');
  }
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });
  matchMedia('(min-width: 1280px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Scroll reveals ---------- */
  const io = 'IntersectionObserver' in window && !reduced
    ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' })
    : null;
  // Tiles and cards inside [data-stagger] enter one after another
  $$('[data-stagger]').forEach((list) => [...list.children].forEach((el, i) => el.style.setProperty('--d', `${Math.min(i, 6) * 70}ms`)));
  $$('.reveal, .draw').forEach((el) => (io ? io.observe(el) : el.classList.add('in')));

  /* ---------- Count-up for trust-bar numbers (the final value is already in the HTML) ---------- */
  if (io) {
    const cio = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const el = e.target, to = Number(el.dataset.count), dec = Number(el.dataset.decimals || 0), t0 = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - t0) / 1200);
        el.textContent = (to * (1 - Math.pow(1 - t, 3))).toFixed(dec);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }), { threshold: 0.6 });
    $$('[data-count]').forEach((el) => cio.observe(el));
  }

  /* =====================================================================
     The door illustration: a simplified front view (white panels, charcoal frame).
     Parts carry data-p; .on turns a part red; data-state animates a fault.
     ===================================================================== */
  const range = (from, to, step) => { const a = []; for (let x = from; x <= to; x += step) a.push(x); return a; };
  const coils = (from, to, cls) => `<g class="${cls}">${range(from, to, 5).map((x) => `<rect class="pf" x="${x}" y="39" width="3" height="14" rx="1.5" fill="#C0C2C6"/>`).join('')}</g>`;
  function doorSVG({ label, cls = '' }) {
    const panels = [0, 1, 2, 3].map((i) => {
      const y = 60 + i * 39;
      const insets = [0, 1, 2, 3].map((j) => i === 0
        ? `<rect x="${52 + j * 56}" y="${y + 9}" width="48" height="16" rx="2" fill="#C0C2C6" stroke="#949596"/>`
        : `<rect x="${52 + j * 56}" y="${y + 7}" width="48" height="24" rx="2" fill="#F6F7F8" stroke="#E1E2E5"/>`).join('');
      return `<rect class="panel" x="44" y="${y}" width="232" height="38" rx="3" fill="#FFFFFF" stroke="#C0C2C6" stroke-width="1.5"/>${insets}`;
    }).join('');
    const rollers = [64, 103, 142, 181, 210].map((y) => `<circle class="roller ps" cx="39" cy="${y}" r="3.5" fill="#FFFFFF" stroke="#2F2D2E" stroke-width="1.5"/><circle class="roller ps" cx="281" cy="${y}" r="3.5" fill="#FFFFFF" stroke="#2F2D2E" stroke-width="1.5"/>`).join('');
    const siding = range(12, 210, 14).map((y) => `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#E6E8EA"/>`).join('');
    return `<svg viewBox="0 0 320 250" class="door-ill block h-auto w-full ${cls}" role="img" aria-label="${esc(label)}">
      <rect width="320" height="250" fill="#F6F7F8"/>${siding}
      <rect y="218" width="320" height="32" fill="#E1E2E5"/><line x1="0" y1="218" x2="320" y2="218" stroke="#C0C2C6" stroke-width="2"/>
      <rect x="30" y="10" width="260" height="208" rx="8" fill="#2F2D2E"/>
      <g class="pt" data-p="opener"><rect class="pf" x="140" y="14" width="40" height="16" rx="4" fill="#5D6068"/><circle class="op-light" cx="160" cy="26" r="2.5" fill="#E6E8EA"/><rect class="pf" x="158" y="30" width="4" height="9" fill="#5D6068"/></g>
      <g class="pt" data-p="spring"><line x1="40" y1="46" x2="280" y2="46" stroke="#7F8188" stroke-width="3"/><circle class="pf" cx="44" cy="46" r="6" fill="#949596"/><circle class="pf" cx="276" cy="46" r="6" fill="#949596"/>${coils(88, 118, 'coil-a')}${coils(123, 153, 'coil-b')}<rect x="157" y="38" width="6" height="16" rx="1" fill="#949596"/>${coils(168, 228, 'coil-c')}<path class="spark" d="M117 22l5 7-3.5 1 5 8" fill="none" stroke="#DB0000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></g>
      <g class="pt" data-p="track"><rect class="pf" x="36" y="56" width="6" height="160" rx="2" fill="#949596"/><rect class="pf" x="278" y="56" width="6" height="160" rx="2" fill="#949596"/></g>
      <g class="door"><g class="pt" data-p="panels">${panels}</g><g class="pt" data-p="rollers">${rollers}</g></g>
      <g class="pt" data-p="cables"><line class="cable-t l ps" x1="45" y1="50" x2="45" y2="212" stroke="#7F8188" stroke-width="1.5"/><path class="cable-s ps" d="M45 50C30 100 62 140 48 175S40 205 36 212" fill="none" stroke="#7F8188" stroke-width="1.5"/><line class="cable-t ps" x1="275" y1="50" x2="275" y2="212" stroke="#7F8188" stroke-width="1.5"/></g>
      <g class="pt" data-p="sensors"><line class="beam" x1="30" y1="204" x2="290" y2="204" stroke="#DB0000" stroke-width="1.5" stroke-dasharray="3 4"/><rect class="pf" x="22" y="198" width="8" height="12" rx="2" fill="#2F2D2E"/><rect class="pf" x="290" y="198" width="8" height="12" rx="2" fill="#2F2D2E"/></g>
    </svg>`;
  }
  function paint(svg, parts, state = '') {
    svg.dataset.state = state;
    $$('.pt', svg).forEach((p) => p.classList.toggle('on', parts.includes(p.dataset.p)));
  }

  /* =====================================================================
     Find my fix. Repairs use the business's own service list (garagedoorasapservice.com).
     ===================================================================== */
  const SYMPTOMS = [
    { id: 'bang', icon: 'i-bang', label: 'Loud bang, won’t lift', service: 'Spring Replacement', state: 'spring', parts: ['spring'], urgent: true,
      text: 'A loud bang and a door that won’t lift usually means a spring has snapped. We replace it safely and rebalance the door.',
      tip: 'Don’t force the door or keep pressing the opener. Without a working spring, nothing holds the door’s weight.' },
    { id: 'wontopen', icon: 'i-lock', label: 'Won’t open', service: 'Not sure — please advise', title: 'Spring or opener', state: 'wontopen', parts: ['spring', 'opener'], urgent: true,
      text: 'If the opener hums but the door doesn’t move, a broken spring is the most common cause. If nothing happens at all, it may be the opener or its power.',
      tip: 'Don’t force the door. If you heard a bang or it feels very heavy, stop using the opener and keep clear.' },
    { id: 'offtrack', icon: 'i-tilt', label: 'Crooked or off track', service: 'Shifted Door Repair', state: 'offtrack', parts: ['track', 'rollers', 'panels'], urgent: true,
      text: 'A shifted door is realigned, and its cables, rollers and tracks are inspected and corrected before it goes back into service.',
      tip: 'Don’t open or close it. A crooked door can fall, so keep cars and people clear.' },
    { id: 'cable', icon: 'i-cable', label: 'Cable snapped or loose', service: 'Cable Replacement', state: 'cable', parts: ['cables'], urgent: true,
      text: 'Lift cables raise both sides of the door evenly. We replace a frayed or snapped cable and check the drums and spring.',
      tip: 'Keep clear: cables are under high tension. Don’t run the door until it has been checked.' },
    { id: 'noisy', icon: 'i-sound', label: 'Noisy or shaking', service: 'Roller Replacement', state: 'noisy', parts: ['rollers', 'track'], urgent: false,
      text: 'Worn rollers make a door shudder, squeak and grind. New rollers bring back smooth, quiet travel along the track.',
      tip: 'Don’t force a door that sticks. Booking early stops small wear becoming a bigger repair.' },
    { id: 'reverse', icon: 'i-reverse', label: 'Reverses before closing', service: 'Opener Repair', state: 'reverse', parts: ['sensors'], urgent: false,
      text: 'A door that reverses before it closes is often the safety sensors: misaligned, dirty or damaged. We realign or replace them and test the reverse.',
      tip: 'Check nothing is blocking the beam between the sensors. Never disable them: they stop the door closing on people.' },
    { id: 'opener', icon: 'i-remote', label: 'Opener or remote not working', service: 'Opener Repair', state: 'opener', parts: ['opener'], urgent: false,
      text: 'Opener not responding, or stopping halfway? We diagnose the motor, controls and settings and repair them on the spot, or fit a new opener.',
      tip: 'Check the opener has power. If the motor hums but the door doesn’t move, stop: the spring may have broken.' },
    { id: 'tuneup', icon: 'i-wrench', label: 'Just want a tune-up', service: 'General Maintenance', state: '', parts: ['spring', 'opener', 'track', 'rollers', 'cables', 'sensors'], urgent: false,
      text: 'A careful tune-up: hardware tightened, moving parts lubricated, balance and safety sensors checked, so the door stays quiet and lasts longer.',
      tip: 'Regular maintenance helps catch worn parts before they fail.' }
  ];
  const PART_NAMES = { spring: 'spring', opener: 'opener', track: 'tracks', rollers: 'rollers', cables: 'cables', panels: 'panels', sensors: 'sensors' };

  const widget = $('[data-widget]');
  const steps = { 1: $('[data-step="1"]', widget), 2: $('[data-step="2"]', widget), 3: $('[data-step="3"]', widget) };
  const live = $('[data-live]', widget);
  const stepText = $('[data-step-text]', widget);
  const dots = $$('.dots i', widget);
  const form = $('[data-form]');
  let current = null;

  $('[data-symptoms]', widget).innerHTML = SYMPTOMS.map((s) => `<li><button type="button" class="sym" data-symptom="${s.id}"><span class="sym-ic"><svg aria-hidden="true"><use href="#${s.icon}"/></svg></span><span class="flex-1">${esc(s.label)}</span><svg class="h-4 w-4 shrink-0 text-brand-grey-500" aria-hidden="true"><use href="#i-chev"/></svg></button></li>`).join('');

  function show(n, focus = true) {
    Object.entries(steps).forEach(([k, el]) => { el.hidden = Number(k) !== n; });
    const el = steps[n];
    el.classList.remove('step-in'); void el.offsetWidth; el.classList.add('step-in');
    stepText.textContent = `Step ${n} of 3`;
    dots.forEach((d, i) => d.classList.toggle('on', i < n));
    if (focus) $('[data-step-title]', el).focus({ preventScroll: true });
  }

  const callLink = (cls) => `<a href="${TEL}" class="${cls}"><svg aria-hidden="true"><use href="#i-phone"/></svg><span>Call <span class="tnum">${PHONE}</span></span></a>`;
  const backBtn = (to, label = 'Back') => `<button type="button" class="inline-flex min-h-[2.75rem] items-center gap-1.5 text-sm font-heading text-brand-grey-700 hover:text-brand-midnight" data-go="${to}"><svg class="h-4 w-4" aria-hidden="true"><use href="#i-back"/></svg>${label}</button>`;

  function selectSymptom(id, { focus = true } = {}) {
    const s = SYMPTOMS.find((x) => x.id === id);
    if (!s) return;
    current = s;
    steps[2].innerHTML = `
      ${backBtn(1)}
      <div class="mt-2 grid items-start gap-4 sm:grid-cols-[minmax(0,15rem)_1fr]">
        <div class="overflow-hidden rounded-xl bg-brand-grey-50 ring-1 ring-brand-grey-200" data-ill>${doorSVG({ label: `Garage door with the ${s.parts.map((p) => PART_NAMES[p]).join(', ')} highlighted` })}</div>
        <div>
          <p class="inline-flex rounded-md px-2 py-1 text-xs font-heading ${s.urgent ? 'bg-brand-red text-white' : 'bg-brand-grey-100 text-brand-midnight'}">${s.urgent ? 'Often urgent' : 'Usually not urgent'}</p>
          <h2 class="mt-2 text-xl font-title" tabindex="-1" data-step-title>Likely fix: ${esc(s.title || s.service)}</h2>
          <p class="mt-1.5 text-sm leading-relaxed text-brand-grey-700">${esc(s.text)}</p>
        </div>
      </div>
      <div class="mt-4 flex items-start gap-3">
        <img src="../assets/brand/brand-mr-asap.png" alt="" width="760" height="762" class="h-11 w-11 shrink-0 rounded-full bg-brand-grey-100 object-cover object-top">
        <p class="bubble flex-1"><strong class="font-heading text-brand-midnight">Mr. ASAP:</strong> ${esc(s.tip)}</p>
      </div>
      <div class="mt-4 rounded-xl border border-brand-grey-200 p-4" data-qbox></div>`;
    const svg = $('svg.door-ill', steps[2]);
    paint(svg, s.parts, '');
    show(2, focus);
    requestAnimationFrame(() => requestAnimationFrame(() => paint(svg, s.parts, s.state)));
    live.textContent = `Likely fix: ${s.title || s.service}. Safety question 1 of 2.`;
    ask(0);
  }

  const QUESTIONS = ['Is the door stuck open, or unsafe to close?', 'Is a vehicle trapped, or do you need to leave soon?'];
  function ask(i, focus = false) {
    const box = $('[data-qbox]', steps[2]);
    box.innerHTML = `
      <p class="text-xs font-heading text-brand-grey-700">Quick safety check · ${i + 1} of 2</p>
      <p class="mt-1 font-heading text-brand-midnight" tabindex="-1" data-question>${QUESTIONS[i]}</p>
      <div class="mt-3 flex gap-2"><button type="button" class="yn" data-answer="yes">Yes</button><button type="button" class="yn" data-answer="no">No</button></div>`;
    $$('[data-answer]', box).forEach((b) => b.addEventListener('click', () => {
      if (b.dataset.answer === 'yes') return outcome('call');
      if (i === 0) { live.textContent = 'Safety question 2 of 2.'; return ask(1, true); }
      return outcome('book');
    }));
    if (focus) $('[data-question]', box).focus();
  }

  function outcome(kind) {
    const s = current;
    if (kind === 'call') {
      steps[3].innerHTML = `
        <div class="flex items-center justify-between gap-3">${backBtn(2)}<button type="button" class="min-h-[2.75rem] text-sm font-heading text-brand-grey-700 hover:text-brand-midnight" data-go="1">Start over</button></div>
        <div class="mt-2 rounded-xl bg-brand-red p-5 text-white on-red">
          <h2 class="text-2xl font-title text-white" tabindex="-1" data-step-title>Call now. This needs a technician today.</h2>
          <p class="mt-2 text-[0.95rem] leading-relaxed">We’re open 24/7, holidays included. We’ll give you a time on the phone.</p>
          ${callLink('btn btn-white mt-4 min-h-[3.75rem] w-full text-lg')}
        </div>
        <div class="mt-4 rounded-xl bg-brand-grey-50 p-4 text-sm leading-relaxed ring-1 ring-brand-grey-200">
          <p class="flex items-center gap-2 font-heading text-brand-midnight"><svg class="h-5 w-5 text-brand-red" aria-hidden="true"><use href="#i-alert"/></svg>Until we arrive</p>
          <ul class="mt-2 grid list-disc gap-1 pl-5 text-brand-ink">
            <li>Keep people, pets and cars clear of the door.</li>
            <li>Don’t touch springs, cables or brackets.</li>
            <li>If the door is open with a broken spring or cable, don’t pull the emergency release. It can drop.</li>
          </ul>
        </div>
        <a href="#quote" class="mt-4 inline-flex min-h-[2.75rem] items-center gap-2 text-sm font-heading text-brand-red hover:underline" data-callback>Can’t talk now? Request an emergency callback<svg class="h-4 w-4" aria-hidden="true"><use href="#i-arrow"/></svg></a>`;
      $('[data-callback]', steps[3]).addEventListener('click', () => prefillForm({ service: s.service, urgency: 'Emergency — as soon as possible' }));
      live.textContent = 'Call now. This needs a technician today.';
    } else {
      const timing = s.urgent ? 'Today' : 'This week';
      steps[3].innerHTML = `
        <div class="flex items-center justify-between gap-3">${backBtn(2)}<button type="button" class="min-h-[2.75rem] text-sm font-heading text-brand-grey-700 hover:text-brand-midnight" data-go="1">Start over</button></div>
        <div class="mt-2 flex items-start gap-4">
          <span class="icon-tile h-12 w-12"><svg aria-hidden="true"><use href="#i-calendar"/></svg></span>
          <div>
            <h2 class="text-2xl font-title" tabindex="-1" data-step-title>Book a visit</h2>
            <p class="mt-1 text-[0.95rem] leading-relaxed text-brand-grey-700">It sounds safe to wait for a booked visit. We’ll fill in the form for you: <strong class="font-heading text-brand-midnight">${esc(s.service)}</strong>, ${timing.toLowerCase()}.</p>
          </div>
        </div>
        <div class="mt-5 grid gap-2 sm:grid-cols-2">
          <a href="#quote" class="btn btn-red min-h-[3.25rem]" data-book-visit>Book this visit<svg aria-hidden="true"><use href="#i-arrow"/></svg></a>
          ${callLink('btn btn-outline min-h-[3.25rem]')}
        </div>
        <div class="mt-4 rounded-xl bg-brand-grey-50 p-4 text-sm leading-relaxed ring-1 ring-brand-grey-200">
          <p class="flex items-center gap-2 font-heading text-brand-midnight"><svg class="h-5 w-5 text-brand-red" aria-hidden="true"><use href="#i-alert"/></svg>Safety card</p>
          <ul class="mt-2 grid list-disc gap-1 pl-5 text-brand-ink">
            <li>If anything changes (a bang, a crooked door, a door that won’t close), call us straight away.</li>
            <li>Don’t adjust springs or cables yourself.</li>
          </ul>
        </div>`;
      $('[data-book-visit]', steps[3]).addEventListener('click', () => prefillForm({ service: s.service, urgency: timing }));
      live.textContent = 'Book a visit.';
    }
    show(3);
  }

  widget.addEventListener('click', (e) => {
    const sym = e.target.closest('[data-symptom]');
    if (sym) return selectSymptom(sym.dataset.symptom);
    const go = e.target.closest('[data-go]');
    if (!go) return;
    const n = Number(go.dataset.go);
    if (n === 2) { show(2); ask(0); }
    else { show(1); live.textContent = 'Step 1 of 3: what’s your door doing?'; }
  });

  /* "Check this" on the service cards opens the widget with that symptom */
  $$('[data-check]').forEach((b) => b.addEventListener('click', () => {
    selectSymptom(b.dataset.check, { focus: false });
    widget.scrollIntoView({ behavior: smooth, block: 'start' });
    $('[data-step-title]', steps[2]).focus({ preventScroll: true });
  }));

  /* =====================================================================
     Know your door: numbered markers + part tabs (arrow keys, prev/next) drive one detail panel.
     ===================================================================== */
  const PARTS = {
    spring: { name: 'Torsion spring', does: 'Carries the weight of the door, so the opener only has to guide it.', urgency: ['Often urgent', true], signs: ['A loud bang from the garage', 'A visible gap in the coil', 'The door feels very heavy or won’t lift'], we: 'Replace the spring safely, then rebalance and test the door.', service: 'Spring Replacement', symptom: 'bang', img: ['../assets/img/brand-springs-pair.jpg', 'A pair of garage door torsion springs'] },
    opener: { name: 'Opener', does: 'The motor and rail that move the door from the wall button or remote.', urgency: ['Usually can wait', false], signs: ['Humming without movement', 'No response to the remote or wall button', 'The door stops halfway'], we: 'Diagnose the motor, controls and settings and repair them on the spot, or supply, install and program a new opener.', service: 'Opener Repair', symptom: 'opener', img: ['../assets/img/brand-svc-opener.jpg', 'A garage door opener mounted on the ceiling'] },
    track: { name: 'Tracks', does: 'Two steel tracks guide the door straight up and over.', urgency: ['Often urgent', true], signs: ['A crooked door', 'A door off its track or hanging', 'Bent panels'], we: 'Realign the shifted door and inspect and correct the cables, rollers and tracks.', service: 'Shifted Door Repair', symptom: 'offtrack', img: ['../assets/img/brand-svc-shifted.jpg', 'A garage door that has shifted out of its track'] },
    rollers: { name: 'Rollers', does: 'Carry each panel smoothly and quietly along the tracks.', urgency: ['Usually can wait', false], signs: ['Grinding or squeaking', 'Shaking or juddering as the door moves'], we: 'Fit new rollers to restore smooth, quieter travel.', service: 'Roller Replacement', symptom: 'noisy', img: ['../assets/img/brand-svc-rollers.jpg', 'A set of garage door rollers'] },
    cables: { name: 'Lift cables', does: 'Run from the bottom of the door to the drums and lift both sides evenly.', urgency: ['Often urgent', true], signs: ['A frayed or loose cable', 'One side of the door hanging lower', 'The door stuck partway'], we: 'Replace the cable and check the drums and springs.', service: 'Cable Replacement', symptom: 'cable', icon: 'i-cable' },
    sensors: { name: 'Safety sensors', does: 'Send a beam across the opening. If something breaks it, the door reverses.', urgency: ['Book soon: safety part', false], signs: ['The door reverses before it closes', 'The door won’t close at all'], we: 'Realign or replace the sensors and test the safety reverse.', service: 'Opener Repair', symptom: 'reverse', icon: 'i-sensor' }
  };
  const ORDER = Object.keys(PARTS);
  const stage = $('[data-know-stage]');
  const canvas = $('[data-know-canvas]');
  const knowSvg = $('[data-know-svg]');
  const panel = $('[data-know-panel]');
  const tabs = $$('[data-ktab]');
  let partNow = 'spring';

  function showPart(id, { focusTab = false } = {}) {
    const p = PARTS[id];
    const n = ORDER.indexOf(id) + 1;
    partNow = id;
    canvas.dataset.active = id;
    $$('.kp', knowSvg).forEach((g) => g.classList.toggle('on', g.dataset.k === id));
    $$('[data-kmark]').forEach((m) => m.setAttribute('aria-pressed', String(m.dataset.kmark === id)));
    tabs.forEach((t) => { const on = t.dataset.ktab === id; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    const tab = $(`[data-ktab="${id}"]`);
    panel.setAttribute('aria-labelledby', tab.id);
    const rail = tab.parentElement;
    if (rail.scrollWidth > rail.clientWidth) rail.scrollTo({ left: tab.offsetLeft - (rail.clientWidth - tab.offsetWidth) / 2, behavior: 'instant' });
    if (focusTab) tab.focus();
    const thumb = p.img
      ? `<img src="${p.img[0]}" alt="${esc(p.img[1])}" class="h-20 w-24 shrink-0 rounded-xl object-cover ring-1 ring-brand-grey-200 sm:h-24 sm:w-32">`
      : `<span class="grid h-20 w-24 shrink-0 place-items-center rounded-xl sm:h-24 sm:w-32 bg-brand-grey-50 text-brand-midnight ring-1 ring-brand-grey-200"><svg class="h-10 w-10" aria-hidden="true"><use href="#${p.icon}"/></svg></span>`;
    panel.innerHTML = `<div class="kfade">
      <div class="flex items-center justify-between gap-3 border-b border-brand-grey-200 px-6 py-3 sm:px-7">
        <p class="text-xs font-heading tracking-[0.08em] text-brand-grey-700">Part <span class="tnum">0${n}</span> of 06</p>
        <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-heading ${p.urgency[1] ? 'bg-brand-red text-white' : 'bg-brand-grey-100 text-brand-midnight'}"><svg class="h-3.5 w-3.5" aria-hidden="true"><use href="#${p.urgency[1] ? 'i-alert' : 'i-calendar'}"/></svg>${esc(p.urgency[0])}</span>
      </div>
      <div class="p-6 sm:p-7">
        <div class="flex items-start gap-4">
          <div class="min-w-0 flex-1">
            <h3 class="text-2xl font-title">${esc(p.name)}</h3>
            <p class="mt-1.5 text-[0.95rem] leading-relaxed text-brand-grey-700">${esc(p.does)}</p>
          </div>
          ${thumb}
        </div>
        <h4 class="mt-6 text-xs font-title uppercase tracking-[0.14em] text-brand-grey-700">Warning signs</h4>
        <ul class="mt-3 grid gap-2.5 text-[0.95rem]">${p.signs.map((x) => `<li class="flex items-center gap-3"><span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-red-tint text-brand-red"><svg class="h-4 w-4" aria-hidden="true"><use href="#i-alert"/></svg></span>${esc(x)}</li>`).join('')}</ul>
        <h4 class="mt-6 text-xs font-title uppercase tracking-[0.14em] text-brand-grey-700">What we do</h4>
        <p class="mt-3 flex items-start gap-3 text-[0.95rem] leading-relaxed"><span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-midnight text-white"><svg class="h-4 w-4" aria-hidden="true"><use href="#i-check"/></svg></span><span class="pt-0.5">${esc(p.we)}</span></p>
        <div class="mt-7 flex flex-wrap items-center gap-2 border-t border-brand-grey-200 pt-5">
          <button type="button" class="btn btn-outline btn-sm px-3" data-know-check>Check this in Find my fix</button>
          <a href="#quote" class="btn btn-red btn-sm px-3.5" data-know-book>Book<span class="sr-only">: ${esc(p.service)}</span></a>
          <a href="${TEL}" class="inline-flex min-h-[2.75rem] items-center gap-1.5 whitespace-nowrap px-2 text-sm font-heading text-brand-midnight hover:text-brand-red"><svg class="h-4 w-4 text-brand-red" aria-hidden="true"><use href="#i-phone"/></svg>Call</a>
        </div>
      </div></div>`;
    $('[data-know-book]', panel).addEventListener('click', () => prefillForm({ service: p.service }));
    $('[data-know-check]', panel).addEventListener('click', () => {
      selectSymptom(p.symptom, { focus: false });
      widget.scrollIntoView({ behavior: smooth, block: 'start' });
      $('[data-step-title]', steps[2]).focus({ preventScroll: true });
    });
  }
  const step = (d, focusTab = false) => showPart(ORDER[(ORDER.indexOf(partNow) + d + ORDER.length) % ORDER.length], { focusTab });
  tabs.forEach((t) => t.addEventListener('click', () => showPart(t.dataset.ktab)));
  $$('[data-kmark]').forEach((m) => m.addEventListener('click', () => showPart(m.dataset.kmark)));
  $('[data-know-prev]').addEventListener('click', () => step(-1));
  $('[data-know-next]').addEventListener('click', () => step(1));
  $('[data-know-tabs]').addEventListener('keydown', (e) => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (e.key in keys) { e.preventDefault(); step(keys[e.key], true); }
    else if (e.key === 'Home') { e.preventDefault(); showPart(ORDER[0], { focusTab: true }); }
    else if (e.key === 'End') { e.preventDefault(); showPart(ORDER[ORDER.length - 1], { focusTab: true }); }
  });
  // A small parallax on the illustration, following the pointer (off for reduced motion and touch)
  if (!reduced && matchMedia('(hover: hover)').matches) {
    stage.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      canvas.style.transform = `translate(${(x * -10).toFixed(1)}px, ${(y * -8).toFixed(1)}px)`;
    });
    stage.addEventListener('pointerleave', () => { canvas.style.transform = ''; });
  }
  showPart('spring');

  /* ---------- Book buttons + financing pre-fill the form ---------- */
  $$('[data-book]').forEach((a) => a.addEventListener('click', () => prefillForm({ service: a.dataset.book })));
  $$('a[href="#quote"][data-details]').forEach((a) => a.addEventListener('click', () => prefillForm({ message: a.dataset.details })));

  /* ---------- Reviews rail ---------- */
  const rv = $('[data-reviews]');
  const cardStep = () => (rv.querySelector('li')?.getBoundingClientRect().width || 320) + 16;
  $$('[data-rev]').forEach((b) => b.addEventListener('click', () => rv.scrollBy({ left: cardStep() * Number(b.dataset.rev), behavior: smooth })));
  rv.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); rv.scrollBy({ left: cardStep() * (e.key === 'ArrowRight' ? 1 : -1), behavior: smooth }); }
  });

  /* ---------- Service areas (73 cities listed on garagedoorasapservice.com) ---------- */
  const CITIES = ['Orlando', 'Kissimmee', 'The Villages', 'Clermont', 'Apopka', 'Winter Garden', 'Winter Park', 'Sanford', 'Casselberry',
    'Oviedo', 'Lake Mary', 'Altamonte Springs', 'Longwood', 'Windermere', 'Leesburg', 'Ocoee', 'Pine Hills', 'Groveland', 'Eustis',
    'Maitland', 'Wildwood', 'Minneola', 'Mount Dora', 'Tavares', 'Lockhart', 'Saint Cloud', 'Winter Springs', 'Coleman', 'Umatilla',
    'Fruitland Park', 'Lady Lake', 'Bushnell', 'Mascotte', 'Grand Island', 'Webster', 'Montverde', 'Astatula', 'Fairview Shores',
    'Center Hill', 'Oakland', 'Gotha', 'Davenport', 'Doctor Phillips', 'Deltona', 'DeBary', 'Sorrento', 'Hunters Creek',
    'Howey-in-the-Hills', 'Heathrow', 'Buena Ventura Lakes', 'Belle Isle', 'Meadow Woods', 'Azalea Park', 'Poinciana', 'Oak Ridge',
    'Union Park', 'Ormond Beach', 'Ormond-by-the-Sea', 'Daytona Beach', 'Holly Hill', 'Port Orange', 'Edgewater', 'New Smyrna Beach',
    'Orange City', 'Palm Coast', 'South Daytona', 'DeLand', 'Ponce Inlet', 'Lake Helen', 'Melbourne', 'Rockledge', 'Titusville',
    'Flagler Beach'];
  const PREVIEW = 18;
  const norm = (s) => s.toLowerCase().replace(/^st\.?\s/, 'saint ').replace(/[^a-z]/g, '');
  const areaList = $('[data-area-list]');
  const datalist = $('[data-area-datalist]');
  $('[data-area-count]').textContent = CITIES.length;
  CITIES.forEach((c, i) => {
    const li = document.createElement('li');
    li.className = 'flex items-center gap-2';
    li.innerHTML = '<svg class="h-4 w-4 shrink-0 text-brand-red" aria-hidden="true"><use href="#i-pin"/></svg>';
    li.append(c);
    if (i >= PREVIEW) li.hidden = true;
    areaList.append(li);
    const o = document.createElement('option'); o.value = c; datalist.append(o);
  });
  const areaToggle = $('[data-area-toggle]');
  areaToggle.addEventListener('click', () => {
    const open = areaToggle.getAttribute('aria-expanded') !== 'true';
    $$('li', areaList).forEach((li, i) => { if (i >= PREVIEW) li.hidden = !open; });
    areaToggle.setAttribute('aria-expanded', String(open));
    areaToggle.querySelector('span').textContent = open ? 'Show fewer cities' : `Show all ${CITIES.length} cities`;
    areaToggle.querySelector('svg').classList.toggle('-rotate-90', open);
    areaToggle.querySelector('svg').classList.toggle('rotate-90', !open);
  });
  const areaForm = $('[data-area-form]');
  const areaResult = $('[data-area-result]');
  areaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = areaForm.area.value.trim();
    if (!q) { areaResult.className = 'mt-3 min-h-[1.5rem] text-sm font-medium text-brand-red'; areaResult.textContent = 'Please type a city name.'; return; }
    const hit = CITIES.find((c) => norm(c) === norm(q));
    areaResult.className = 'mt-3 min-h-[1.5rem] text-sm ' + (hit ? 'font-medium text-brand-midnight' : 'text-brand-grey-700');
    areaResult.textContent = hit
      ? `Yes, we serve ${hit}. Call ${PHONE} or request a quote below.`
      : `${q} isn’t on our list, but we often help nearby towns. Call ${PHONE} to check.`;
  });

  /* ---------- Click-to-load video: nothing is requested from YouTube until play is pressed ---------- */
  const video = $('[data-video]');
  $('[data-video-play]').addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/MboKo4BJUuU?autoplay=1&rel=0';
    f.title = 'What should you do with a crooked garage door? Garage Door ASAP Service on YouTube';
    f.allow = 'autoplay; encrypted-media; picture-in-picture';
    f.allowFullscreen = true;
    f.className = 'absolute inset-0 h-full w-full';
    video.replaceChildren(f);
    f.focus();
  });

  /* ---------- Quote form (shared GDAForm: validation + honest email/call hand-off) ---------- */
  if (window.GDAForm) GDAForm.init(form, { primaryClass: 'btn btn-red', secondaryClass: 'btn btn-outline', titleClass: 'text-lg font-title text-brand-midnight' });

  function prefillForm({ service, urgency, message } = {}) {
    if (window.GDAForm) GDAForm.prefill(form, { service, urgency, message });
    const problem = $('#f-problem');
    if (problem.getAttribute('aria-invalid') === 'true' && problem.value && window.GDAForm) GDAForm.validateField(problem);
    setTimeout(() => $('#f-name').focus({ preventScroll: true }), reduced ? 0 : 600);
  }
})();
