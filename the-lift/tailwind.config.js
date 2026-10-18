/** "The Lift" — brand colours + Poppins come only from the shared preset (verified from garagedoorasapservice.com). */
module.exports = {
  presets: [require('../assets/brand/brand-tokens.js')],
  content: { relative: true, files: ['./index.html', './main.js', '../assets/js/quote-form.js'] },
  theme: {
    extend: {
      maxWidth: { wrap: '1280px' },
      transitionTimingFunction: { lift: 'cubic-bezier(.65,0,.2,1)', glide: 'cubic-bezier(.22,1,.36,1)' },
      fontSize: { display: ['clamp(2.6rem, 5.2vw, 4.6rem)', { lineHeight: '1.02', letterSpacing: '-0.035em' }] }
    }
  },
  plugins: []
};
