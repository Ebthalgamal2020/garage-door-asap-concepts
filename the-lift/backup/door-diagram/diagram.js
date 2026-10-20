/* The Lift: door diagram behaviour (backed up 19 Oct 2026). Lived inside the main.js IIFE, after selectSymptom().
   Also needs, inside selectSymptom(s):
     $$('[data-hotspot]').forEach((h) => h.setAttribute('aria-pressed', String(s.parts.includes(h.dataset.hotspot))));
     diagram.dataset.active = id;
     $$('.part', diagram).forEach((p) => p.classList.toggle('on', s.parts.includes(p.dataset.part) || (p.dataset.part === 'door' && s.parts.some((x) => x === 'rollers' || x === 'track'))));
   and near the top: const diagram = $('[data-diagram]');
   const PART_TO_SYMPTOM = { spring: 'spring', cables: 'cable', opener: 'hum', track: 'offtrack', rollers: 'noisy', sensors: 'reverse' };
   $$('[data-hotspot]').forEach((h) => h.addEventListener('click', () => selectSymptom(PART_TO_SYMPTOM[h.dataset.hotspot])));
   Each SYMPTOMS entry keeps its parts: [...] list for this. */
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

