/* Concept A — Classic Chic. Page behaviour (vanilla JS, no dependencies). */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll reveal ---------- */
  const reveals = $$('.reveal');
  if (!('IntersectionObserver' in window) || reduced) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Header shadow + mobile action bar ---------- */
  const header = $('[data-header]');
  const actionbar = $('[data-actionbar]');
  const hero = $('#top');
  const quote = $('#quote');
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.dataset.scrolled = String(y > 8);
    if (actionbar && hero) {
      const pastHero = y > hero.offsetTop + hero.offsetHeight - 160;
      const r = quote ? quote.getBoundingClientRect() : null;
      const atQuote = r && r.top < innerHeight * 0.6 && r.bottom > innerHeight * 0.4;
      actionbar.dataset.show = String(pastHero && !atQuote);
    }
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  const burger = $('[data-burger]');
  const mnav = $('[data-mnav]');
  if (burger && mnav) {
    const label = $('.sr-only', burger);
    const setOpen = (open) => {
      burger.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? 'Close menu' : 'Open menu';
      document.documentElement.style.overflow = open ? 'hidden' : '';
      if (open) {
        mnav.style.top = `${header.getBoundingClientRect().bottom}px`;
        mnav.hidden = false;
        requestAnimationFrame(() => { mnav.dataset.open = 'true'; });
        $('a', mnav)?.focus({ preventScroll: true });
      } else {
        mnav.dataset.open = 'false';
        setTimeout(() => { if (mnav.dataset.open !== 'true') mnav.hidden = true; }, reduced ? 0 : 300);
      }
    };
    burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
    $$('a', mnav).forEach((a) => a.addEventListener('click', () => setOpen(false)));
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setOpen(false); burger.focus(); }
    });
    matchMedia('(min-width: 1024px)').addEventListener('change', (m) => { if (m.matches) setOpen(false); });
  }

  /* ---------- Current section in primary nav ---------- */
  const navLinks = $$('.nav-link');
  if (navLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        navLinks.forEach((a) => { a.dataset.current = 'false'; a.removeAttribute('aria-current'); });
        const a = byId.get(e.target.id);
        if (a) { a.dataset.current = 'true'; a.setAttribute('aria-current', 'location'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) sio.observe(s); });
  }

  /* ---------- Google reviews track ---------- */
  const reviews = $('[data-reviews]');
  if (reviews) {
    const track = $('[data-track]', reviews);
    const prev = $('[data-prev]', reviews);
    const next = $('[data-next]', reviews);
    const step = () => (track.firstElementChild?.getBoundingClientRect().width || 320) + 16;
    const sync = () => {
      prev.disabled = track.scrollLeft < 8;
      next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 8;
    };
    const behavior = reduced ? 'auto' : 'smooth';
    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior }));
    track.addEventListener('scroll', sync, { passive: true });
    addEventListener('resize', sync);
    sync();

    // Long reviews are clamped; add "Read more" only where text actually overflows.
    $$('[data-clamp]', track).forEach((p) => {
      if (p.scrollHeight - p.clientHeight < 4) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mt-2 font-display text-[0.88rem] font-semibold text-navy underline decoration-red/40 decoration-2 underline-offset-4 hover:decoration-red';
      btn.textContent = 'Read more';
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', () => {
        const open = p.classList.toggle('clamp-5') === false;
        btn.textContent = open ? 'Show less' : 'Read more';
        btn.setAttribute('aria-expanded', String(open));
      });
      p.after(btn);
    });
  }

  /* ---------- Service area: city checker + full list ---------- */
  const cityItems = $$('[data-city-items] li').map((li) => li.textContent.trim());
  const options = $('[data-city-options]');
  if (options) options.innerHTML = cityItems.map((c) => `<option value="${c}"></option>`).join('');
  const cityInput = $('[data-city-input]');
  const cityResult = $('[data-city-result]');
  if (cityInput && cityResult) {
    const norm = (s) => s.toLowerCase().replace(/\bst\.?\s/, 'saint ').replace(/[^a-z]/g, '');
    const lookup = new Map(cityItems.map((c) => [norm(c), c]));
    const check = () => {
      const q = cityInput.value.trim();
      cityResult.textContent = '';
      if (q.length < 3) return;
      const hit = lookup.get(norm(q));
      const icon = (id) => `<svg class="mr-2 inline h-4 w-4 align-[-2px]" aria-hidden="true"><use href="#${id}"/></svg>`;
      if (hit) {
        cityResult.className = 'mt-3 min-h-[1.5rem] text-[0.95rem] font-semibold text-navy';
        cityResult.innerHTML = `${icon('check')}Yes — we serve ${hit}. <a class="text-red underline underline-offset-4" href="#quote">Request a free quote</a> or call <a class="text-red underline underline-offset-4" href="tel:+18777877121">(877) 787-7121</a>.`;
      } else {
        cityResult.className = 'mt-3 min-h-[1.5rem] text-[0.95rem] text-slate';
        cityResult.innerHTML = `${icon('phone')}${q.replace(/[<>&"]/g, '')} isn’t on our list yet, but we cover surrounding areas — call <a class="font-semibold text-red underline underline-offset-4" href="tel:+18777877121">(877) 787-7121</a> to check.`;
      }
    };
    let t;
    cityInput.addEventListener('input', () => { clearTimeout(t); t = setTimeout(check, 250); });
    cityInput.addEventListener('change', check);
  }

  const cities = $('[data-cities]');
  const citiesToggle = $('[data-cities-toggle]');
  if (cities && citiesToggle) {
    const label = $('[data-label]', citiesToggle);
    const icon = $('svg', citiesToggle);
    citiesToggle.addEventListener('click', () => {
      const open = citiesToggle.getAttribute('aria-expanded') !== 'true';
      citiesToggle.setAttribute('aria-expanded', String(open));
      cities.dataset.expanded = String(open);
      if (label) label.textContent = open ? 'Show fewer cities' : `Show all ${cityItems.length} cities`;
      if (icon) { icon.classList.toggle('-rotate-90', open); icon.classList.toggle('rotate-90', !open); }
    });
    if (label) label.textContent = `Show all ${cityItems.length} cities`;
  }

  /* ---------- Quote form (shared validation module) ---------- */
  const form = $('[data-form]');
  if (form && window.GDAForm) {
    window.GDAForm.init(form, {
      primaryClass: 'btn btn-call min-h-[3rem]',
      secondaryClass: 'btn btn-outline min-h-[3rem]',
      titleClass: 'font-display text-[1.15rem] font-bold text-navy'
    });
    $$('[data-service]').forEach((a) =>
      a.addEventListener('click', () => window.GDAForm.prefill(form, { service: a.dataset.service }))
    );
  }

  /* ---------- Footer year ---------- */
  const year = $('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
