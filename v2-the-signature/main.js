/* V2 "The Signature" — vanilla JS. Menu, entrances, hero intents, services gallery, before/after, spring estimator,
   steps line, tune-up checklist, review filters + carousel, city combobox, three-step quote with live summary. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smooth = reduced ? 'auto' : 'smooth';
  const desktop = matchMedia('(min-width: 1024px)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

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
  desktop.addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- One entrance per section ---------- */
  const io = 'IntersectionObserver' in window && !reduced
    ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' })
    : null;
  $$('.reveal, .mask').forEach((el) => (io ? io.observe(el) : el.classList.add('in')));
  function onSeen(el, fn, threshold = 0.35) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) return fn();
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { fn(); o.disconnect(); } }, { threshold });
    o.observe(el);
  }

  /* ---------- Magnetic hover on the main hero CTA only (desktop, fine pointer) ---------- */
  if (!reduced && finePointer.matches) {
    $$('.magnetic').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${((e.clientX - r.left) / r.width - 0.5) * 8}px, ${((e.clientY - r.top) / r.height - 0.5) * 6}px)`;
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }

  /* ---------- Gentle parallax on the hero photo ---------- */
  const par = $('[data-parallax]');
  if (par && !reduced) {
    let tick = false;
    addEventListener('scroll', () => {
      if (tick) return; tick = true;
      requestAnimationFrame(() => { par.style.transform = `translateY(${Math.min(scrollY, 700) * 0.05}px)`; tick = false; });
    }, { passive: true });
  }

  /* ---------- Hero: "How can we help today?" ---------- */
  const tabs = $$('[data-intent]');
  const segInd = $('[data-seg-ind]');
  function moveIndicator() {
    const t = tabs.find((x) => x.getAttribute('aria-selected') === 'true');
    if (!t || !segInd) return;
    segInd.style.setProperty('--x', t.offsetLeft + 'px');
    segInd.style.setProperty('--w', t.offsetWidth + 'px');
  }
  function setIntent(id, focus) {
    tabs.forEach((t) => {
      const on = t.dataset.intent === id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    $$('[data-intent-panel]').forEach((p) => { p.hidden = p.dataset.intentPanel !== id; });
    $$('[data-intent-photo]').forEach((img) => img.classList.toggle('on', img.dataset.intentPhoto === id));
    moveIndicator();
  }
  moveIndicator();
  addEventListener('resize', moveIndicator);
  document.fonts?.ready.then(moveIndicator);
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => setIntent(t.dataset.intent));
    t.addEventListener('keydown', (e) => {
      const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (k) { e.preventDefault(); setIntent(tabs[(i + k + tabs.length) % tabs.length].dataset.intent, true); }
      if (e.key === 'Home') { e.preventDefault(); setIntent(tabs[0].dataset.intent, true); }
      if (e.key === 'End') { e.preventDefault(); setIntent(tabs[tabs.length - 1].dataset.intent, true); }
    });
  });

  /* ---------- Services: centre-stage carousel (scroll-snap + drag + keys + tabs) ---------- */
  const car = $('[data-car]');
  const cTrack = $('[data-car-track]');
  const slides = $$('[data-slide]', cTrack);
  const cLive = $('[data-car-live]');
  const cCount = $('[data-car-count]');
  const cProg = $('[data-car-progress]');
  const cSteps = $$('[data-car-step]', car);
  const goBtns = $$('[data-go]', car);
  let cur = -1, settle;
  const centerOf = (i) => slides[i].offsetLeft + slides[i].offsetWidth / 2 - cTrack.clientWidth / 2;
  function setActive(i, announce) {
    if (i === cur) return;
    cur = i;
    slides.forEach((s, k) => {
      s.classList.toggle('is-active', k === i);
      $$('a, button', s).forEach((el) => { el.tabIndex = k === i ? 0 : -1; });
    });
    cCount.textContent = String(i + 1).padStart(2, '0');
    cProg.style.setProperty('--p', ((i + 1) / slides.length).toFixed(4));
    goBtns.forEach((b) => b.setAttribute('aria-current', String(Number(b.dataset.go) === i)));
    cSteps[0].disabled = i === 0;
    cSteps[1].disabled = i === slides.length - 1;
    cSteps.forEach((b) => b.setAttribute('aria-controls', slides[Math.min(slides.length - 1, Math.max(0, i + Number(b.dataset.carStep)))].id));
    if (announce) cLive.textContent = `Slide ${i + 1} of ${slides.length}: ${slides[i].dataset.name}`;
  }
  function goSlide(i, behavior = smooth) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    cTrack.scrollTo({ left: centerOf(i), behavior });
    setActive(i, true);
  }
  const nearest = () => slides.reduce((best, _, k) => (Math.abs(centerOf(k) - cTrack.scrollLeft) < Math.abs(centerOf(best) - cTrack.scrollLeft) ? k : best), 0);
  cTrack.addEventListener('scroll', () => {
    if (cTrack.classList.contains('dragging')) return;
    clearTimeout(settle);
    settle = setTimeout(() => setActive(nearest(), true), 90);
  }, { passive: true });
  cSteps.forEach((b) => b.addEventListener('click', () => goSlide(cur + Number(b.dataset.carStep))));
  goBtns.forEach((b) => b.addEventListener('click', () => goSlide(Number(b.dataset.go))));
  cTrack.addEventListener('keydown', (e) => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (k && e.target === cTrack) { e.preventDefault(); goSlide(cur + k); }
    if (e.key === 'Home' && e.target === cTrack) { e.preventDefault(); goSlide(0); }
    if (e.key === 'End' && e.target === cTrack) { e.preventDefault(); goSlide(slides.length - 1); }
  });
  // Click a dimmed neighbour to bring it to centre stage
  slides.forEach((s, k) => s.addEventListener('click', (e) => { if (k !== cur) { e.preventDefault(); goSlide(k); } }));
  // Mouse drag (touch uses native swipe + snap)
  let drag = null, dragged = false;
  cTrack.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    drag = { x: e.clientX, left: cTrack.scrollLeft }; dragged = false;
  });
  addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!dragged && Math.abs(dx) > 6) { dragged = true; cTrack.classList.add('dragging'); }
    if (dragged) cTrack.scrollLeft = drag.left - dx;
  });
  addEventListener('pointerup', () => {
    if (!drag) return;
    drag = null;
    if (dragged) { cTrack.classList.remove('dragging'); goSlide(nearest()); }
  });
  cTrack.addEventListener('click', (e) => { if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; } }, true);
  addEventListener('resize', () => goSlide(Math.max(cur, 0), 'auto'));
  goSlide(0, 'auto');
  cLive.textContent = '';
  $$('[data-open-svc]').forEach((a) => a.addEventListener('click', () => setTimeout(() => goSlide(Number(a.dataset.openSvc)), reduced ? 0 : 500)));

  /* ---------- Before / after ---------- */
  const ba = $('[data-ba]');
  const baRange = $('[data-ba-range]');
  let baTouched = false;
  function setBA(v) {
    ba.style.setProperty('--pos', v + '%');
    ba.style.setProperty('--pn', (v / 100).toFixed(3));
    baRange.value = Math.round(v);
    baRange.setAttribute('aria-valuetext', `${Math.round(v)}% before`);
  }
  baRange.addEventListener('input', () => { baTouched = true; setBA(Number(baRange.value)); });
  baRange.addEventListener('keydown', (e) => {
    const k = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5 }[e.key];
    if (k) { e.preventDefault(); baTouched = true; setBA(Math.max(0, Math.min(100, Number(baRange.value) + k))); }
  });
  setBA(50);
  // A gentle one-time hint the first time the slider is seen
  if (!reduced) onSeen(ba, () => {
    const t0 = performance.now();
    const step = (now) => {
      if (baTouched) return;
      const t = Math.min(1, (now - t0) / 1800);
      setBA(50 + Math.sin(t * Math.PI * 2) * 14 * (1 - t));
      if (t < 1) requestAnimationFrame(step); else setBA(50);
    };
    setTimeout(() => requestAnimationFrame(step), 500);
  }, 0.6);

  /* ---------- Spring life estimator (verified cycle figures from the live spring page) ---------- */
  const uses = $('[data-uses]');
  const usesOut = $('[data-uses-out]');
  const rangeWrap = $('[data-range-wrap]');
  const bubble = $('[data-uses-bubble]');
  const yrs = (cycles, perDay) => (cycles / (perDay * 365)).toFixed(1);
  function estimate() {
    const n = Number(uses.value);
    usesOut.textContent = n;
    rangeWrap.style.setProperty('--f', ((n - 1) / 9).toFixed(4));
    bubble.textContent = `${n}× a day`;
    uses.setAttribute('aria-valuetext', `${n} time${n > 1 ? 's' : ''} a day`);
    $$('[data-years]').forEach((el) => {
      const [a, b] = el.dataset.years.split('-').map(Number);
      el.textContent = b ? `≈ ${yrs(a, n)}–${yrs(b, n)} years` : (a === 50000 ? `up to ≈ ${yrs(a, n)} years` : `≈ ${yrs(a, n)} years`);
    });
  }
  uses.addEventListener('input', estimate);
  estimate();
  const bars = $$('.bar-fill');
  const fillBars = () => bars.forEach((b) => b.style.setProperty('--s', b.style.getPropertyValue('--t')));
  reduced ? fillBars() : onSeen($('[data-bars]'), fillBars);

  /* ---------- How it works: line fills as you scroll ---------- */
  const steps = $('[data-steps]');
  const stepsFill = $('[data-steps-fill]');
  function stepsProgress() {
    const r = steps.getBoundingClientRect();
    const p = reduced ? 1 : Math.max(0, Math.min(1, (innerHeight * 0.8 - r.top) / (r.height * 0.75)));
    stepsFill.style.setProperty('--p', p.toFixed(3));
  }
  addEventListener('scroll', stepsProgress, { passive: true });
  stepsProgress();

  /* ---------- Rings + count ---------- */
  $$('[data-ring]').forEach((r) => (reduced ? r.classList.add('ring-on') : onSeen(r, () => r.classList.add('ring-on'), 0.5)));
  const count = $('[data-count]');
  if (count && !reduced) {
    count.textContent = '0';
    onSeen(count, () => {
      const t0 = performance.now(), end = Number(count.dataset.count);
      const step = (now) => { const t = Math.min(1, (now - t0) / 1100); count.textContent = Math.round(end * (1 - Math.pow(1 - t, 3))); if (t < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }, 0.6);
  }

  /* ---------- Tune-up checklist: tabs + show all ---------- */
  const PREVIEW = 8;
  const tabBtns = $$('[data-tab]');
  const tabPanels = $$('[data-tabpanel]');
  const toggleAll = $('[data-checklist-toggle]');
  let showAll = false;
  $$('[data-checklist] li').forEach((li) => {
    li.className = 'flex items-start gap-3 border-b border-brand-grey-100 py-3 text-[0.95rem] leading-snug';
    li.insertAdjacentHTML('afterbegin', '<span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-red/10 text-brand-red" aria-hidden="true"><svg class="h-3 w-3"><use href="#i-check"/></svg></span>');
  });
  function paintChecklist() {
    const panel = tabPanels.find((p) => !p.hidden);
    const items = $$('li', panel);
    items.forEach((li, i) => { li.hidden = !showAll && i >= PREVIEW; });
    toggleAll.hidden = items.length <= PREVIEW;
    toggleAll.setAttribute('aria-expanded', String(showAll));
    toggleAll.textContent = showAll ? 'Show fewer' : `Show all ${items.length}`;
  }
  function selectTab(i, focus) {
    tabBtns.forEach((b, j) => { b.setAttribute('aria-selected', String(i === j)); b.tabIndex = i === j ? 0 : -1; });
    tabPanels.forEach((p, j) => { p.hidden = i !== j; });
    if (focus) tabBtns[i].focus();
    paintChecklist();
  }
  tabBtns.forEach((b, i) => {
    b.addEventListener('click', () => selectTab(i));
    b.addEventListener('keydown', (e) => {
      const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (k) { e.preventDefault(); selectTab((i + k + tabBtns.length) % tabBtns.length, true); }
    });
  });
  toggleAll.addEventListener('click', () => { showAll = !showAll; paintChecklist(); });
  paintChecklist();

  /* ---------- Reviews: topic filters + manual carousel ---------- */
  const track = $('[data-track]');
  const cards = $$('li', track);
  const rvStatus = $('[data-rv-status]');
  const [prev, next] = [$('[data-rv="-1"]'), $('[data-rv="1"]')];
  let rvIndex = 0;
  const visibleCards = () => cards.filter((c) => !c.hidden);
  const perView = () => (desktop.matches ? 2 : 1);
  function paintReviews() {
    const vis = visibleCards();
    const max = Math.max(0, vis.length - perView());
    rvIndex = Math.min(Math.max(rvIndex, 0), max);
    track.style.transform = vis[rvIndex] ? `translateX(${-vis[rvIndex].offsetLeft}px)` : '';
    vis.forEach((c, i) => {
      const inView = i >= rvIndex && i < rvIndex + perView();
      c.setAttribute('aria-hidden', String(!inView));
      $$('a, button', c).forEach((el) => { el.tabIndex = inView ? 0 : -1; });
    });
    prev.disabled = rvIndex === 0;
    next.disabled = rvIndex >= max;
    const last = Math.min(vis.length, rvIndex + perView());
    rvStatus.textContent = vis.length ? `Showing review${last - rvIndex > 1 ? 's' : ''} ${rvIndex + 1}${last - rvIndex > 1 ? '–' + last : ''} of ${vis.length}` : 'No reviews for this topic';
  }
  prev.addEventListener('click', () => { rvIndex -= 1; paintReviews(); });
  next.addEventListener('click', () => { rvIndex += 1; paintReviews(); });
  $$('[data-filter]').forEach((f) => f.addEventListener('click', () => {
    $$('[data-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x === f)));
    cards.forEach((c) => { c.hidden = f.dataset.filter !== 'all' && !c.dataset.topics.split(' ').includes(f.dataset.filter); });
    rvIndex = 0;
    paintReviews();
  }));
  // Swipe on touch
  let sx = null;
  track.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 40) { rvIndex += dx < 0 ? 1 : -1; paintReviews(); }
  });
  addEventListener('resize', paintReviews);
  paintReviews();

  /* ---------- Service areas: 73 cities listed on garagedoorasapservice.com ---------- */
  const CITIES = ['Orlando', 'Kissimmee', 'The Villages', 'Clermont', 'Apopka', 'Winter Garden', 'Winter Park', 'Sanford', 'Casselberry',
    'Oviedo', 'Lake Mary', 'Altamonte Springs', 'Longwood', 'Windermere', 'Leesburg', 'Ocoee', 'Pine Hills', 'Groveland', 'Eustis',
    'Maitland', 'Wildwood', 'Minneola', 'Mount Dora', 'Tavares', 'Lockhart', 'Saint Cloud', 'Winter Springs', 'Coleman', 'Umatilla',
    'Fruitland Park', 'Lady Lake', 'Bushnell', 'Mascotte', 'Grand Island', 'Webster', 'Montverde', 'Astatula', 'Fairview Shores',
    'Center Hill', 'Oakland', 'Gotha', 'Davenport', 'Doctor Phillips', 'Deltona', 'DeBary', 'Sorrento', 'Hunters Creek',
    'Howey-in-the-Hills', 'Heathrow', 'Buena Ventura Lakes', 'Belle Isle', 'Meadow Woods', 'Azalea Park', 'Poinciana', 'Oak Ridge',
    'Union Park', 'Ormond Beach', 'Ormond-by-the-Sea', 'Daytona Beach', 'Holly Hill', 'Port Orange', 'Edgewater', 'New Smyrna Beach',
    'Orange City', 'Palm Coast', 'South Daytona', 'DeLand', 'Ponce Inlet', 'Lake Helen', 'Melbourne', 'Rockledge', 'Titusville',
    'Flagler Beach'];
  const norm = (s) => s.toLowerCase().replace(/^st\.?\s/, 'saint ').replace(/[^a-z]/g, '');
  const POPULAR = 12;
  const areaList = $('[data-area-list]');
  const cityList = $('[data-city-datalist]');
  CITIES.forEach((c, i) => {
    const li = document.createElement('li');
    li.className = 'rounded-full bg-white px-4 py-2 text-sm shadow-soft';
    li.textContent = c;
    if (i >= POPULAR) li.hidden = true;
    areaList.append(li);
    const o = document.createElement('option'); o.value = c; cityList.append(o);
  });
  const areaToggle = $('[data-area-toggle]');
  areaToggle.addEventListener('click', () => {
    const open = areaToggle.getAttribute('aria-expanded') !== 'true';
    $$('li', areaList).forEach((li, i) => { if (i >= POPULAR) li.hidden = !open; });
    areaToggle.setAttribute('aria-expanded', String(open));
    areaToggle.textContent = open ? 'Show popular cities only' : `Show all ${CITIES.length} cities`;
  });

  // Combobox with instant suggestions
  const areaForm = $('[data-area-form]');
  const areaInput = $('[data-area-input]');
  const suggest = $('[data-area-suggest]');
  const areaResult = $('[data-area-result]');
  let active = -1, matches = [];
  function closeSuggest() { suggest.hidden = true; areaInput.setAttribute('aria-expanded', 'false'); areaInput.removeAttribute('aria-activedescendant'); active = -1; }
  function renderSuggest() {
    const q = norm(areaInput.value);
    matches = q ? CITIES.filter((c) => norm(c).includes(q)).sort((a, b) => norm(a).indexOf(q) - norm(b).indexOf(q)).slice(0, 6) : [];
    suggest.innerHTML = '';
    matches.forEach((c, i) => {
      const li = document.createElement('li');
      li.id = `city-opt-${i}`;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i === active));
      li.className = 'flex min-h-[3rem] cursor-pointer items-center gap-3 rounded-full px-4 py-3 text-[0.95rem] hover:bg-brand-grey-50';
      li.innerHTML = '<svg class="h-4 w-4 shrink-0 text-brand-red" aria-hidden="true"><use href="#i-pin"/></svg>';
      li.append(c);
      li.addEventListener('mousedown', (e) => { e.preventDefault(); areaInput.value = c; closeSuggest(); check(); });
      suggest.append(li);
    });
    const open = matches.length > 0;
    suggest.hidden = !open;
    areaInput.setAttribute('aria-expanded', String(open));
    if (active >= 0 && matches[active]) areaInput.setAttribute('aria-activedescendant', `city-opt-${active}`);
    else areaInput.removeAttribute('aria-activedescendant');
  }
  function check() {
    const q = areaInput.value.trim();
    if (!q) { areaResult.className = 'mt-4 min-h-[1.5rem] px-2 text-sm font-medium text-brand-red'; areaResult.textContent = 'Please type a city name.'; return; }
    const hit = CITIES.find((c) => norm(c) === norm(q));
    areaResult.className = 'mt-4 min-h-[1.5rem] px-2 text-sm ' + (hit ? 'font-medium text-brand-midnight' : 'text-brand-grey-700');
    areaResult.textContent = hit
      ? `Yes, we serve ${hit}. Call (877) 787-7121 or request a free quote below.`
      : `${q} isn’t on our list, but we often help nearby towns. Call (877) 787-7121 to check.`;
  }
  areaInput.addEventListener('input', () => { active = -1; renderSuggest(); });
  areaInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!matches.length) return;
      e.preventDefault();
      active = (active + (e.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length;
      renderSuggest();
    } else if (e.key === 'Enter' && active >= 0 && matches[active]) {
      e.preventDefault(); areaInput.value = matches[active]; closeSuggest(); check();
    } else if (e.key === 'Escape') closeSuggest();
  });
  areaInput.addEventListener('blur', () => setTimeout(closeSuggest, 120));
  areaForm.addEventListener('submit', (e) => { e.preventDefault(); closeSuggest(); check(); });

  /* =====================================================================
     Quote: three soft steps + live summary. Shared GDAForm does validation and the honest hand-off.
     ===================================================================== */
  const form = $('[data-form]');
  if (window.GDAForm) GDAForm.init(form, { primaryClass: 'btn btn-red', secondaryClass: 'btn btn-line', titleClass: 'text-lg font-medium text-brand-midnight' });
  const stepPanels = $$('[data-step-panel]', form);
  const chips = $$('[data-chip]', form);
  const STEP_FIELDS = { 1: ['problem'], 2: [], 3: ['name', 'phone', 'city', 'details'] };
  let step = 1;
  function goTo(n, focus = true) {
    step = n;
    stepPanels.forEach((p) => p.classList.toggle('is-current', Number(p.dataset.stepPanel) === n));
    chips.forEach((c) => {
      const k = Number(c.dataset.chip);
      if (k === n) c.setAttribute('aria-current', 'step'); else c.removeAttribute('aria-current');
      c.classList.toggle('done', k < n);
    });
    if (focus) {
      const first = $(`[data-step-panel="${n}"] input:not([type=hidden]), [data-step-panel="${n}"] select, [data-step-panel="${n}"] textarea`, form);
      const checked = n === 2 ? $('[name="timing"]:checked', form) : null;
      (checked || first)?.focus({ preventScroll: true });
    }
  }
  function validStep(n) {
    const bad = STEP_FIELDS[n].map((name) => form.elements[name]).filter((el) => el && window.GDAForm && !GDAForm.validateField(el));
    if (bad.length) { bad[0].focus(); return false; }
    return true;
  }
  $$('[data-next]', form).forEach((b) => b.addEventListener('click', () => { if (validStep(step)) goTo(step + 1); }));
  $$('[data-back]', form).forEach((b) => b.addEventListener('click', () => goTo(step - 1)));
  // Enter inside steps 1–2 moves on instead of submitting early
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && step < 3 && e.target.matches('input, select')) { e.preventDefault(); if (validStep(step)) goTo(step + 1); }
  });
  // After a submit with errors, open the step that holds the first invalid field
  form.addEventListener('submit', () => {
    if (form.dataset.state !== 'invalid') return;
    const firstBad = $('[aria-invalid="true"]', form);
    const panel = firstBad?.closest('[data-step-panel]');
    if (panel) { goTo(Number(panel.dataset.stepPanel), false); firstBad.focus(); }
  });
  $$('[data-pick]', form).forEach((b) => b.addEventListener('click', () => {
    const sel = form.elements.problem;
    sel.value = b.dataset.pick;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    GDAForm?.validateField(sel);
    goTo(2);
  }));

  // Live "Your request" summary
  const sum = (k) => $(`[data-sum="${k}"]`, form);
  function paintSummary() {
    sum('problem').textContent = form.elements.problem.value || '—';
    sum('timing').textContent = ($('[name="timing"]:checked', form)?.value || '—').replace(' — as soon as possible', '');
    sum('city').textContent = form.elements.city.value.trim() || '—';
    sum('name').textContent = form.elements.name.value.trim() || '—';
  }
  form.addEventListener('input', paintSummary);
  form.addEventListener('change', paintSummary);
  paintSummary();
  goTo(1, false);

  // "Book" links anywhere on the page pre-fill the form and open the right step
  $$('a[href="#quote"][data-book]').forEach((a) => a.addEventListener('click', () => {
    const { service, urgency, details } = a.dataset;
    if (window.GDAForm) GDAForm.prefill(form, { service, urgency, message: details });
    paintSummary();
    goTo(service ? 2 : 1, false);
    setTimeout(() => {
      const target = service ? ($('[name="timing"]:checked', form) || form.elements.problem) : form.elements.problem;
      target.focus({ preventScroll: true });
    }, reduced ? 0 : 700);
  }));
})();
