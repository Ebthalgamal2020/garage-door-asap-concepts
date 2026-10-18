/** "The Signature" — brand colours + Poppins come only from the shared preset (verified from garagedoorasapservice.com). */
module.exports = {
  presets: [require('../assets/brand/brand-tokens.js')],
  content: { relative: true, files: ['./index.html', './main.js', '../assets/js/quote-form.js'] },
  theme: {
    extend: {
      maxWidth: { wrap: '1320px' },
      transitionTimingFunction: { ed: 'cubic-bezier(.2,.7,.1,1)' },
      fontWeight: { light: '300' }
    }
  },
  plugins: []
};
