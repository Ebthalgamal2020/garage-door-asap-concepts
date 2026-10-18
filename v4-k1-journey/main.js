/* Version 4 — K1 Journey. Vanilla JS: menu, reveals, step ring, area checker, review scroller, quote form. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('[data-menu-btn]');
  const menu = $('#mobile-nav');
  const icon = $('[data-menu-icon]');
  function setMenu(open) {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Open menu';
    icon.setAttribute('d', open ? 'M6 6l12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16');
  }
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); }
  });
  matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Scroll reveals + how-it-works emblem ring ---------- */
  const reveals = $$('.reveal');
  const segs = $$('.ring-seg');
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('in'));
    segs.forEach((s) => s.classList.add('on'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));

    const stepIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const n = Number(en.target.dataset.step);
        segs.forEach((s) => { if (Number(s.dataset.seg) <= n) s.classList.add('on'); });
        en.target.classList.add('border-brand-red');
      });
    }, { rootMargin: '0px 0px -35% 0px' });
    $$('[data-step]').forEach((el) => stepIO.observe(el));
  }

  /* ---------- Service areas (73 cities, as listed on garagedoorasapservice.com) ---------- */
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

  const list = $('[data-area-list]');
  const toggle = $('[data-area-toggle]');
  const datalist = $('[data-area-datalist]');
  $('[data-area-count]').textContent = CITIES.length;
  CITIES.forEach((c, i) => {
    const li = document.createElement('li');
    li.className = 'flex items-center gap-2';
    li.innerHTML = '<span class="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" aria-hidden="true"></span>';
    li.append(c);
    if (i >= PREVIEW) li.hidden = true;
    list.append(li);
    const opt = document.createElement('option');
    opt.value = c;
    datalist.append(opt);
  });
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    $$('li', list).forEach((li, i) => { if (i >= PREVIEW) li.hidden = !open; });
    toggle.setAttribute('aria-expanded', String(open));
    toggle.firstChild.textContent = open ? 'Show fewer cities' : 'Show all cities';
    toggle.querySelector('svg').classList.toggle('-rotate-90', open);
    toggle.querySelector('svg').classList.toggle('rotate-90', !open);
  });

  const areaForm = $('[data-area-form]');
  const areaResult = $('[data-area-result]');
  areaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = areaForm.area.value.trim();
    areaResult.textContent = '';
    if (!q) { areaResult.className = 'mt-3 min-h-[1.5rem] text-sm text-brand-red'; areaResult.textContent = 'Please type a city name.'; return; }
    const hit = CITIES.find((c) => norm(c) === norm(q));
    if (hit) {
      areaResult.className = 'mt-3 min-h-[1.5rem] text-sm font-medium text-brand-midnight';
      areaResult.textContent = `Yes, we serve ${hit}. Call (877) 787-7121 or request a quote below.`;
    } else {
      areaResult.className = 'mt-3 min-h-[1.5rem] text-sm text-brand-grey-700';
      areaResult.textContent = `${q} isn’t on our list, but we often help nearby towns. Call (877) 787-7121 to check.`;
    }
  });

  /* ---------- Reviews scroller buttons (mobile/tablet) ---------- */
  const track = $('[data-reviews]');
  $$('[data-rev]').forEach((b) => b.addEventListener('click', () => {
    const card = track.querySelector('li');
    const step = card ? card.getBoundingClientRect().width + 20 : track.clientWidth * 0.8;
    track.scrollBy({ left: step * Number(b.dataset.rev), behavior: reduced ? 'auto' : 'smooth' });
  }));

  /* ---------- Quote form (shared GDAForm module) ---------- */
  const form = $('[data-form]');
  if (window.GDAForm) {
    GDAForm.init(form, {
      primaryClass: 'btn btn-red',
      secondaryClass: 'btn btn-line',
      titleClass: 'font-heading text-brand-midnight text-lg'
    });
  }

  // "Book this repair" / emergency / financing links pre-fill the form
  $$('a[href="#quote"][data-service], a[href="#quote"][data-urgency], a[href="#quote"][data-message]').forEach((a) =>
    a.addEventListener('click', () => {
      if (!window.GDAForm) return;
      GDAForm.prefill(form, { service: a.dataset.service, urgency: a.dataset.urgency, message: a.dataset.message });
      setTimeout(() => $('#f-name').focus({ preventScroll: true }), reduced ? 0 : 600);
    })
  );

  /* ---------- Hide mobile call bar while the quote form is on screen ---------- */
  const bar = $('[data-mobile-bar]');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => {
      bar.style.transform = en.isIntersecting ? 'translateY(110%)' : '';
    }).observe(form);
    bar.style.transition = 'transform .3s ease';
  }
})();
