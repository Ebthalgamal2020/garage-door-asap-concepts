/** V2 "The Signature" — soft, premium. Brand colours + Poppins come only from the shared preset (verified from garagedoorasapservice.com). */
module.exports = {
  presets: [require('../assets/brand/brand-tokens.js')],
  content: { relative: true, files: ['./index.html', './main.js', '../assets/js/quote-form.js'] },
  theme: {
    extend: {
      maxWidth: { wrap: '1240px' },
      borderRadius: { card: '1.75rem', sheet: '2.5rem' }, // one radius scale: pill / 28 / 40
      transitionTimingFunction: { soft: 'cubic-bezier(.22,1,.36,1)' },
      boxShadow: {
        // one shadow scale: soft / medium / lifted (+ the red CTA glow)
        soft: '0 1px 2px rgba(28,31,42,.04), 0 8px 24px -14px rgba(28,31,42,.16)',
        medium: '0 1px 2px rgba(28,31,42,.06), 0 16px 36px -18px rgba(28,31,42,.28)',
        lifted: '0 2px 6px rgba(28,31,42,.06), 0 32px 64px -28px rgba(28,31,42,.42)',
        glow: '0 14px 34px -12px rgba(219,0,0,.55)'
      },
      fontWeight: { light: '300' }
    }
  },
  plugins: []
};
