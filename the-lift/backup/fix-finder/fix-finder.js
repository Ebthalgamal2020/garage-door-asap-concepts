/* The Lift: fix finder behaviour (backed up 19 Oct 2026). Lived inside the main.js IIFE; uses $, $$, smooth and prefillForm from that file. */
  /* =====================================================================
     Fix finder + service card
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
  const svcCard = $('[data-svc-card]');
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

  // Service card: the business's own photo of the repair, or the symptom icon when there is no photo
  function renderCard(s) {
    svcCard.classList.remove('result-swap'); void svcCard.offsetWidth; svcCard.classList.add('result-swap');
    svcCard.innerHTML = s.img
      ? `<img class="absolute inset-0 h-full w-full ${s.fit === 'contain' ? 'bg-white object-contain p-10 pb-24' : 'object-cover'}" data-c-img>
         <span class="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-brand-ink/80 to-transparent" aria-hidden="true"></span>
         <figcaption class="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6"><span class="block text-[0.72rem] font-title uppercase tracking-[0.16em] text-white/80">Our service</span><span class="mt-1 block text-xl font-title" data-c-name></span></figcaption>`
      : `<div class="absolute inset-0 grid place-items-center bg-gradient-to-b from-white to-brand-grey-100"><span class="grid h-24 w-24 place-items-center rounded-full bg-brand-red-tint text-brand-red"><svg viewBox="0 0 24 24" class="h-11 w-11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICONS[s.id]}"/></svg></span></div>
         <figcaption class="absolute inset-x-0 bottom-0 p-5 sm:p-6"><span class="block text-[0.72rem] font-title uppercase tracking-[0.16em] text-brand-grey-700">Our service</span><span class="mt-1 block text-xl font-title text-brand-midnight" data-c-name></span></figcaption>`;
    $('[data-c-name]', svcCard).textContent = s.service;
    const img = $('[data-c-img]', svcCard);
    if (img) { img.alt = s.alt; img.src = s.img; }
  }

  function renderResult(s) {
    result.classList.remove('result-swap'); void result.offsetWidth; result.classList.add('result-swap');
    result.innerHTML = `
      <div>
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
          <p class="mt-4 text-xs text-brand-grey-400">A guide only: your technician confirms the cause on site.</p>
        </div>
      </div>`;
    $('[data-r-title]', result).textContent = s.service;
    $('[data-r-sym]', result).textContent = s.label;
    $('[data-r-text]', result).textContent = s.text;
    $('[data-r-tip]', result).textContent = s.tip;
    $('[data-book]', result).addEventListener('click', () => prefillForm({ service: s.service, urgency: s.urgent ? 'Emergency — as soon as possible' : undefined }));
  }

  function selectSymptom(id) {
    const s = SYMPTOMS.find((x) => x.id === id);
    if (!s) return;
    $$('[data-symptom]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.symptom === id)));
    renderCard(s);
    renderResult(s);
  }

  Object.values(symLists).forEach((list) => list.addEventListener('click', (e) => {
    const b = e.target.closest('[data-symptom]');
    if (!b) return;
    selectSymptom(b.dataset.symptom);
    if (innerWidth < 1024) result.scrollIntoView({ behavior: smooth, block: 'nearest' });
  }));
  $$('[data-pick]').forEach((a) => a.addEventListener('click', () => selectSymptom(a.dataset.pick)));
  selectSymptom('spring');

