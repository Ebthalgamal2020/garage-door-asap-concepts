/* "The Lift" — vanilla JS. Header, menu, reveals, door diagram + fix finder, before/after, steps track,
   rating ring, reviews carousel, area checker, quick quote → full form, mobile bar. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smooth = reduced ? 'auto' : 'smooth';

  /* ---------- Header: compact + shadow once scrolled ---------- */
  const header = $('[data-header]');
  const onScrollHeader = () => header.classList.toggle('shadow-[0_8px_30px_-18px_rgba(28,31,42,.35)]', scrollY > 8);
  addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

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
  matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Scroll reveals ---------- */
  const io = 'IntersectionObserver' in window && !reduced
    ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' })
    : null;
  $$('.reveal').forEach((el) => (io ? io.observe(el) : el.classList.add('in')));

  /* ---------- Trust ribbon numbers count up once, when seen ---------- */
  const counters = $$('[data-count]');
  if (io && counters.length) {
    const cio = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const el = e.target, end = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length, t0 = performance.now();
      const step = (now) => { const t = Math.min(1, (now - t0) / 1400); el.textContent = (end * (1 - Math.pow(1 - t, 3))).toFixed(dec); if (t < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }), { threshold: 0.6 });
    counters.forEach((c) => cio.observe(c));
  }

  /* ---------- Hero arch: gentle parallax on the photo ---------- */
  const arch = $('[data-parallax] img');
  if (arch && !reduced) {
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { const y = Math.min(scrollY, 900); arch.style.transform = `translateY(${y * 0.08}px) scale(1.06)`; ticking = false; });
    }, { passive: true });
    arch.style.transform = 'scale(1.06)';
  }

  /* =====================================================================
     Fix finder + door diagram
     Symptoms and fixes use the business's own service list (garagedoorasapservice.com).
     ===================================================================== */
  const SYMPTOMS = [
    { id: 'spring', label: 'Loud bang, door won’t lift', service: 'Spring Replacement', parts: ['spring'], urgent: true,
      text: 'Springs carry the weight of the door. A loud bang followed by a door that won’t open usually means a spring has snapped. We replace it safely and rebalance the door.',
      tip: 'Don’t try to lift the door or keep pressing the opener. Without a working spring, the door’s full weight is unsupported.',
      img: '../assets/img/brand-svc-spring-broken.jpg', alt: 'A broken torsion spring with a visible gap' },
    { id: 'cable', label: 'Cable snapped or hanging loose', service: 'Cable Replacement', parts: ['cables'], urgent: true,
      text: 'Lift cables raise the door evenly from the bottom. A frayed or snapped cable can leave the door crooked or stuck, so we replace it and check the drums and spring.',
      tip: 'Keep clear of the door: cables are under high tension. Don’t operate the door until it has been checked.' },
    { id: 'hum', label: 'Opener hums or won’t respond', service: 'Opener Repair', parts: ['opener'], urgent: false,
      text: 'Opener humming, not responding to the remote or wall button, or stopping halfway? We diagnose the motor, controls and settings and repair them on the spot.',
      tip: 'Check the opener has power. If the motor hums but the door doesn’t move, stop: the spring may have broken.',
      img: '../assets/img/brand-svc-opener.jpg', alt: 'A garage door opener mounted on the ceiling' },
    { id: 'reverse', label: 'Door reverses or won’t close', service: 'Opener Repair', parts: ['sensors', 'opener'], urgent: false,
      text: 'A door that reverses before it closes is often the safety sensors near the floor: misaligned, dirty or damaged. We realign or replace them and test the safety reverse.',
      tip: 'Make sure nothing is blocking the beam between the two sensors and that the lenses are clean.' },
    { id: 'offtrack', label: 'Crooked, off track or hanging', service: 'Shifted Door Repair', parts: ['track', 'rollers', 'cables'], urgent: true,
      text: 'A shifted or off-track door is realigned, and the cables, rollers and tracks are inspected and corrected before it goes back into service.',
      tip: 'Don’t open or close it. A shifted door can fall, so keep cars and people clear until we arrive.',
      img: '../assets/img/brand-shifted-door-sm.jpg', alt: 'A garage door that has shifted out of its track' },
    { id: 'noisy', label: 'Grinding, squeaking or shaking', service: 'Roller Replacement', parts: ['rollers', 'track'], urgent: false,
      text: 'Worn or noisy rollers make a door shudder and grind. New rollers restore smooth, quiet travel along the track.',
      tip: 'Book a visit before small wear becomes a bigger repair.',
      img: '../assets/img/brand-svc-rollers.jpg', alt: 'A set of garage door rollers' },
    { id: 'old', label: 'Opener is old or unreliable', service: 'Opener Replacement', parts: ['opener'], urgent: false,
      text: 'When an opener reaches the end of its life, we supply, install, program and test a new one, set up properly and safely.',
      tip: 'Ask us to compare repairing your current opener with replacing it.',
      img: '../assets/img/brand-svc-opener-new.jpg', alt: 'A new garage door opener unit', fit: 'contain' },
    { id: 'tuneup', label: 'Just want a tune-up', service: 'General Maintenance', parts: ['spring', 'cables', 'opener', 'track', 'rollers', 'sensors'], urgent: false,
      text: 'A careful tune-up: hardware tightened, moving parts lubricated, balance and safety sensors checked, so the door stays quiet and lasts longer.',
      tip: 'Regular maintenance helps catch worn parts before they fail.',
      img: '../assets/img/brand-svc-maintenance.jpg', alt: 'A technician servicing garage door hardware' }
  ];
  const PART_TO_SYMPTOM = { spring: 'spring', cables: 'cable', opener: 'hum', track: 'offtrack', rollers: 'noisy', sensors: 'reverse' };

  // Small line icons per symptom (24×24, stroke)
  const ICONS = {
    spring: 'M2 12h2.5l1.5-5 3 10 3-10 3 10 3-10 1.5 5H22',
    cable: 'M6 3v8a3 3 0 0 0 3 3h1M18 21v-8a3 3 0 0 0-3-3h-1M11.5 13.5l1-1',
    offtrack: 'M3 21h18M5 21 7 7l12 3-1.5 11M7.5 12.5l10 2.2',
    hum: 'M3 5h18v7H3zM7 12v3M17 12v3M9 19h6',
    reverse: 'M4 8h13l-3-3M20 16H7l3 3',
    noisy: 'M4 9v6h4l5 4V5L8 9H4ZM17 9.5a3.5 3.5 0 0 1 0 5M19.5 7a7 7 0 0 1 0 10',
    old: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
    tuneup: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6Z'
  };
  const symLists = { urgent: $('[data-symptoms="urgent"]'), routine: $('[data-symptoms="routine"]') };
  const diagram = $('[data-diagram]');
  const result = $('[data-result]');
  const form = $('[data-form]');

  SYMPTOMS.forEach((s) => {
    const li = document.createElement('li');
    li.innerHTML = `<button type="button" class="symptom group flex w-full items-center gap-3 rounded-2xl py-1.5 pl-2 pr-3 text-left text-[0.95rem] font-medium text-brand-midnight transition hover:bg-brand-grey-50" aria-pressed="false" data-symptom="${s.id}">
      <span class="sym-ic grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-grey-100 transition"><svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICONS[s.id]}"/></svg></span>
      <span class="flex-1" data-label></span>
      <svg class="sym-chev h-4 w-4 shrink-0 text-brand-grey-500 transition" aria-hidden="true"><use href="#i-arrow"/></svg></button>`;
    li.querySelector('[data-label]').textContent = s.label;
    symLists[s.urgent ? 'urgent' : 'routine'].append(li);
  });

  function renderResult(s) {
    result.classList.remove('result-swap'); void result.offsetWidth; result.classList.add('result-swap');
    result.innerHTML = `
      <div class="grid items-center gap-5 ${s.img ? 'md:grid-cols-[1fr_auto] lg:grid-cols-1' : ''}">
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="rounded-full px-3 py-1 text-[0.8rem] font-title ${s.urgent ? 'bg-brand-red text-white' : 'bg-white/10 text-white'}">${s.urgent ? 'Urgent · call now' : 'Book a visit'}</span>
            <span class="text-[0.8rem] text-brand-grey-400">Likely fix for “<span data-r-sym></span>”</span>
          </div>
          <h3 class="mt-3 text-xl font-title text-white sm:text-2xl" data-r-title></h3>
          <p class="mt-2 text-sm leading-relaxed text-brand-grey-400" data-r-text></p>
          <p class="mt-3 flex gap-2.5 rounded-2xl bg-white/5 px-3.5 py-3 text-[0.82rem] leading-relaxed text-white"><svg class="mt-0.5 h-5 w-5 shrink-0 text-white" aria-hidden="true"><use href="#i-alert"/></svg><span><strong class="font-heading">Safety tip: </strong><span data-r-tip></span></span></p>
          <div class="mt-4 flex flex-wrap gap-2.5">
            ${s.urgent
              ? '<a href="tel:+18777877121" class="btn btn-red min-h-[3rem] px-5 text-sm"><svg><use href="#i-phone"/></svg>Call now</a><a href="#quote" class="btn btn-ghost-light min-h-[3rem] px-5 text-sm" data-book>Book this fix</a>'
              : '<a href="#quote" class="btn btn-red min-h-[3rem] px-5 text-sm" data-book>Book this fix<svg class="nudge"><use href="#i-arrow"/></svg></a><a href="tel:+18777877121" class="btn btn-ghost-light min-h-[3rem] px-5 text-sm"><svg><use href="#i-phone"/></svg>Call</a>'}
          </div>
        </div>
        ${s.img ? `<figure class="arch relative mx-auto aspect-square w-full max-w-[12.5rem] bg-white/5 ring-1 ring-white/10 md:w-[12.5rem] lg:hidden" data-r-fig><img class="absolute inset-0 h-full w-full ${s.fit === 'contain' ? 'bg-white object-contain px-5 pb-3 pt-[4.25rem]' : 'object-cover'}" loading="lazy" data-r-img><figcaption class="sr-only">Photo from the Garage Door ASAP website</figcaption></figure>` : ''}
      </div>`;
    $('[data-r-title]', result).textContent = s.service;
    $('[data-r-sym]', result).textContent = s.label;
    $('[data-r-text]', result).textContent = s.text;
    $('[data-r-tip]', result).textContent = s.tip;
    const img = $('[data-r-img]', result);
    if (img) {
      // The client's photos are small: cap the square frame at the photo's own pixels so it is never enlarged
      img.addEventListener('load', () => { $('[data-r-fig]', result).style.maxWidth = Math.min(200, img.naturalWidth, img.naturalHeight) + 'px'; }, { once: true });
      img.src = s.img; img.alt = s.alt;
    }
    $('[data-book]', result).addEventListener('click', () => prefillForm({ service: s.service, urgency: s.urgent ? 'Emergency — as soon as possible' : undefined }));
  }

  function selectSymptom(id) {
    const s = SYMPTOMS.find((x) => x.id === id);
    if (!s) return;
    $$('[data-symptom]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.symptom === id)));
    $$('[data-hotspot]').forEach((h) => h.setAttribute('aria-pressed', String(s.parts.includes(h.dataset.hotspot))));
    diagram.dataset.active = id;
    $$('.part', diagram).forEach((p) => p.classList.toggle('on', s.parts.includes(p.dataset.part) || (p.dataset.part === 'door' && s.parts.some((x) => x === 'rollers' || x === 'track'))));
    renderResult(s);
  }

  Object.values(symLists).forEach((list) => list.addEventListener('click', (e) => {
    const b = e.target.closest('[data-symptom]');
    if (!b) return;
    selectSymptom(b.dataset.symptom);
    if (innerWidth < 1024) result.scrollIntoView({ behavior: smooth, block: 'nearest' });
  }));
  $$('[data-hotspot]').forEach((h) => h.addEventListener('click', () => selectSymptom(PART_TO_SYMPTOM[h.dataset.hotspot])));
  $$('[data-pick]').forEach((a) => a.addEventListener('click', () => selectSymptom(a.dataset.pick)));
  selectSymptom('spring');

  /* Door panels ride the real track path: closed → open follows the bend. */
  const track = $('[data-track]', diagram);
  const panels = $$('[data-panel]', diagram);
  const arm = $('[data-arm]', diagram);
  const trolley = $('[data-trolley]', diagram);
  const L = track.getTotalLength();
  const PANEL = 62;
  const CLOSED = 0, HALF = 150, OPEN = Math.min(330, L - PANEL * 4);
  let shift = HALF, anim = null;

  function place(s) {
    shift = s;
    panels.forEach((p, i) => {
      const d = Math.min(L - 1, s + PANEL / 2 + i * PANEL);
      const a = track.getPointAtLength(d);
      const b = track.getPointAtLength(Math.min(L, d + 1));
      const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI + 90;
      p.setAttribute('transform', `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
    });
    // Opener arm follows the top panel; the trolley slides along the rail
    const top = track.getPointAtLength(Math.min(L - 1, s + PANEL * 3.5));
    const tx = Math.max(196, Math.min(440, top.x + 70));
    trolley.setAttribute('x', tx - 13);
    arm.setAttribute('x1', tx); arm.setAttribute('x2', top.x.toFixed(1)); arm.setAttribute('y2', top.y.toFixed(1));
  }
  function moveTo(target, ms = 1400) {
    cancelAnimationFrame(anim);
    if (reduced) return place(target);
    const from = shift, t0 = performance.now();
    const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = (now) => { const t = Math.min(1, (now - t0) / ms); place(from + (target - from) * ease(t)); if (t < 1) anim = requestAnimationFrame(step); };
    anim = requestAnimationFrame(step);
  }
  place(CLOSED);
  const runBtn = $('[data-run-door]');
  const runLabel = $('[data-run-label]');
  runBtn.addEventListener('click', () => {
    const open = shift < OPEN - 1;
    moveTo(open ? OPEN : CLOSED);
    runBtn.setAttribute('aria-pressed', String(open));
    runLabel.textContent = open ? 'Close the door' : 'Open the door';
    runBtn.querySelector('svg').classList.toggle('-rotate-90', !open);
    runBtn.querySelector('svg').classList.toggle('rotate-90', open);
  });
  // First time the diagram is seen, the door rolls halfway up the bend
  if ('IntersectionObserver' in window) {
    const dio = new IntersectionObserver(([e]) => { if (e.isIntersecting) { moveTo(HALF, 1800); dio.disconnect(); } }, { threshold: 0.5 });
    dio.observe(diagram);
  } else place(HALF);

  /* ---------- Steps: the track line draws with scroll ---------- */
  const steps = $('[data-steps]');
  const line = $('[data-steps-line]');
  const dots = $$('[data-step] .step-dot');
  function stepsProgress() {
    const r = steps.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight * 0.85 - r.top) / (r.height * 0.9)));
    if (line) line.style.setProperty('--p', reduced ? 1 : p.toFixed(3));
    dots.forEach((d, i) => d.classList.toggle('!bg-brand-red', reduced || p >= (i + 0.5) / 4.6));
  }
  addEventListener('scroll', stepsProgress, { passive: true });
  stepsProgress();

  /* ---------- Reviews carousel: buttons, drag, keyboard ---------- */
  const rv = $('[data-reviews]');
  const cardStep = () => (rv.querySelector('li')?.getBoundingClientRect().width || 320) + 16;
  $$('[data-rev]').forEach((b) => b.addEventListener('click', () => rv.scrollBy({ left: cardStep() * Number(b.dataset.rev), behavior: smooth })));
  rv.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); rv.scrollBy({ left: cardStep() * (e.key === 'ArrowRight' ? 1 : -1), behavior: smooth }); }
  });
  let drag = null;
  rv.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; drag = { x: e.clientX, left: rv.scrollLeft, moved: false }; });
  addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 4) { drag.moved = true; rv.classList.add('dragging'); }
    rv.scrollLeft = drag.left - dx;
  });
  addEventListener('pointerup', () => {
    if (!drag) return;
    const moved = drag.moved; drag = null;
    rv.classList.remove('dragging');
    if (moved) rv.scrollBy({ left: 0 }); // let snap settle
  });

  /* ---------- Service areas: illustrated route map (73 cities listed on garagedoorasapservice.com) ----------
     Data: ../assets/data/service-area.js (US Census Gazetteer points; miles = straight line from the Clermont base). */
  const AREA = window.GDA_AREA;
  const CITIES = AREA ? AREA.cities.map((c) => c.name) : ['Orlando', 'Kissimmee', 'The Villages', 'Clermont'];
  const PREVIEW = 5;
  const SVGNS = 'http://www.w3.org/2000/svg';
  const norm = (s) => s.toLowerCase().replace(/^st\.?\s/, 'saint ').replace(/[^a-z]/g, '');
  // Geographic groupings only (never county names)
  const regionOf = (c) => (c.y < 430 || c.x >= 600 ? 'coast' : c.y > 790 ? 'south' : c.x < 430 ? 'lake' : 'orlando');
  const REGION_NAME = { orlando: 'around Orlando', lake: 'in Lake & north', coast: 'on the coast & around DeLand', south: 'in Kissimmee & south' };
  const MAJOR = ['Orlando', 'Kissimmee', 'Clermont', 'The Villages', 'Sanford', 'Daytona Beach', 'DeLand', 'Melbourne', 'Titusville', 'Palm Coast'];
  const MINOR_ON_PHONES = ['Sanford', 'DeLand', 'Titusville', 'Palm Coast']; // hidden below 640 px to keep labels comfortable

  const map = $('[data-map]');
  const areaList = $('[data-area-list]');
  const datalist = $('[data-area-datalist]');
  const areaResult = $('[data-area-result]');
  const areaForm = $('[data-area-form]');
  const chips = $$('[data-region]');
  $('[data-area-count]').textContent = CITIES.length;
  const el = (tag, attrs = {}) => { const n = document.createElementNS(SVGNS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); return n; };

  let route, routeUnder, selLabel, truck, truckAnim = 0;
  const cityDots = new Map();
  if (AREA && map) {
    const base = AREA.base;
    map.append(el('path', { d: AREA.florida, class: 'map-land' }));
    const gDots = el('g', { 'aria-hidden': 'true' });
    routeUnder = el('path', { class: 'route route-under', d: '' });
    route = el('path', { class: 'route', d: '' });
    map.append(routeUnder, route, gDots);
    AREA.cities.forEach((c) => {
      const g = el('g', { class: 'city', 'data-city': c.name });
      g.append(el('circle', { cx: c.x, cy: c.y, r: 5, class: 'city-dot' }));
      gDots.append(g);
      cityDots.set(c.name, g);
    });
    const gLabels = el('g', { 'aria-hidden': 'true' });
    AREA.cities.filter((c) => MAJOR.includes(c.name) && c.name !== 'Clermont').forEach((c) => {
      const end = c.x > 740;
      const t = el('text', { x: c.x + (end ? -12 : 12), y: c.y + 6, class: 'map-label' + (MINOR_ON_PHONES.includes(c.name) ? ' map-label-minor' : ''), 'text-anchor': end ? 'end' : 'start' });
      t.textContent = c.name;
      gLabels.append(t);
    });
    selLabel = el('text', { class: 'map-label map-label-sel', x: 0, y: 0 });
    gLabels.append(selLabel);
    map.append(gLabels);
    // Base: Mr. ASAP pin in Clermont
    const pin = el('g', { class: 'map-pin', 'aria-hidden': 'true' });
    const clip = el('clipPath', { id: 'pin-clip' }); clip.append(el('circle', { cx: base.x, cy: base.y - 46, r: 24 }));
    const img = el('image', { href: '../assets/brand/brand-mr-asap-mark.png', x: base.x - 24, y: base.y - 70, width: 48, height: 48, 'clip-path': 'url(#pin-clip)', preserveAspectRatio: 'xMidYMid slice' });
    pin.append(clip, el('path', { d: `M${base.x} ${base.y} l-11 -18 h22 z`, class: 'pin-tip' }), el('circle', { cx: base.x, cy: base.y - 46, r: 28, class: 'pin-ring' }), img);
    const bl = el('text', { x: base.x - 36, y: base.y - 40, class: 'map-label', 'text-anchor': 'end' }); bl.textContent = 'Clermont';
    pin.append(bl);
    map.append(pin);
    // Service truck: a small white van with a red stripe, facing +x, centred on 0,0 (~40 × 22 units)
    truck = el('g', { class: 'truck', 'aria-hidden': 'true', style: 'display:none' });
    truck.innerHTML = '<rect x="-20" y="-11" width="28" height="18" rx="3" fill="#fff" stroke="#2F2D2E" stroke-width="2"/>'
      + '<rect x="-20" y="-3" width="28" height="4" fill="#DB0000"/>'
      + '<path d="M8 -6h7l5 6v8H8z" fill="#fff" stroke="#2F2D2E" stroke-width="2" stroke-linejoin="round"/>'
      + '<path d="M10.5 -4h4l3.5 4h-7.5z" fill="#C0C2C6"/>'
      + '<circle cx="-11" cy="8" r="3.6" fill="#2F2D2E"/><circle cx="13" cy="8" r="3.6" fill="#2F2D2E"/>';
    map.append(truck);

    // Tap anywhere: pick the nearest city within ~24 px (a big touch target on phones)
    map.addEventListener('click', (e) => {
      const m = map.getScreenCTM(); if (!m) return;
      const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
      const reach = 24 / m.a;
      let best = null, bestD = Infinity;
      AREA.cities.forEach((c) => { const d = Math.hypot(c.x - pt.x, c.y - pt.y); if (d < bestD) { bestD = d; best = c; } });
      if (best && bestD <= reach) selectCity(best.name, true);
    });

    // The door rolls up the first time the map is seen
    const door = $('[data-map-door]');
    if (door) {
      if (reduced || !('IntersectionObserver' in window)) door.classList.add('open');
      else {
        const doorIO = new IntersectionObserver(([e]) => { if (e.isIntersecting) { door.classList.add('open'); doorIO.disconnect(); } }, { threshold: 0.35 });
        doorIO.observe(door.parentElement);
      }
    }
  }

  function clearRoute() {
    cancelAnimationFrame(truckAnim);
    if (route) [route, routeUnder].forEach((r) => r.setAttribute('d', ''));
    if (truck) truck.style.display = 'none';
    if (selLabel) selLabel.textContent = '';
  }

  // The truck drives the route; the line draws behind it. Reduced motion: the truck simply appears at the city.
  function driveTruck(L) {
    cancelAnimationFrame(truckAnim);
    const ppu = map.getScreenCTM().a;               // screen px per map unit
    const k = 0.7 / ppu;                            // ~28 px wide at any map size
    const end = Math.max(0, L - 20 / ppu);          // park just before the city dot
    const place = (d) => {
      const a = route.getPointAtLength(Math.max(0, d - 0.5)), b = route.getPointAtLength(Math.min(L, d + 0.5)), p = route.getPointAtLength(d);
      let ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
      const flip = ang > 90 || ang < -90;            // keep the van upright when heading left
      truck.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${k.toFixed(3)} ${(flip ? -k : k).toFixed(3)})`);
      [route, routeUnder].forEach((r) => { r.style.strokeDashoffset = Math.max(0, L - d); });
    };
    truck.style.display = '';
    if (reduced) { place(end); [route, routeUnder].forEach((r) => { r.style.strokeDashoffset = 0; }); return; }
    const t0 = performance.now(), dur = 1400, ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      place(end * ease(t));
      if (t < 1) truckAnim = requestAnimationFrame(step);
      else [route, routeUnder].forEach((r) => { r.style.strokeDashoffset = 0; });
    };
    place(0);
    truckAnim = requestAnimationFrame(step);
  }

  function drawRoute(c) {
    if (!route) return;
    const b = AREA.base, dx = c.x - b.x, dy = c.y - b.y, len = Math.hypot(dx, dy) || 1;
    // a gentle bend, like a garage-door track
    const k = Math.min(0.28, 60 / len + 0.12), cx = (b.x + c.x) / 2 - dy * k, cy = (b.y + c.y) / 2 + dx * k;
    const d = `M${b.x} ${b.y - 18} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${c.x} ${c.y}`;
    [routeUnder, route].forEach((r) => { r.setAttribute('d', d); });
    const L = route.getTotalLength();
    [routeUnder, route].forEach((r) => { r.style.transition = 'none'; r.style.strokeDasharray = L; r.style.strokeDashoffset = L; });
    driveTruck(L);
  }

  function setRegion(id) {
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.region === id)));
    if (!AREA) return;
    map.classList.toggle('has-region', !!id);
    AREA.cities.forEach((c) => cityDots.get(c.name).classList.toggle('in-region', regionOf(c) === id));
  }

  function selectCity(name, fromMap) {
    const c = AREA && AREA.cities.find((x) => x.name === name);
    if (!c) return;
    setRegion(null);
    cityDots.forEach((g, n) => g.classList.toggle('is-on', n === name));
    if (selLabel) {
      const end = c.x > 740;
      selLabel.textContent = MAJOR.includes(name) && name !== 'Clermont' ? '' : name;
      selLabel.setAttribute('x', c.x + (end ? -14 : 14)); selLabel.setAttribute('y', c.y - 10);
      selLabel.setAttribute('text-anchor', end ? 'end' : 'start');
    }
    drawRoute(c);
    areaResult.innerHTML = `<p class="text-lg font-heading text-brand-midnight"></p><p class="mt-1 text-base text-brand-grey-700"></p>
      <div class="mt-4 flex flex-wrap gap-2.5"><a href="tel:+18777877121" class="btn btn-red min-h-[3rem] px-5 text-sm"><svg><use href="#i-phone"/></svg>Call (877) 787-7121</a><a href="#quote" class="btn btn-ghost min-h-[3rem] px-5 text-sm" data-area-quote>Get a quote</a></div>`;
    const [p1, p2] = areaResult.querySelectorAll('p');
    p1.textContent = c.name === 'Clermont' ? 'Yes, we serve Clermont! It’s home: our base is on US-27.' : `Yes, we serve ${c.name}! About ${c.miles} miles from our Clermont base.`;
    p2.textContent = 'Same-day service and 24/7 emergency calls.';
    $('[data-area-quote]', areaResult).addEventListener('click', () => { const f = $('#f-city'); if (f && !f.value) f.value = c.name; });
    if (fromMap) areaForm.area.value = c.name;
  }

  function cityNotFound(q) {
    cityDots.forEach((g) => g.classList.remove('is-on'));
    clearRoute();
    areaResult.innerHTML = '<p class="text-lg font-heading text-brand-midnight"></p><a href="tel:+18777877121" class="btn btn-red mt-4 min-h-[3rem] px-5 text-sm"><svg><use href="#i-phone"/></svg>Call (877) 787-7121</a>';
    areaResult.querySelector('p').textContent = `${q} isn’t on our list, but we often help nearby towns. Call (877) 787-7121 to check.`;
  }

  CITIES.forEach((name, i) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'city-btn';
    b.textContent = name;
    b.addEventListener('click', () => {
      areaForm.area.value = name;
      selectCity(name);
      if (innerWidth < 1024) map.scrollIntoView({ behavior: smooth, block: 'center' });
    });
    li.append(b);
    if (i >= PREVIEW) li.hidden = true;
    areaList.append(li);
    const o = document.createElement('option'); o.value = name; datalist.append(o);
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

  chips.forEach((chip) => chip.addEventListener('click', () => {
    const id = chip.getAttribute('aria-pressed') === 'true' ? null : chip.dataset.region;
    cityDots.forEach((g) => g.classList.remove('is-on'));
    clearRoute();
    setRegion(id);
    if (!id || !AREA) { areaResult.innerHTML = '<p class="text-base leading-relaxed text-brand-grey-700">Search for your city, tap the map, or choose an area.</p>'; return; }
    const list = AREA.cities.filter((c) => regionOf(c) === id);
    areaResult.innerHTML = '<p class="text-lg font-heading text-brand-midnight"></p><p class="mt-1 text-base leading-relaxed text-brand-grey-700"></p>';
    const [p1, p2] = areaResult.querySelectorAll('p');
    p1.textContent = `${list.length} cities ${REGION_NAME[id]}`;
    p2.textContent = `Including ${list.slice(0, 4).map((c) => c.name).join(', ')}. Search or tap the map to see the route from Clermont.`;
  }));

  const findCity = (q) => CITIES.find((c) => norm(c) === norm(q));
  areaForm.area.addEventListener('input', () => { const hit = findCity(areaForm.area.value.trim()); if (hit) selectCity(hit); });
  areaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = areaForm.area.value.trim();
    if (!q) { areaResult.innerHTML = '<p class="text-base font-medium text-brand-red">Please type a city name.</p>'; return; }
    const hit = findCity(q);
    if (hit) selectCity(hit); else cityNotFound(q);
  });

  /* ---------- Quote form (shared GDAForm: validation + honest email/call hand-off) ---------- */
  if (window.GDAForm) GDAForm.init(form, { primaryClass: 'btn btn-red', secondaryClass: 'btn btn-ghost', titleClass: 'text-lg font-title text-brand-midnight' });

  function prefillForm({ service, urgency, message, phone } = {}) {
    if (window.GDAForm) GDAForm.prefill(form, { service, urgency, message });
    if (phone) { const p = $('#f-phone'); p.value = phone; p.dispatchEvent(new Event('blur')); }
    setTimeout(() => $(phone ? '#f-name' : '#f-name').focus({ preventScroll: true }), reduced ? 0 : 700);
  }
  $$('a[href="#quote"][data-urgency], a[href="#quote"][data-message]').forEach((a) =>
    a.addEventListener('click', () => prefillForm({ urgency: a.dataset.urgency, message: a.dataset.message })));

  /* Hero quick quote: validate the phone, then continue in the full form */
  const quick = $('[data-quick]');
  const quickErr = $('[data-quick-err]');
  const quickPhone = $('[data-quick-phone]');
  quick.addEventListener('submit', (e) => {
    e.preventDefault();
    const digits = quickPhone.value.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) {
      quickErr.textContent = 'Please enter a 10-digit phone number so we can call you back.';
      quickPhone.setAttribute('aria-invalid', 'true');
      quickPhone.focus();
      return;
    }
    quickErr.textContent = '';
    quickPhone.removeAttribute('aria-invalid');
    $('#quote').scrollIntoView({ behavior: smooth, block: 'start' });
    prefillForm({ service: $('[data-quick-service]').value, phone: quickPhone.value });
  });

})();
