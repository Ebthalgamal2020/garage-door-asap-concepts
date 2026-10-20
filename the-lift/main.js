/* "The Lift" — vanilla JS. Header, menu, reveals, service cards, steps track,
   reviews carousel, area checker with city autocomplete, quick quote → full form. */
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
      requestAnimationFrame(() => { const y = Math.min(scrollY * 0.08, arch.offsetHeight * 0.03); arch.style.transform = `translateY(${y.toFixed(1)}px) scale(1.06)`; ticking = false; });
    }, { passive: true });
    arch.style.transform = 'scale(1.06)';
  }

  /* ---------- Service cards: "Book" carries the service into the quote form ---------- */
  const form = $('[data-form]');
  $$('[data-book]').forEach((a) => a.addEventListener('click', () =>
    prefillForm({ service: a.dataset.book, urgency: 'urgent' in a.dataset ? 'Emergency — as soon as possible' : undefined })));

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
  const SVGNS = 'http://www.w3.org/2000/svg';
  const norm = (s) => s.toLowerCase().replace(/^st\.?\s/, 'saint ').replace(/[^a-z]/g, '');
  const MAJOR = ['Orlando', 'Kissimmee', 'Clermont', 'The Villages', 'Sanford', 'Daytona Beach', 'DeLand', 'Melbourne', 'Titusville', 'Palm Coast'];
  const MINOR_ON_PHONES = ['Sanford', 'DeLand', 'Titusville', 'Palm Coast']; // hidden below 640 px to keep labels comfortable

  const map = $('[data-map]');
  const areaResult = $('[data-area-result]');
  const areaForm = $('[data-area-form]');
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

  function selectCity(name, fromMap) {
    const c = AREA && AREA.cities.find((x) => x.name === name);
    if (!c) return;
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
    $('[data-area-quote]', areaResult).addEventListener('click', () => { const f = $('#f-city'); if (f && !f.value) { f.value = c.name; cityNote(f); } });
    if (fromMap) { areaForm.area.value = c.name; areaCombo.close(); }
  }

  function cityNotFound(q) {
    cityDots.forEach((g) => g.classList.remove('is-on'));
    clearRoute();
    areaResult.innerHTML = '<p class="text-lg font-heading text-brand-midnight"></p><a href="tel:+18777877121" class="btn btn-red mt-4 min-h-[3rem] px-5 text-sm"><svg><use href="#i-phone"/></svg>Call (877) 787-7121</a>';
    areaResult.querySelector('p').textContent = `${q} isn’t on our list, but we often help nearby towns. Call (877) 787-7121 to check.`;
  }

  const findCity = (q) => CITIES.find((c) => norm(c) === norm(q));
  const SORTED = [...CITIES].sort((x, y) => x.localeCompare(y));

  /* City autocomplete (ARIA combobox + listbox). Suggestions come only from the verified service-area list.
     ↑/↓ move, Enter selects, Escape closes; the field stays editable. Used by the area checker and the quote form. */
  function combobox(root, { onPick, onInput, emptyHint }) {
    const input = $('[data-combo-input]', root);
    const list = $('[data-combo-list]', root);
    const live = document.createElement('p');
    live.className = 'sr-only'; live.setAttribute('aria-live', 'polite');
    root.append(live);
    let items = [], active = -1;
    const isOpen = () => !list.hidden;
    function close() {
      list.hidden = true; active = -1;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
    }
    function setActive(i) {
      active = i;
      $$('[role="option"]', list).forEach((o, k) => o.setAttribute('aria-selected', String(k === i)));
      const o = i >= 0 ? list.children[i] : null;
      if (o) { input.setAttribute('aria-activedescendant', o.id); o.scrollIntoView({ block: 'nearest' }); }
      else input.removeAttribute('aria-activedescendant');
    }
    function render() {
      const raw = input.value.trim(), q = norm(raw);
      items = q
        ? CITIES.filter((c) => norm(c).includes(q)).sort((x, y) => (norm(x).startsWith(q) ? 0 : 1) - (norm(y).startsWith(q) ? 0 : 1) || x.localeCompare(y))
        : SORTED;
      list.innerHTML = '';
      if (!items.length) {
        const li = document.createElement('li');
        li.id = `${list.id}-empty`; li.className = 'combo-empty';
        li.setAttribute('role', 'option'); li.setAttribute('aria-disabled', 'true'); li.setAttribute('aria-selected', 'false');
        li.textContent = `No city on our list matches “${raw}”. ${emptyHint}`;
        list.append(li);
        live.textContent = 'No matching city.';
      } else {
        items.forEach((c, i) => {
          const li = document.createElement('li');
          li.id = `${list.id}-${i}`; li.className = 'combo-opt';
          li.setAttribute('role', 'option'); li.setAttribute('aria-selected', 'false');
          const name = document.createElement('span');
          const at = raw ? c.toLowerCase().indexOf(raw.toLowerCase()) : -1;
          if (at >= 0) {
            const m = document.createElement('mark'); m.textContent = c.slice(at, at + raw.length);
            name.append(c.slice(0, at), m, c.slice(at + raw.length));
          } else name.textContent = c;
          li.append(name);
          li.addEventListener('mousedown', (e) => e.preventDefault()); // keep focus in the field
          li.addEventListener('click', () => pick(c));
          list.append(li);
        });
        live.textContent = `${items.length} ${items.length === 1 ? 'city' : 'cities'} found. Use the arrow keys to choose.`;
      }
      list.hidden = false; active = -1;
      input.setAttribute('aria-expanded', 'true');
      input.removeAttribute('aria-activedescendant');
    }
    function pick(c) {
      input.value = c;
      close();
      onPick(c);
    }
    input.addEventListener('input', () => { render(); if (onInput) onInput(); });
    input.addEventListener('click', () => { if (!isOpen()) render(); });
    input.addEventListener('blur', close);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isOpen()) render();
        if (!items.length) return;
        const down = e.key === 'ArrowDown';
        setActive(active < 0 ? (down ? 0 : items.length - 1) : Math.max(0, Math.min(items.length - 1, active + (down ? 1 : -1))));
      } else if (e.key === 'Enter' && isOpen()) {
        const hit = active >= 0 ? items[active] : (items.length === 1 ? items[0] : findCity(input.value.trim()));
        if (hit) { e.preventDefault(); pick(hit); } else close();
      } else if (e.key === 'Escape' && isOpen()) {
        e.preventDefault(); e.stopPropagation(); close();
      } else if (e.key === 'Tab') close();
    });
    return { input, close };
  }

  // Area checker
  const areaCombo = combobox($('[data-combo]', areaForm), {
    onPick: (c) => selectCity(c),
    emptyHint: 'Press Check or call us to ask.'
  });
  areaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    areaCombo.close();
    const q = areaForm.area.value.trim();
    if (!q) { areaResult.innerHTML = '<p class="text-base font-medium text-brand-red">Please type a city name.</p>'; areaForm.area.focus(); return; }
    const hit = findCity(q);
    if (hit) { areaForm.area.value = hit; selectCity(hit); } else cityNotFound(q);
  });

  // Quote form city: same verified list; any town can still be typed, with an honest note when it isn't listed
  const fCity = $('#f-city');
  const fCityNote = document.createElement('p');
  fCityNote.className = 'mt-1.5 text-[0.8rem] text-brand-grey-700';
  fCityNote.hidden = true;
  fCity.closest('[data-combo]').after(fCityNote);
  function cityNote(f) {
    const v = f.value.trim(), hit = v && findCity(v);
    if (hit && hit !== v) f.value = hit;
    fCityNote.hidden = !v || !!hit;
    fCityNote.textContent = v && !hit ? 'Not on our list of 73 cities. Send it anyway and we’ll confirm when we call.' : '';
  }
  combobox(fCity.closest('[data-combo]'), {
    onPick: () => { cityNote(fCity); if (window.GDAForm && fCity.hasAttribute('aria-invalid')) GDAForm.validateField(fCity); },
    onInput: () => { fCityNote.hidden = true; },
    emptyHint: 'You can still send it.'
  });
  fCity.addEventListener('change', () => cityNote(fCity));

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
