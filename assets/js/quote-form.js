/*
 * Shared quote-form behaviour for all concepts (vanilla JS, no dependencies).
 * Each concept owns its markup and styling; this module only handles
 * validation, accessible error messaging, urgency hints and the demo hand-off.
 *
 * No backend exists for these demos, so a valid submission never claims to be "sent".
 * Instead the visitor gets an honest notice plus two real options:
 * a pre-filled email to the business (mailto:) and a tap-to-call link.
 *
 * Markup contract (inside a <form data-form novalidate>):
 *   - inputs with name="name|phone|email|city|message" (+ optional select[data-service-select])
 *   - or the approved short form (V1–V3): name, phone, city, select name="problem" (required),
 *     textarea name="details" (optional), radios name="timing" [data-urgency]
 *   - error element referenced by each input's aria-describedby (id ending in "-err")
 *   - optional radios [data-urgency] + [data-emergency-hint]
 *   - [data-status] live region for the result
 */
(function () {
  const BUSINESS = {
    phoneDisplay: '(877) 787-7121',
    phoneHref: 'tel:+18777877121',
    email: 'info@garagedoorasapservice.com'
  };

  const rules = {
    name: (v) => (v.trim().length >= 2 ? '' : 'Please enter your name.'),
    phone: (v) => {
      const digits = v.replace(/\D/g, '');
      if (!digits) return 'Please enter a phone number so we can call you back.';
      return digits.length >= 10 && digits.length <= 11 ? '' : 'Please enter a 10-digit phone number, e.g. (407) 555-0123.';
    },
    email: (v) => (!v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'That email address doesn’t look right — please check it, or leave it blank.'),
    city: (v) => (v.trim().length >= 2 ? '' : 'Please tell us which city the door is in.'),
    zip: (v) => (/^\d{5}$/.test(v.trim()) ? '' : 'Please enter a 5-digit ZIP code.'),
    message: (v) => (v.trim().length >= 10 ? '' : 'Please describe the problem in a few words (at least 10 characters).'),
    problem: (v) => (v ? '' : 'Please choose the problem, or “Not sure”.'),
    details: (v) => (v.length <= 1000 ? '' : 'Please keep the details under 1,000 characters.')
  };

  function errorEl(input) {
    const ids = (input.getAttribute('aria-describedby') || '').split(/\s+/);
    const id = ids.find((x) => /-err$/.test(x));
    return id ? document.getElementById(id) : null;
  }

  function validateField(input) {
    const rule = rules[input.name];
    if (!rule) return true;
    const msg = rule(input.value);
    const err = errorEl(input);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) err.textContent = msg;
    return !msg;
  }

  function formatPhone(input) {
    const d = input.value.replace(/\D/g, '').replace(/^1(?=\d{10})/, '').slice(0, 10);
    if (d.length === 10) input.value = `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }

  function buildMailto(data) {
    const lines = [
      'Quote request (sent from the website demo)',
      '',
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      data.email ? `Email: ${data.email}` : null,
      data.city ? `City: ${data.city}` : null,
      data.zip ? `ZIP: ${data.zip}` : null,
      data.service ? `Service: ${data.service}` : null,
      data.problem ? `Problem: ${data.problem}` : null,
      data.urgency || data.timing ? `Timing: ${data.urgency || data.timing}` : null,
      data.message !== undefined ? '' : null,
      data.message !== undefined ? 'Problem:' : null,
      data.message !== undefined ? data.message : null,
      data.details ? '' : null,
      data.details ? `Details: ${data.details}` : null
    ].filter((l) => l !== null);
    const subject = `Quote request — ${data.service || data.problem || 'Garage door'} — ${data.city || data.zip || ''}`.replace(/ — $/, '');
    return `mailto:${BUSINESS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  }

  function init(form, opts = {}) {
    if (!form || form.dataset.formReady) return;
    form.dataset.formReady = 'true';
    const o = Object.assign({
      primaryClass: '',
      secondaryClass: '',
      titleClass: 'font-semibold',
      onReady: null
    }, opts);
    const status = form.querySelector('[data-status]');
    const fields = [...form.querySelectorAll('input[name], textarea[name], select[name]')].filter((f) => rules[f.name]);
    let attempted = false;

    fields.forEach((f) => {
      f.addEventListener('blur', () => {
        if (f.name === 'phone') formatPhone(f);
        if (attempted || f.value) validateField(f);
      });
      f.addEventListener(f.tagName === 'SELECT' ? 'change' : 'input', () => {
        if (f.getAttribute('aria-invalid') === 'true') validateField(f);
      });
    });

    const hint = form.querySelector('[data-emergency-hint]');
    form.querySelectorAll('[data-urgency]').forEach((r) =>
      r.addEventListener('change', () => {
        if (hint) hint.dataset.show = String(/^Emergency/i.test(r.value) && r.checked);
      })
    );

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      attempted = true;
      const phone = form.querySelector('[name="phone"]');
      if (phone) formatPhone(phone);
      const invalid = fields.filter((f) => !validateField(f));
      if (invalid.length) {
        if (status) { status.dataset.show = 'false'; status.innerHTML = ''; }
        form.dataset.state = 'invalid';
        invalid[0].focus();
        return;
      }

      const fd = new FormData(form);
      const data = Object.fromEntries([...fd.entries()].map(([k, v]) => [k, String(v).trim()]));
      form.dataset.state = 'ready';
      if (!status) return;

      const first = (data.name || '').split(' ')[0];
      status.innerHTML = '';
      const title = document.createElement('p');
      title.className = o.titleClass;
      title.textContent = `Thank you${first ? ', ' + first : ''} — your request is ready.`;
      const body = document.createElement('p');
      body.className = 'mt-2';
      body.textContent = 'This is a design preview with no server connected, so nothing has been sent automatically. Choose how you’d like to reach us:';
      const actions = document.createElement('div');
      actions.className = 'mt-4 flex flex-wrap gap-3';
      const mail = document.createElement('a');
      mail.href = buildMailto(data);
      mail.className = o.primaryClass;
      mail.textContent = 'Send this request by email';
      const call = document.createElement('a');
      call.href = BUSINESS.phoneHref;
      call.className = o.secondaryClass;
      call.textContent = `Call ${BUSINESS.phoneDisplay}`;
      actions.append(mail, call);
      status.append(title, body, actions);
      status.dataset.show = 'true';
      status.focus({ preventScroll: true });
      status.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
      if (typeof o.onReady === 'function') o.onReady(data);
    });

    form.addEventListener('reset', () => {
      attempted = false;
      fields.forEach((f) => { f.removeAttribute('aria-invalid'); const err = errorEl(f); if (err) err.textContent = ''; });
      if (status) { status.dataset.show = 'false'; status.innerHTML = ''; }
      if (hint) hint.dataset.show = 'false';
      delete form.dataset.state;
    });
  }

  /** Pre-select a service in the form (used by "Book this" / "Enquire" links). */
  function prefill(form, { service, message, urgency } = {}) {
    if (!form) return;
    const select = form.querySelector('[data-service-select]');
    if (select && service !== undefined) {
      const opt = [...select.options].find((op) => op.value === service || op.text === service);
      select.value = opt ? opt.value : '';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const msg = form.querySelector('[name="message"], [name="details"]');
    if (msg && message && !msg.value.trim()) msg.value = message;
    if (urgency) {
      const r = [...form.querySelectorAll('[data-urgency]')].find((x) => x.value === urgency);
      if (r) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); }
    }
  }

  window.GDAForm = { init, prefill, validateField, BUSINESS };
})();
