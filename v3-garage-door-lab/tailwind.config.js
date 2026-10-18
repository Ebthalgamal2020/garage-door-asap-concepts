/** "The Garage Door Lab" — brand colours + Poppins come only from the shared preset (verified from garagedoorasapservice.com). */
module.exports = {
  presets: [require('../assets/brand/brand-tokens.js')],
  content: { relative: true, files: ['./index.html', './main.js', '../assets/js/quote-form.js'] },
  theme: {
    extend: {
      maxWidth: { wrap: '1280px' },
      transitionTimingFunction: { glide: 'cubic-bezier(.22,1,.36,1)' },
      fontSize: { display: ['clamp(2.3rem, 4.6vw, 4rem)', { lineHeight: '1.04', letterSpacing: '-0.035em' }] }
    }
  },
  plugins: []
};
