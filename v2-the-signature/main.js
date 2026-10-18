/* "The Signature" — vanilla JS. Menu, reveals, hero photo parallax, featured-review cycling,
   service areas (12 main + all 73), quote form (shared GDAForm) with "Book this repair" pre-fill. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('[data-menu-btn]');
  const menu = $('#mobile-nav');
  const menuIcon = $('[data-menu-icon]');
  function setMenu(open) {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Open menu';
    menuIcon.setAttribute('d', open ? 'M6 6l12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16');
  }
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });
  matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Reveals (fade/slide-up; heading rules draw in) ---------- */
  const io = 'IntersectionObserver' in window && !reduced
    ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' })
    : null;
  $$('.rv').forEach((el) => (io ? io.observe(el) : el.classList.add('in')));

  /* ---------- Slow parallax on the hero photo (desktop only) ---------- */
  const drift = $('[data-drift]');
  const wide = matchMedia('(min-width: 1024px)');
  if (drift && !reduced) {
    let ticking = false;
    const apply = () => { ticking = false; drift.style.transform = wide.matches ? `translateY(${Math.min(scrollY, 700) * 0.08}px) scale(1.04)` : ''; };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } }, { passive: true });
    wide.addEventListener('change', apply);
    apply();
  }

  /* ---------- Reviews: genuine Google reviews (listing read 18 Oct 2026), quoted as written ---------- */
  const REVIEWS = [
    { n: 'Jim B.', m: 'Opener repair · 4 months ago', t: 'Andy did a very thorough job and he was very good at communicating my options. My garage door opener broke in the evening and Andy Hamidan was at my house at 9AM the next morning. Seems that is why they call it ASAP.' },
    { n: 'Mike Z.', m: 'Spring replacement · 2 months ago', t: 'Andy and Sam did an outstanding job replacing my garage door springs. They were professional, knowledgeable, and worked efficiently. They kept everything clean throughout the job and made sure everything was working perfectly before they left.' },
    { n: 'Rosa L.', m: 'Broken spring · 3 months ago', t: 'Moe was very knowledgeable and professional. The spring was broken. He gave us 2 option, no pushy and he fixed everything in 1 hour. New spring coils, rollers, and replaced the cables. We definitely recommend him!' },
    { n: 'Tala K.', m: 'Spring replacement · 4 months ago', t: 'He didn’t just do a quick fix; he made sure everything was balanced, safely tested, and properly lubricated. He is polite, transparent about pricing, and clearly takes pride in his work. The garage door operates smoother and quieter now than it ever has before.' },
    { n: 'Jean T.', m: 'Tension springs · 5 months ago', t: 'Andy was able to make it out within 45 minutes of my call and changed out my tension springs and other hardware on my garage in just under an hour. Pricing was reasonable and the parts carry a warranty too…' },
    { n: 'Hannah E.', m: 'Spring, cables & rollers · 4 months ago', t: 'When the spring on my garage door broke, ASAP was able to schedule a repair the next day. This is my 2nd time using ASAP and I will continue to use them. Moe was my technician and he was great!! He was right on time and very knowledgeable…' },
    { n: 'Russell P.', m: 'Springs, cables & drum · 4 months ago', t: 'Andy came to my house today and repaired the springs, cables, and drum professionally and efficiently. I’m very happy and grateful to the company for the excellent service. Andy was very kind, respectful, and knowledgeable.' },
    { n: 'Tim G.', m: 'Diagnosis · 4 months ago', t: 'Moe was very informative and was able to come to assist and diagnose the issues very quickly. Very professional and explained things at great length. I would recommend him to anyone.' }
  ];
  const STARS = '<span class="flex gap-0.5" role="img" aria-label="5 out of 5 stars">' + '<svg class="star"><use href="#i-star"/></svg>'.repeat(5) + '</span>';
  const featured = $('[data-featured]');
  const more = $('[data-more]');
  let cur = 0;
  function renderReviews(user) {
    const r = REVIEWS[cur];
    $('[data-f-text]').textContent = r.t;
    $('[data-f-name]').textContent = r.n;
    $('[data-f-meta]').textContent = r.m;
    $('[data-f-initial]').textContent = r.n[0];
    $('[data-f-n]').textContent = cur + 1;
    featured.setAttribute('aria-live', user ? 'polite' : 'off');
    if (user && !reduced) { featured.classList.remove('q-swap'); void featured.offsetWidth; featured.classList.add('q-swap'); }
    more.innerHTML = '';
    [1, 2, 3].forEach((k) => {
      const x = REVIEWS[(cur + k) % REVIEWS.length];
      const li = document.createElement('li');
      li.className = 'flex flex-col border border-brand-grey-200 p-6';
      li.innerHTML = `<div class="flex items-center justify-between">${STARS}<svg class="h-5 w-5" aria-hidden="true"><use href="#i-google"/></svg></div>
        <blockquote class="mt-4 line-clamp-5 flex-1 text-[0.92rem] leading-relaxed text-brand-ink"></blockquote>
        <p class="mt-5 border-t border-brand-grey-200 pt-4 text-sm"><strong class="block font-heading text-brand-midnight"></strong><span class="text-brand-grey-700"></span></p>`;
      $('blockquote', li).textContent = x.t;
      $('strong', li).textContent = x.n;
      $('p span', li).textContent = x.m;
      more.append(li);
    });
  }
  $$('[data-rev]').forEach((b) => b.addEventListener('click', () => {
    cur = (cur + Number(b.dataset.rev) + REVIEWS.length) % REVIEWS.length;
    renderReviews(true);
  }));
  renderReviews(false);

  /* ---------- Service areas: 73 cities listed on garagedoorasapservice.com; 12 main ones shown first ---------- */
  const CITIES = ['Orlando', 'Kissimmee', 'The Villages', 'Clermont', 'Apopka', 'Winter Garden', 'Winter Park', 'Sanford', 'Casselberry',
    'Oviedo', 'Lake Mary', 'Altamonte Springs', 'Longwood', 'Windermere', 'Leesburg', 'Ocoee', 'Pine Hills', 'Groveland', 'Eustis',
    'Maitland', 'Wildwood', 'Minneola', 'Mount Dora', 'Tavares', 'Lockhart', 'Saint Cloud', 'Winter Springs', 'Coleman', 'Umatilla',
    'Fruitland Park', 'Lady Lake', 'Bushnell', 'Mascotte', 'Grand Island', 'Webster', 'Montverde', 'Astatula', 'Fairview Shores',
    'Center Hill', 'Oakland', 'Gotha', 'Davenport', 'Doctor Phillips', 'Deltona', 'DeBary', 'Sorrento', 'Hunters Creek',
    'Howey-in-the-Hills', 'Heathrow', 'Buena Ventura Lakes', 'Belle Isle', 'Meadow Woods', 'Azalea Park', 'Poinciana', 'Oak Ridge',
    'Union Park', 'Ormond Beach', 'Ormond-by-the-Sea', 'Daytona Beach', 'Holly Hill', 'Port Orange', 'Edgewater', 'New Smyrna Beach',
    'Orange City', 'Palm Coast', 'South Daytona', 'DeLand', 'Ponce Inlet', 'Lake Helen', 'Melbourne', 'Rockledge', 'Titusville',
    'Flagler Beach'];
  const MAIN = ['Orlando', 'Clermont', 'Kissimmee', 'The Villages', 'Winter Garden', 'Winter Park', 'Apopka', 'Sanford', 'Lake Mary', 'Oviedo', 'Daytona Beach', 'Melbourne'];
  const ordered = [...MAIN, ...CITIES.filter((c) => !MAIN.includes(c))];
  const norm = (s) => s.toLowerCase().replace(/^st\.?\s/, 'saint ').replace(/[^a-z]/g, '');
  const areaList = $('[data-area-list]');
  const datalist = $('[data-area-datalist]');
  $$('[data-area-count]').forEach((el) => (el.textContent = CITIES.length));
  ordered.forEach((c, i) => {
    const li = document.createElement('li');
    li.className = 'flex items-center gap-3 text-brand-midnight';
    li.innerHTML = '<span class="h-1.5 w-1.5 shrink-0 bg-brand-red" aria-hidden="true"></span>';
    li.append(c);
    if (i >= MAIN.length) li.hidden = true;
    areaList.append(li);
    const o = document.createElement('option'); o.value = c; datalist.append(o);
  });
  const areaToggle = $('[data-area-toggle]');
  areaToggle.addEventListener('click', () => {
    const open = areaToggle.getAttribute('aria-expanded') !== 'true';
    $$('li', areaList).forEach((li, i) => { if (i >= MAIN.length) li.hidden = !open; });
    areaToggle.setAttribute('aria-expanded', String(open));
    $('span', areaToggle).textContent = open ? 'Show main cities only' : `Show all ${CITIES.length} cities`;
    $('svg', areaToggle).classList.toggle('-rotate-90', open);
    $('svg', areaToggle).classList.toggle('rotate-90', !open);
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
      ? `Yes, we serve ${hit}. Call (877) 787-7121 or request a quote below.`
      : `${q} isn’t on our list, but we often help nearby towns. Call (877) 787-7121 to check.`;
  });

  /* ---------- Quote form (shared GDAForm: validation + honest email/call hand-off) ---------- */
  const form = $('[data-form]');
  if (window.GDAForm) GDAForm.init(form, { primaryClass: 'btn btn-red', secondaryClass: 'btn btn-line', titleClass: 'text-lg font-title text-brand-midnight' });
  function prefill(opts) {
    if (window.GDAForm) GDAForm.prefill(form, opts);
    setTimeout(() => $('#f-name').focus({ preventScroll: true }), reduced ? 0 : 700);
  }
  $$('[data-book]').forEach((a) => a.addEventListener('click', () =>
    prefill({ service: a.dataset.book, urgency: a.hasAttribute('data-urgent') ? 'Emergency — as soon as possible' : undefined })));
  $$('a[href="#quote"][data-message]').forEach((a) => a.addEventListener('click', () => prefill({ message: a.dataset.message })));

  /* ---------- Steps rule draws when reached ---------- */
  const steps = $('[data-steps]');
  if (steps && !io) steps.classList.add('in');
})();
