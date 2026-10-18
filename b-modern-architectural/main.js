/* Concept B — Modern Architectural · interactions (vanilla JS) */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const form = $('[data-form]');

  /* Mobile action bar ------------------------------------------------------ */
  const bar = $('[data-actionbar]');
  const onScroll = () => { if (bar) bar.dataset.show = String(scrollY > 480); };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile navigation ---------------------------------------------------- */
  const burger = $('[data-burger]');
  const mnav = $('[data-mnav]');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    $('.sr-only', burger).textContent = open ? 'Close menu' : 'Open menu';
    document.documentElement.classList.toggle('overflow-hidden', open);
    if (open) {
      mnav.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => { mnav.dataset.open = 'true'; }));
      setTimeout(() => $('a', mnav).focus({ preventScroll: true }), 50);
    } else {
      mnav.dataset.open = 'false';
      setTimeout(() => { if (mnav.dataset.open === 'false') mnav.hidden = true; }, reduced ? 0 : 520);
    }
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', mnav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); }
  });
  matchMedia('(min-width: 1280px)').addEventListener('change', (m) => m.matches && setMenu(false));

  /* Reveals -------------------------------------------------------------- */
  const targets = $$('.reveal, .wipe');
  if (reduced || !('IntersectionObserver' in window)) targets.forEach((el) => el.classList.add('is-in'));
  else {
    // A fully clipped .wipe never "intersects", so its parent is observed instead.
    const watched = new Map();
    targets.forEach((el) => {
      const key = el.classList.contains('wipe') ? el.parentElement : el;
      if (!watched.has(key)) watched.set(key, []);
      watched.get(key).push(el);
    });
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      watched.get(en.target).forEach((el) => el.classList.add('is-in'));
      io.unobserve(en.target);
    }), { rootMargin: '0px 0px -10% 0px', threshold: 0 });
    watched.forEach((_, key) => io.observe(key));
  }

  /* Current section in the title-block nav ------------------------------ */
  const navLinks = $$('.nav-link');
  if ('IntersectionObserver' in window) {
    const so = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) navLinks.forEach((a) => (a.dataset.current = String(a.getAttribute('href') === '#' + en.target.id)));
    }), { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach((a) => { const s = $(a.getAttribute('href')); if (s) so.observe(s); });
  }

  /* Service selection in the quote form (radio cards) -------------------- */
  const setService = (name) => {
    $$('[data-service-radio]', form).forEach((r) => { r.checked = r.value === name; });
  };

  /* Anatomy of a door ----------------------------------------------------- */
  const data = JSON.parse($('[data-svc-data]').textContent);
  const svg = $('[data-anatomy]');
  const tabs = $$('[data-tab]');
  const spots = $$('[data-hotspot]');
  const panel = $('[data-panel]');
  let current = 0;
  const select = (i, focus) => {
    current = i;
    tabs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; });
    spots.forEach((s, k) => s.setAttribute('aria-pressed', String(k === i)));
    const parts = tabs[i].dataset.parts.split(' ');
    svg.dataset.active = tabs[i].id;
    const groups = $$('.part', svg);
    groups.forEach((g) => g.classList.remove('is-on'));
    void svg.getBoundingClientRect(); // restart the redraw animation
    groups.forEach((g) => { if (parts.includes(g.dataset.part)) g.classList.add('is-on'); });
    const d = data[i];
    $('[data-p-n]', panel).textContent = `${d.n} — Service`;
    $('[data-p-t]', panel).textContent = d.t;
    $('[data-p-d]', panel).textContent = d.d;
    const ul = $('[data-p-s]', panel);
    ul.innerHTML = '';
    d.s.forEach((x) => {
      const li = document.createElement('li');
      li.className = 'flex gap-3 text-[0.95rem]';
      li.innerHTML = '<span class="mt-2 h-px w-3 shrink-0 bg-signal"></span>';
      li.append(document.createTextNode(x));
      ul.append(li);
    });
    panel.setAttribute('aria-labelledby', tabs[i].id);
    if (focus) tabs[i].focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', (e) => {
      const k = e.key;
      if (['ArrowDown', 'ArrowRight'].includes(k)) { e.preventDefault(); select((current + 1) % tabs.length, true); }
      if (['ArrowUp', 'ArrowLeft'].includes(k)) { e.preventDefault(); select((current - 1 + tabs.length) % tabs.length, true); }
      if (k === 'Home') { e.preventDefault(); select(0, true); }
      if (k === 'End') { e.preventDefault(); select(tabs.length - 1, true); }
    });
  });
  spots.forEach((s, i) => s.addEventListener('click', () => select(i)));
  $('[data-book]').addEventListener('click', () => setService(data[current].t));
  select(0);

  /* Quick-quote strip → full form --------------------------------------- */
  const quick = $('[data-quick]');
  quick.addEventListener('submit', (e) => {
    e.preventDefault();
    const svc = $('[data-quick-service]', quick).value;
    const city = $('[data-quick-city]', quick).value.trim();
    if (svc) setService(svc);
    if (city) $('[name="city"]', form).value = city;
    $('#quote').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    setTimeout(() => $('[name="name"]', form).focus({ preventScroll: true }), reduced ? 0 : 700);
  });

  /* Quote form ----------------------------------------------------------- */
  window.GDAForm.init(form, {
    titleClass: 'display-md text-[1.6rem]',
    primaryClass: 'btn btn-char min-h-[3rem] text-[0.9rem]',
    secondaryClass: 'btn btn-line min-h-[3rem] text-[0.9rem]'
  });

  /* Count-up figures ------------------------------------------------------ */
  const fmt = new Intl.NumberFormat('en-US');
  if (!reduced && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target; const end = +el.dataset.count; const t0 = performance.now();
      const tick = (t) => { const p = Math.min(1, (t - t0) / 1400); el.textContent = fmt.format(Math.round(end * (1 - Math.pow(1 - p, 4)))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick); co.unobserve(el);
    }), { threshold: 0.5 });
    $$('[data-count]').forEach((c) => { c.textContent = '0'; co.observe(c); });
  }

  /* Google reviews track -------------------------------------------------- */
  const wrap = $('[data-reviews]');
  const track = $('[data-track]', wrap);
  const prev = $('[data-prev]', wrap);
  const next = $('[data-next]', wrap);
  const prog = $('[data-progress]', wrap);
  const cur = $('[data-current]', wrap);
  const cards = $$('li', track);
  const step = () => (cards[0] ? cards[0].getBoundingClientRect().width + 16 : 300);
  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    const p = max > 0 ? track.scrollLeft / max : 0;
    const visible = Math.max(1, Math.round(track.clientWidth / step()));
    prog.style.width = `${Math.min(100, (visible / cards.length) * 100)}%`;
    prog.style.transform = `translateX(${p * (cards.length / visible - 1) * 100}%)`;
    const idx = Math.min(cards.length, Math.round(track.scrollLeft / step()) + 1);
    cur.textContent = String(idx).padStart(2, '0');
    prev.disabled = track.scrollLeft < 4;
    next.disabled = track.scrollLeft > max - 4;
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reduced ? 'auto' : 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reduced ? 'auto' : 'smooth' }));
  track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  addEventListener('resize', update);
  update();

  /* Parallax on the about image ----------------------------------------- */
  const par = $('[data-parallax]');
  if (par && !reduced) {
    const run = () => {
      const r = par.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      par.style.transform = `translate3d(0, ${(p * -50).toFixed(1)}px, 0) scale(1.12)`;
    };
    addEventListener('scroll', () => requestAnimationFrame(run), { passive: true });
    run();
  }
})();
