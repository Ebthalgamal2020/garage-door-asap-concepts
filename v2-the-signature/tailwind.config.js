/** V2 — bold brand red. Brand colours + Poppins come only from the shared preset (verified from garagedoorasapservice.com). */
module.exports = {
  presets: [require('../assets/brand/brand-tokens.js')],
  content: { relative: true, files: ['./index.html', './main.js', '../assets/js/quote-form.js'] },
  theme: {
    extend: {
      maxWidth: { wrap: '1240px' },
      borderRadius: { tile: '.875rem', card: '1.125rem' },
      transitionTimingFunction: { pop: 'cubic-bezier(.34,1.56,.64,1)', soft: 'cubic-bezier(.22,1,.36,1)' },
      boxShadow: {
        tile: '0 1px 2px rgba(28,31,42,.04), 0 8px 24px -18px rgba(28,31,42,.22)',
        lift: '0 1px 3px rgba(28,31,42,.05), 0 24px 48px -30px rgba(28,31,42,.32)',
        sticker: '0 10px 24px -10px rgba(28,31,42,.55)',
        red: '0 16px 34px -14px rgba(219,0,0,.6)'
      },
      fontSize: { mega: ['clamp(2.55rem, 6.6vw, 5.4rem)', { lineHeight: '.95', letterSpacing: '-0.035em' }] }
    }
  },
  plugins: []
};
