/* Concept C — Modern Friendly · interactions (vanilla JS) */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smooth = reduced ? 'auto' : 'smooth';
  const form = $('[data-form]');

  /* Header shadow + floating mobile action bar ------------------------- */
  const header = $('[data-header]');
  const bar = $('[data-actionbar]');
  const quote = $('#quote');
  let quoteVisible = false;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => { quoteVisible = en.isIntersecting; onScroll(); }, { threshold: 0.25 }).observe(quote);
  }
  function onScroll() {
    header.dataset.scrolled = String(scrollY > 8);
    if (bar) bar.dataset.show = String(scrollY > 420 && !quoteVisible);
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu ---------------------------------------------------------- */
  const burger = $('[data-burger]');
  const mnav = $('[data-mnav]');
  const scrim = $('[data-scrim]');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    $('.sr-only', burger).textContent = open ? 'Close menu' : 'Open menu';
    [mnav, scrim].forEach((el) => {
      if (open) { el.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => { el.dataset.open = 'true'; })); }
      else { el.dataset.open = 'false'; setTimeout(() => { if (el.dataset.open === 'false') el.hidden = true; }, reduced ? 0 : 320); }
    });
    if (open) setTimeout(() => $('a', mnav).focus({ preventScroll: true }), 60);
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  scrim.addEventListener('click', () => setMenu(false));
  $$('a', mnav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); }
  });
  matchMedia('(min-width: 1280px)').addEventListener('change', (m) => m.matches && setMenu(false));

  /* Reveals -------------------------------------------------------------- */
  const reveals = $$('.reveal');
  if (reduced || !('IntersectionObserver' in window)) reveals.forEach((el) => el.classList.add('is-in'));
  else {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach((el) => io.observe(el));
  }

  /* Current nav item ------------------------------------------------------ */
  const navLinks = $$('.nav-link');
  if ('IntersectionObserver' in window) {
    const so = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) navLinks.forEach((a) => (a.dataset.current = String(a.getAttribute('href') === '#' + en.target.id)));
    }), { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach((a) => { const s = $(a.getAttribute('href')); if (s) so.observe(s); });
  }

  /* Quote form ------------------------------------------------------------ */
  window.GDAForm.init(form, {
    titleClass: 'font-display text-[1.2rem] font-bold',
    primaryClass: 'btn btn-blue min-h-[2.9rem] text-[0.95rem]',
    secondaryClass: 'btn btn-alert min-h-[2.9rem] text-[0.95rem]'
  });
  $$('[data-book]').forEach((a) => a.addEventListener('click', () => window.GDAForm.prefill(form, { service: a.dataset.book })));

  /* Fix finder ------------------------------------------------------------ */
  const syms = JSON.parse($('[data-sym-data]').textContent);
  const urg = JSON.parse($('[data-urg-data]').textContent);
  const result = $('[data-result]');
  const symBtns = $$('[data-sym]');
  const heroChips = $$('[data-hero-sym]');
  let cur = 0;
  const show = (i) => {
    cur = i;
    const s = syms[i];
    symBtns.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
    heroChips.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
    const badge = $('[data-r-urg]', result);
    badge.textContent = urg[s.urg][0];
    badge.className = `rounded-full px-3 py-1 text-[0.82rem] font-bold ${urg[s.urg][1]}`;
    $('[data-r-svc]', result).textContent = s.svc;
    $('[data-r-title]', result).textContent = s.title;
    $('[data-r-why]', result).textContent = s.why;
    $('[data-r-tip]', result).textContent = s.tip;
    const img = $('[data-r-img]', result);
    img.src = s.img; img.alt = s.alt;
    // Urgent symptoms lead with the call button; others lead with booking.
    const call = $('[data-r-call]', result); const book = $('[data-r-book]', result);
    const urgent = s.urg === 'urgent';
    call.className = `btn ${urgent ? 'btn-alert' : 'btn-ghost'}`;
    book.className = `btn ${urgent ? 'btn-ghost' : 'btn-blue'}`;
    if (urgent) call.parentElement.prepend(call); else book.parentElement.prepend(book);
    result.classList.remove('result-in'); void result.offsetWidth; result.classList.add('result-in');
  };
  symBtns.forEach((b, i) => b.addEventListener('click', () => show(i)));
  heroChips.forEach((b, i) => b.addEventListener('click', () => {
    show(i);
    $('#finder').scrollIntoView({ behavior: smooth });
  }));
  $('[data-r-book]', result).addEventListener('click', () => {
    const s = syms[cur];
    window.GDAForm.prefill(form, { service: s.svc, message: s.label.replace('—', '-') + '.', urgency: s.urg === 'urgent' ? 'Emergency — today' : undefined });
  });

  /* City checker ---------------------------------------------------------- */
  const cities = $$('#city-list option').map((o) => o.value);
  const norm = (x) => x.toLowerCase().replace(/^st\.?\s/, 'saint ').replace(/[^a-z]/g, '');
  const checker = $('[data-city-check]');
  const out = $('[data-city-result]');
  checker.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = $('input', checker).value.trim();
    out.innerHTML = '';
    if (!q) return;
    const hit = cities.find((c) => norm(c) === norm(q));
    const box = document.createElement('div');
    box.className = `result-in flex items-start gap-3 rounded-2xl p-4 ${hit ? 'bg-[#E8F8EE] text-[#14532D]' : 'bg-sun-soft text-[#5c4200]'}`;
    const p = document.createElement('p');
    if (hit) {
      p.innerHTML = '<strong></strong> Yes — we serve <span></span>. Call us or <a class="font-semibold underline underline-offset-2" href="#quote">request a free quote</a>.';
      p.querySelector('strong').textContent = '✓';
      p.querySelector('span').textContent = hit;
      const city = $('[name="city"]', form);
      if (city && !city.value) city.value = hit;
    } else {
      p.innerHTML = '<span></span> isn’t on our list, but we cover surrounding areas too. Give us a call at <a class="font-semibold underline underline-offset-2" href="tel:+18777877121">(877) 787-7121</a> to check.';
      p.querySelector('span').textContent = `“${q}”`;
    }
    box.append(p);
    out.append(box);
  });

  /* Reviews (mobile carousel) ------------------------------------------- */
  const wrap = $('[data-reviews]');
  const track = $('[data-track]', wrap);
  const items = $$('li', track);
  const curEl = $('[data-current]', wrap);
  const step = () => items[0].getBoundingClientRect().width + 16;
  const update = () => { curEl.textContent = String(Math.min(items.length, Math.round(track.scrollLeft / step()) + 1)); };
  $('[data-prev]', wrap).addEventListener('click', () => track.scrollBy({ left: -step(), behavior: smooth }));
  $('[data-next]', wrap).addEventListener('click', () => track.scrollBy({ left: step(), behavior: smooth }));
  track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });

  /* Count-up ---------------------------------------------------------------- */
  const fmt = new Intl.NumberFormat('en-US');
  if (!reduced && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target; const end = +el.dataset.count; const t0 = performance.now();
      const tick = (t) => { const p = Math.min(1, (t - t0) / 1300); el.textContent = fmt.format(Math.round(end * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick); co.unobserve(el);
    }), { threshold: 0.6 });
    $$('[data-count]').forEach((c) => { c.textContent = '0'; co.observe(c); });
  }
})();
