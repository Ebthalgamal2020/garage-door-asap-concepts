/** V2 — bold brand red. Brand colours + Poppins come only from the shared preset (verified from garagedoorasapservice.com). */
module.exports = {
  presets: [require('../assets/brand/brand-tokens.js')],
  content: { relative: true, files: ['./index.html', './main.js', '../assets/js/quote-form.js'] },
  theme: {
    extend: {
      maxWidth: { wrap: '1240px' },
      borderRadius: { tile: '1.25rem', card: '1.5rem' },
      transitionTimingFunction: { pop: 'cubic-bezier(.34,1.56,.64,1)', soft: 'cubic-bezier(.22,1,.36,1)' },
      boxShadow: {
        tile: '0 1px 2px rgba(28,31,42,.06), 0 14px 32px -20px rgba(28,31,42,.35)',
        lift: '0 2px 6px rgba(28,31,42,.08), 0 28px 50px -26px rgba(28,31,42,.5)',
        sticker: '0 10px 24px -10px rgba(28,31,42,.55)',
        red: '0 16px 34px -14px rgba(219,0,0,.6)'
      },
      fontSize: { mega: ['clamp(2.55rem, 6.6vw, 5.4rem)', { lineHeight: '.95', letterSpacing: '-0.035em' }] }
    }
  },
  plugins: []
};
