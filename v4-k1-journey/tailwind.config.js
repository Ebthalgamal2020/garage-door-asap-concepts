/** Version 4 — K1 Journey. Brand colours + Poppins come only from the shared preset; this file adds layout tokens. */
module.exports = {
  presets: [require('../assets/brand/brand-tokens.js')],
  content: { relative: true, files: ['./index.html', './main.js', '../assets/js/quote-form.js'] },
  theme: {
    extend: {
      maxWidth: { wrap: '1240px' },
      transitionTimingFunction: { lift: 'cubic-bezier(.65,0,.25,1)' }
    }
  },
  plugins: []
};
