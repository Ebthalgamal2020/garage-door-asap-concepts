/*
 * Presentation switcher — a small floating control for moving between concepts
 * during a client review. Rendered inside Shadow DOM so it can never inherit or
 * leak styles into the concept it sits on.
 *   ?present   → hides the switcher entirely (clean screen-share)
 *   "Hide"     → hides it for the rest of the browser session
 */
(function () {
  const params = new URLSearchParams(location.search);
  let hiddenForSession = false;
  try { hiddenForSession = sessionStorage.getItem('gda-switcher-hidden') === '1'; } catch (e) {}
  if (params.has('present') || hiddenForSession) return;

  const me = document.currentScript;
  const current = (me && me.dataset.concept) || '';
  // Current round (V1–V3) first; the earlier round (tag concepts-v1) stays reachable after the divider.
  const concepts = [
    { id: 'lift', label: 'V1', name: 'The Lift', href: '../the-lift/' },
    { id: 'signature', label: 'V2', name: 'The Signature', href: '../v2-the-signature/' },
    { id: 'lab', label: 'V3', name: 'The Garage Door Lab', href: '../v3-garage-door-lab/' },
    { divider: true },
    { id: 'a', label: 'A', name: 'Classic Chic', href: '../a-classic-chic/' },
    { id: 'b', label: 'B', name: 'Modern Architectural', href: '../b-modern-architectural/' },
    { id: 'c', label: 'C', name: 'Modern Friendly', href: '../c-modern-friendly/' },
    { id: 'v4', label: 'V4', name: 'K1 Journey', href: '../v4-k1-journey/' }
  ];

  const host = document.createElement('div');
  host.setAttribute('data-concept-switcher', '');
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `
    <style>
      :host { all: initial; }
      .sw { position: fixed; left: 16px; bottom: 16px; z-index: 2147483000; font: 500 12px/1 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
            display: flex; align-items: center; gap: 4px; padding: 5px; border-radius: 999px; background: rgba(17,17,17,.88); color: #fff;
            box-shadow: 0 10px 30px -10px rgba(0,0,0,.5); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
      @media (max-width: 767px) { .sw { bottom: 74px; left: 10px; } }
      a, button { all: unset; box-sizing: border-box; cursor: pointer; display: inline-grid; place-items: center; height: 30px; min-width: 30px; padding: 0 9px; border-radius: 999px; color: rgba(255,255,255,.78); transition: background .2s, color .2s; }
      a:hover, button:hover { background: rgba(255,255,255,.14); color: #fff; }
      a:focus-visible, button:focus-visible { outline: 2px solid #9fc0ff; outline-offset: 1px; }
      a[aria-current="page"] { background: #fff; color: #111; }
      .lbl { padding: 0 8px 0 10px; color: rgba(255,255,255,.55); letter-spacing: .08em; text-transform: uppercase; font-size: 10px; }
      .sep { width: 1px; height: 18px; background: rgba(255,255,255,.18); margin: 0 2px; }
      .collapsed .opt { display: none; }
      @media (max-width: 767px) { .lbl { display: none; } }
    </style>
    <nav class="sw collapsed" aria-label="Design concepts">
      <button type="button" class="toggle" aria-expanded="false" title="Switch concept">Concepts</button>
      <span class="sep opt"></span>
      ${concepts.map((c) => c.divider ? '<span class="sep opt" title="Earlier round"></span>' : `<a class="opt" href="${c.href}" title="${c.label} — ${c.name}" ${c.id === current ? 'aria-current="page"' : ''}>${c.label}</a>`).join('')}
      <span class="sep opt"></span>
      <a class="opt" href="../" title="All concepts">All</a>
      <button type="button" class="opt hide" title="Hide for this session">✕</button>
    </nav>`;
  const nav = root.querySelector('.sw');
  const toggle = root.querySelector('.toggle');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('collapsed') === false;
    toggle.setAttribute('aria-expanded', String(open));
  });
  root.querySelector('.hide').addEventListener('click', () => {
    try { sessionStorage.setItem('gda-switcher-hidden', '1'); } catch (e) {}
    host.remove();
  });
  document.body.appendChild(host);
})();
