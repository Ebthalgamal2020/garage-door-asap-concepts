/* V2 — bold brand red. Vanilla JS: menu, reveals, count-ups, hero chips, problem → fix finder, before/after,
   Mr. ASAP safety tips, steps line, spring estimator, reviews carousel, tune-up checklist, city search, two-step quote. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smooth = reduced ? 'auto' : 'smooth';

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

  /* ---------- One entrance per section ---------- */
  const io = 'IntersectionObserver' in window && !reduced
    ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' })
    : null;
  $$('.reveal').forEach((el) => (io ? io.observe(el) : el.classList.add('in')));

  /* ---------- Quote form: two steps (step 2 is first in the source; CSS order shows step 1 first) ---------- */
  const form = $('[data-form]');
  const step1 = $('[data-step="1"]', form);
  const step2 = $('[data-step="2"]', form);
  const problem = $('[name="problem"]', form);
  function showStep(n, focus) {
    step1.hidden = n !== 1;
    step2.hidden = n !== 2;
    $('[data-step-text]', form).textContent = `Step ${n} of 2`;
    $('[data-dot="2"]', form).classList.toggle('bg-brand-red', n === 2);
    $('[data-dot="2"]', form).classList.toggle('bg-brand-grey-300', n !== 2);
    if (focus) (n === 1 ? problem : $('[name="name"]', form)).focus({ preventScroll: true });
  }
  showStep(1);
  $('[data-next]', form).addEventListener('click', () => {
    if (window.GDAForm && !GDAForm.validateField(problem)) { problem.focus(); return; }
    showStep(2, true);
  });
  $('[data-back]', form).addEventListener('click', () => showStep(1, true));
  // Before the shared validator runs: reveal the step that holds the first problem
  form.addEventListener('submit', () => {
    const detailsBad = ['name', 'phone', 'city'].some((n) => window.GDAForm && !GDAForm.validateField($(`[name="${n}"]`, form)));
    if (detailsBad) showStep(2);
    else if (!problem.value) showStep(1);
  }, true);
  if (window.GDAForm) GDAForm.init(form, { primaryClass: 'btn btn-red', secondaryClass: 'btn btn-ghost', titleClass: 'text-lg font-title text-brand-midnight' });

  function startQuote({ service, urgency, details } = {}) {
    if (window.GDAForm) GDAForm.prefill(form, { service, urgency, message: details });
    if (service) problem.removeAttribute('aria-invalid');
    showStep(service ? 2 : 1);
    $('#quote').scrollIntoView({ behavior: smooth, block: 'start' });
    setTimeout(() => (service ? $('[name="name"]', form) : problem).focus({ preventScroll: true }), reduced ? 0 : 700);
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-book], [data-chip], [data-details]');
    if (!a) return;
    e.preventDefault();
    startQuote({ service: a.dataset.book || a.dataset.chip, urgency: a.dataset.urgency, details: a.dataset.details });
  });

  /* ---------- Services: problem → fix ---------- */
  const PROBLEMS = [
    { id: 'bang', icon: 'spring', label: 'Loud bang, door won’t lift', service: 'Spring Replacement', urgent: true,
      text: 'Springs carry the weight of the door. A loud bang followed by a door that won’t open usually means a spring has snapped. We replace it safely, rebalance the door and test it.',
      tip: 'Don’t force the door! If a spring has snapped, nothing is holding the door’s weight.',
      img: '../assets/img/brand-svc-spring-broken.jpg', w: 741, h: 330, alt: 'A broken torsion spring with a visible gap' },
    { id: 'offtrack', icon: 'offtrack', label: 'Door off track or crooked', service: 'Shifted Door Repair', urgent: true,
      text: 'A shifted door is realigned, and its cables, rollers and tracks are inspected and corrected before it goes back into use.',
      tip: 'Don’t open or close it. A shifted door can fall, so keep cars and people clear.',
      img: '../assets/img/brand-svc-shifted.jpg', w: 300, h: 280, alt: 'A garage door that has shifted out of its track' },
    { id: 'cable', icon: 'cable', label: 'Cable snapped or hanging', service: 'Cable Replacement', urgent: true,
      text: 'Lift cables raise the door evenly. A frayed or snapped cable can leave the door crooked or stuck, so we replace it and check the drums and springs.',
      tip: 'Keep clear: cables are under high tension. Don’t run the door until it’s been checked.' },
    { id: 'hum', icon: 'opener', label: 'Opener hums or won’t respond', service: 'Opener Repair', urgent: false,
      text: 'Opener humming, not responding to the remote or wall button, or stopping halfway? We diagnose the motor, controls and settings and repair them on the spot.',
      tip: 'Check the opener has power. If the motor hums but the door won’t move, stop: the spring may have broken.',
      img: '../assets/img/brand-svc-opener.jpg', w: 400, h: 300, alt: 'A garage door opener mounted on the ceiling' },
    { id: 'reverse', icon: 'alert', label: 'Door reverses or won’t close', service: 'Opener Repair', urgent: false,
      text: 'A door that reverses before it closes is often the safety sensors near the floor: misaligned, dirty or damaged. We realign or replace them and test the safety reverse.',
      tip: 'Make sure nothing blocks the beam between the two sensors near the floor, and that the lenses are clean.' },
    { id: 'noisy', icon: 'noise', label: 'Grinding, squeaking or shaking', service: 'Roller Replacement', urgent: false,
      text: 'Worn or noisy rollers make a door shudder and grind. New rollers restore smooth, quiet travel along the track.',
      tip: 'Book a visit before small wear becomes a bigger repair.',
      img: '../assets/img/brand-svc-rollers.jpg', w: 300, h: 244, alt: 'A set of garage door rollers' },
    { id: 'old', icon: 'new', label: 'Opener old or unreliable', service: 'Opener Replacement', urgent: false,
      text: 'When an opener reaches the end of its life, we supply, install, program and test a new one, set up properly and safely.',
      tip: 'Ask us to compare repairing your current opener with replacing it.',
      img: '../assets/img/brand-svc-opener-new.jpg', w: 360, h: 360, alt: 'A new garage door opener unit' },
    { id: 'tuneup', icon: 'wrench', label: 'Just want a tune-up', service: 'General Maintenance', urgent: false,
      text: 'Our 29-point tune-up: hardware tightened, moving parts lubricated, balance and safety sensors checked, so the door stays quiet and lasts longer.',
      tip: 'Regular maintenance helps catch worn parts before they fail.',
      img: '../assets/img/brand-svc-maintenance.jpg', w: 259, h: 194, alt: 'Garage door hardware being serviced' }
  ];
  const group = $('[data-problems]');
  const fix = $('[data-fix]');
  PROBLEMS.forEach((p, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'prob';
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', 'false');
    b.tabIndex = i === 0 ? 0 : -1;
    b.dataset.problem = p.id;
    b.innerHTML = `<span class="dot" aria-hidden="true"></span><span class="pic" aria-hidden="true"><svg><use href="#i-${p.icon}"/></svg></span><span class="flex-1" data-l></span>`;
    $('[data-l]', b).textContent = p.label;
    group.append(b);
  });
  const rows = $$('[role="radio"]', group);

  function renderFix(p) {
    fix.classList.remove('fix-swap'); void fix.offsetWidth; if (!reduced) fix.classList.add('fix-swap');
    fix.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm font-heading text-brand-grey-700">The likely fix</p>
        <span class="label ${p.urgent ? 'label-urgent' : ''}">${p.urgent ? 'Urgent: call now' : 'Book a visit'}</span>
      </div>
      <h3 class="mt-1 text-2xl font-heading" data-fix-title></h3>
      <div class="mt-5 grid gap-5 sm:grid-cols-[1fr_1.1fr] sm:items-start">
        ${p.img
          ? `<div class="fix-photo"><img loading="lazy" decoding="async" data-fix-img></div>`
          : `<div class="fix-photo"><svg class="h-20 w-20 text-brand-red" aria-hidden="true"><use href="#i-${p.icon}"/></svg></div>`}
        <div>
          <p class="leading-relaxed text-brand-grey-700" data-fix-text></p>
          <div class="mt-4 flex items-start gap-3">
            <img src="../assets/brand/brand-mr-asap-mark.png" alt="" width="160" height="160" class="h-10 w-10 shrink-0 rounded-full bg-brand-grey-100 ring-1 ring-brand-grey-200">
            <p class="text-sm leading-snug text-brand-ink"><strong class="block font-heading text-brand-midnight">Safety tip</strong><span data-fix-tip></span></p>
          </div>
        </div>
      </div>
      <div class="mt-6 flex flex-wrap gap-3">
        <a href="#quote" class="btn btn-red" data-book-fix>Book this fix</a>
        <a href="tel:+18777877121" class="btn btn-ghost"><svg><use href="#i-phone"/></svg><span class="tnum">Call (877) 787-7121</span></a>
      </div>`;
    $('[data-fix-title]', fix).textContent = p.service;
    $('[data-fix-text]', fix).textContent = p.text;
    $('[data-fix-tip]', fix).textContent = ' ' + p.tip;
    const img = $('[data-fix-img]', fix);
    if (img) { img.width = p.w; img.height = p.h; img.alt = p.alt; img.src = p.img; }
    $('[data-book-fix]', fix).addEventListener('click', (e) => {
      e.preventDefault();
      startQuote({ service: p.service, urgency: p.urgent ? 'Emergency — as soon as possible' : undefined });
    });
  }
  function selectProblem(i, { focus = false, scroll = false } = {}) {
    rows.forEach((r, j) => { r.setAttribute('aria-checked', String(j === i)); r.tabIndex = j === i ? 0 : -1; });
    if (focus) rows[i].focus();
    renderFix(PROBLEMS[i]);
    if (scroll && innerWidth < 1024) $('[data-fix-wrap]').scrollIntoView({ behavior: smooth, block: 'nearest' });
  }
  group.addEventListener('click', (e) => { const r = e.target.closest('[role="radio"]'); if (r) selectProblem(rows.indexOf(r), { scroll: true }); });
  group.addEventListener('keydown', (e) => {
    const i = rows.indexOf(document.activeElement);
    if (i < 0) return;
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (e.key in keys) { e.preventDefault(); selectProblem((i + keys[e.key] + rows.length) % rows.length, { focus: true }); }
    else if (e.key === 'Home') { e.preventDefault(); selectProblem(0, { focus: true }); }
    else if (e.key === 'End') { e.preventDefault(); selectProblem(rows.length - 1, { focus: true }); }
  });
  selectProblem(0);

  /* ---------- FAQ: four first, the rest on request ---------- */
  const moreFaq = $('[data-more-faq]');
  const extraFaq = $$('[data-more]');
  extraFaq.forEach((d) => { d.hidden = true; });
  moreFaq.addEventListener('click', () => {
    const open = moreFaq.getAttribute('aria-expanded') !== 'true';
    extraFaq.forEach((d) => { d.hidden = !open; });
    moreFaq.setAttribute('aria-expanded', String(open));
    moreFaq.textContent = open ? 'Fewer questions' : 'More questions';
    if (open) extraFaq[0].querySelector('summary').focus();
  });

  /* ---------- Mr. ASAP safety tips (manual) ---------- */
  const TIPS = [
    'Don’t force the door. If a spring has snapped, nothing is holding the door’s weight.',
    'Springs and cables are under extreme tension. Keep clear and don’t try to adjust them yourself.',
    'If the door is off track, don’t open or close it. Keep cars and people clear until it’s been checked.',
    'Door reversing? Check nothing is blocking the beam between the two safety sensors near the floor.'
  ];
  let tip = 0;
  const tipEl = $('[data-tip]');
  $$('[data-tip-step]').forEach((b) => b.addEventListener('click', () => {
    tip = (tip + Number(b.dataset.tipStep) + TIPS.length) % TIPS.length;
    tipEl.textContent = TIPS[tip];
    $('[data-tip-count]').textContent = `${tip + 1} / ${TIPS.length}`;
    tipEl.classList.remove('tip-swap'); void tipEl.offsetWidth; if (!reduced) tipEl.classList.add('tip-swap');
  }));

  /* ---------- Spring life estimator (verified cycle figures) ---------- */
  const uses = $('[data-uses]');
  const yrs = (cycles) => (cycles / (Number(uses.value) * 365)).toFixed(1);
  function estimate() {
    $('[data-uses-out]').textContent = `${uses.value}× a day`;
    $('[data-yrs="10000"]').textContent = `≈ ${yrs(10000)} yrs`;
    $('[data-yrs="10000-20000"]').textContent = `≈ ${yrs(10000)}–${yrs(20000)} yrs`;
    $('[data-yrs="50000"]').textContent = `≈ ${yrs(50000)} yrs`;
    uses.style.background = `linear-gradient(90deg, #DB0000 ${((uses.value - 1) / 9) * 100}%, rgba(255,255,255,.15) 0)`;
  }
  uses.addEventListener('input', estimate);
  estimate();

  /* ---------- Reviews carousel (no autoplay) ---------- */
  const rv = $('[data-reviews]');
  const stepW = () => (rv.querySelector('li')?.getBoundingClientRect().width || 320) + 16;
  $$('[data-rev]').forEach((b) => b.addEventListener('click', () => rv.scrollBy({ left: stepW() * Number(b.dataset.rev), behavior: smooth })));
  rv.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); rv.scrollBy({ left: stepW() * (e.key === 'ArrowRight' ? 1 : -1), behavior: smooth }); }
  });

  /* ---------- 29-point tune-up ---------- */
  const PREVIEW = 6;
  const tabs = $$('[data-tab]');
  const lists = $$('[data-list]');
  const showAllBtn = $('[data-show-all]');
  let showAll = false;
  lists.forEach((ul) => $$('li', ul).forEach((li) => {
    li.className = 'flex items-start gap-3 border-b border-brand-grey-100 py-3 text-[0.95rem] leading-snug';
    li.insertAdjacentHTML('afterbegin', '<span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-red text-white" aria-hidden="true"><svg class="h-3 w-3"><use href="#i-check"/></svg></span>');
  }));
  function paintList() {
    lists.forEach((ul) => $$('li', ul).forEach((li, i) => { li.hidden = !showAll && i >= PREVIEW; }));
    showAllBtn.setAttribute('aria-expanded', String(showAll));
    showAllBtn.textContent = showAll ? 'Show fewer' : 'Show all 29 points';
  }
  function selectTab(t, focus) {
    tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !on; });
    if (focus) t.focus();
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(t));
    t.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); selectTab(tabs[(i + 1) % tabs.length], true); } });
  });
  showAllBtn.addEventListener('click', () => { showAll = !showAll; paintList(); });
  paintList();

  /* ---------- Service areas: minimal drawn map ----------
     Data: ../assets/data/service-area.js (73 cities from garagedoorasapservice.com; miles = straight line from the Clermont base).
     Florida outline drawn from Natural Earth (public domain). No third-party requests. */
  const AREA = window.GDA_AREA || { base: { x: 291.6, y: 709.9 }, cities: [], florida: '' };
  const CITIES = AREA.cities;
  const SVGNS = 'http://www.w3.org/2000/svg';
  const norm = (str) => str.toLowerCase().replace(/^st\.?\s/, 'saint ').replace(/[^a-z]/g, '');
  const svg = $('[data-svgmap]');
  const REST = [60, 60, 860, 940];
  const LABELLED = ['Orlando', 'Clermont', 'The Villages', 'Daytona Beach', 'Kissimmee', 'Melbourne'];
  const el = (tag, attrs) => { const n = document.createElementNS(SVGNS, tag); Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v)); return n; };
  $('[data-land]', svg).setAttribute('d', AREA.florida);

  // Base pin: the Mr. ASAP mark in a white ring, with its label
  const bx = AREA.base.x, by = AREA.base.y;
  const basePin = $('[data-base]', svg);
  basePin.append(
    el('circle', { cx: bx, cy: by, r: 21, fill: '#FFFFFF', stroke: '#2F2D2E', 'stroke-width': 1.5 }),
    el('clipPath', { id: 'base-clip' }),
    el('image', { href: '../assets/brand/brand-mr-asap-mark.png', x: bx - 18, y: by - 18, width: 36, height: 36, 'clip-path': 'url(#base-clip)' })
  );
  $('#base-clip', basePin).append(el('circle', { cx: bx, cy: by, r: 18 }));
  const baseLabel = el('text', { x: bx, y: by - 30, 'text-anchor': 'middle', class: 'map-label map-label-base' });
  baseLabel.textContent = 'Our base · Clermont';
  basePin.append(baseLabel);

  // Dots and labels
  const dotsG = $('[data-dots]', svg), labelsG = $('[data-labels]', svg);
  const byName = new Map();
  const areaList = $('[data-area-list]');
  const card = $('[data-area-card]');
  const PREVIEW_CITIES = 8;
  $('[data-area-count]').textContent = CITIES.length;
  const dl = $('[data-city-datalist]');
  CITIES.forEach((c, i) => {
    const g = el('g', { class: 'city', 'data-city': c.name });
    const halo = el('circle', { cx: c.x, cy: c.y, r: 6, class: 'halo' });
    const dot = el('circle', { cx: c.x, cy: c.y, r: 4.5, class: 'dot' });
    const hit = el('circle', { cx: c.x, cy: c.y, r: 12, class: 'hit' });
    g.append(halo, dot, hit);
    dotsG.append(g);
    $('[data-coverage]', svg).append(el('circle', { cx: c.x, cy: c.y, r: 30 }));
    const east = c.x > 780;
    const label = el('text', { x: east ? c.x - 9 : c.x + 9, y: c.y + 4, 'text-anchor': east ? 'end' : 'start', class: 'map-label' + (LABELLED.includes(c.name) && c.name !== 'Clermont' ? '' : ' map-label-hidden') + (/^(The Villages|Kissimmee)$/.test(c.name) ? ' map-label-minor' : '') });
    label.textContent = c.name;
    labelsG.append(label);
    hit.addEventListener('click', () => selectCity(c, { zoom: true }));

    const li = document.createElement('li');
    li.innerHTML = '<button type="button" class="city-row" aria-pressed="false"><span data-n></span><span class="tnum text-xs text-brand-grey-700" data-m></span></button>';
    $('[data-n]', li).textContent = c.name;
    $('[data-m]', li).textContent = `${c.miles} mi`;
    if (i >= PREVIEW_CITIES) li.hidden = true;
    const btn = $('button', li);
    btn.addEventListener('click', () => selectCity(c, { zoom: true }));
    areaList.append(li);
    byName.set(norm(c.name), { city: c, btn, g, label, li });
    const o = document.createElement('option'); o.value = c.name; dl.append(o);
  });
  const areaToggle = $('[data-area-toggle]');
  areaToggle.addEventListener('click', () => {
    const open = areaToggle.getAttribute('aria-expanded') !== 'true';
    $$('li', areaList).forEach((li, i) => { if (i >= PREVIEW_CITIES) li.hidden = !open && li.querySelector('[aria-pressed="true"]') === null; });
    areaToggle.setAttribute('aria-expanded', String(open));
    areaToggle.textContent = open ? 'Show fewer cities' : `Show all ${CITIES.length} cities`;
  });

  // Gentle viewBox animation (instant under reduced motion)
  let vb = REST.slice(), anim = 0;
  const setVB = (v) => { vb = v; svg.setAttribute('viewBox', v.map((n) => +n.toFixed(1)).join(' ')); const k = v[2] / REST[2]; svg.style.setProperty('--k', k.toFixed(3)); basePin.setAttribute('transform', `translate(${bx} ${by}) scale(${k.toFixed(3)}) translate(${-bx} ${-by})`); };
  setVB(REST);
  const spot = $('[data-spot]', svg), dim = $('[data-dim]', svg);
  let spotXY = [bx, by];
  const setSpot = ([x, y]) => { spotXY = [x, y]; spot.setAttribute('cx', x.toFixed(1)); spot.setAttribute('cy', y.toFixed(1)); };
  setSpot(spotXY);
  function zoomTo(target, spotTo) {
    cancelAnimationFrame(anim);
    if (reduced) { setVB(target); if (spotTo) setSpot(spotTo); return; }
    const from = vb.slice(), sFrom = spotXY.slice(), t0 = performance.now(), ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const t = Math.min(1, (now - t0) / 600), e = ease(t);
      setVB(from.map((f, i) => f + (target[i] - f) * e));
      if (spotTo) setSpot([sFrom[0] + (spotTo[0] - sFrom[0]) * e, sFrom[1] + (spotTo[1] - sFrom[1]) * e]);
      if (t < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  }
  const resetBtn = $('[data-map-reset]');
  function clearActive() {
    byName.forEach(({ btn, g, label, city }) => {
      btn.setAttribute('aria-pressed', 'false');
      g.classList.remove('active');
      label.classList.toggle('map-label-hidden', !(LABELLED.includes(city.name) && city.name !== 'Clermont'));
      label.classList.remove('map-label-active');
    });
  }
  resetBtn.addEventListener('click', () => { clearActive(); svg.classList.remove('spotlit'); card.hidden = true; zoomTo(REST); resetBtn.hidden = true; });

  function selectCity(c, { zoom = false } = {}) {
    const entry = byName.get(norm(c.name));
    clearActive();
    entry.btn.setAttribute('aria-pressed', 'true');
    entry.li.hidden = false;
    entry.g.classList.remove('active'); void entry.g.getBBox(); entry.g.classList.add('active');
    entry.label.classList.remove('map-label-hidden'); entry.label.classList.add('map-label-active');
    dotsG.append(entry.g);
    card.innerHTML = `<p class="flex items-center gap-2 font-heading text-brand-midnight"><svg class="h-5 w-5 shrink-0 text-brand-red" aria-hidden="true"><use href="#i-check"/></svg>Yes, we serve <span data-c></span></p>
      <p class="mt-1 text-sm text-brand-grey-700">About <span class="tnum" data-mi></span> miles from our Clermont base (straight line).</p>
      <div class="mt-4 flex flex-wrap gap-2"><a href="tel:+18777877121" class="btn btn-red btn-sm"><svg><use href="#i-phone"/></svg>Call</a><a href="#quote" class="btn btn-ghost btn-sm" data-area-quote>Get a quote</a></div>`;
    $('[data-c]', card).textContent = c.name;
    $('[data-mi]', card).textContent = c.miles;
    card.hidden = false;
    $('[data-area-quote]', card).addEventListener('click', (e) => { e.preventDefault(); $('[name="city"]', form).value = c.name; startQuote({}); });
    svg.classList.add('spotlit');
    if (!zoom) setSpot([c.x, c.y]);
    if (zoom) {
      // Frame the city and the base together, never tighter than 360 units wide
      const minX = Math.min(c.x, bx), maxX = Math.max(c.x, bx), minY = Math.min(c.y, by), maxY = Math.max(c.y, by);
      const w = Math.max(360, (maxX - minX) + 180), h = w * (REST[3] / REST[2]);
      zoomTo([(minX + maxX) / 2 - w / 2, (minY + maxY) / 2 - h / 2 - 20, w, h], [c.x, c.y]);
      resetBtn.hidden = false;
    }
  }
  function unknownCity(q) {
    clearActive();
    svg.classList.remove('spotlit');
    card.innerHTML = `<p class="font-heading text-brand-midnight"><span data-q></span> isn’t on our list yet</p>
      <p class="mt-1 text-sm text-brand-grey-700">We often help nearby towns, so call us to check.</p>
      <a href="tel:+18777877121" class="btn btn-red btn-sm mt-4"><svg><use href="#i-phone"/></svg><span class="tnum">(877) 787-7121</span></a>`;
    $('[data-q]', card).textContent = q;
    card.hidden = false;
  }

  svg.addEventListener('click', (e) => {
    if (e.target.classList.contains('hit')) return;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
    const pxPerUnit = svg.getBoundingClientRect().width / vb[2];
    let best = null, bestD = Infinity;
    CITIES.forEach((c) => { const d = Math.hypot(c.x - pt.x, c.y - pt.y) * pxPerUnit; if (d < bestD) { bestD = d; best = c; } });
    if (best && bestD <= 24) selectCity(best, { zoom: true });
  });

  // Search with suggestions (combobox + listbox)
  const areaForm = $('[data-area-form]');
  const input = $('[data-area-input]');
  const sug = $('[data-area-suggest]');
  let active = -1, matches = [];
  function closeSug() { sug.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); active = -1; }
  function paintSug() {
    sug.innerHTML = '';
    matches.forEach((c, i) => {
      const li = document.createElement('li');
      li.id = `sug-${i}`;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i === active));
      li.className = `cursor-pointer rounded-lg px-3 py-2 text-[0.95rem] ${i === active ? 'bg-brand-red-tint text-brand-red-deep' : 'hover:bg-brand-grey-50'}`;
      li.textContent = c.name;
      li.addEventListener('mousedown', (e) => { e.preventDefault(); input.value = c.name; closeSug(); check(); });
      sug.append(li);
    });
    sug.hidden = !matches.length;
    input.setAttribute('aria-expanded', String(!!matches.length));
    if (active >= 0) input.setAttribute('aria-activedescendant', `sug-${active}`); else input.removeAttribute('aria-activedescendant');
  }
  input.addEventListener('input', () => {
    const q = norm(input.value);
    svg.classList.toggle('searching', !!q);
    byName.forEach(({ g, city }) => g.classList.toggle('match', !!q && norm(city.name).startsWith(q)));
    matches = q ? CITIES.filter((c) => norm(c.name).includes(q)).slice(0, 6) : [];
    active = -1;
    paintSug();
  });
  input.addEventListener('keydown', (e) => {
    if (sug.hidden || !matches.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); active = (active + 1) % matches.length; paintSug(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); active = (active - 1 + matches.length) % matches.length; paintSug(); }
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); input.value = matches[active].name; closeSug(); check(); }
    else if (e.key === 'Escape') { closeSug(); }
  });
  input.addEventListener('blur', () => setTimeout(closeSug, 120));
  function check() {
    svg.classList.remove('searching');
    const q = input.value.trim();
    if (!q) { card.innerHTML = '<p class="text-sm font-heading text-brand-red">Please type a city name.</p>'; card.hidden = false; return; }
    const hit = byName.get(norm(q));
    if (hit) selectCity(hit.city, { zoom: true }); else unknownCity(q);
  }
  areaForm.addEventListener('submit', (e) => { e.preventDefault(); closeSug(); check(); });

})();
