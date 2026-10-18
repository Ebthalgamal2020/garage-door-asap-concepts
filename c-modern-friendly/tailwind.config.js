/** Concept C — Modern Friendly. White, confident blue, sunny accent; Bricolage Grotesque + Figtree. */
module.exports = {
  content: { relative: true, files: ['./index.html', './main.js', '../assets/js/quote-form.js'] },
  theme: {
    extend: {
      colors: {
        cloud: '#F4F7FC',
        sky: { DEFAULT: '#E7EFFE', 2: '#CFDFFD' },
        blue: { DEFAULT: '#1D55E5', deep: '#1240B5', ink: '#0E2D7A' },
        navy: '#0B1A33',
        slate: '#4E5D78',
        sun: { DEFAULT: '#FFC845', soft: '#FFF4D6' },
        alert: { DEFAULT: '#DB0000', deep: '#AD2529', soft: '#FDECEC' }
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['Figtree', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif']
      },
      maxWidth: { page: '1240px' },
      boxShadow: {
        soft: '0 1px 2px rgba(11,26,51,.06), 0 12px 32px -12px rgba(11,26,51,.18)',
        lift: '0 2px 4px rgba(11,26,51,.06), 0 24px 48px -16px rgba(29,85,229,.35)'
      },
      transitionTimingFunction: { spring: 'cubic-bezier(.34,1.56,.64,1)', smooth: 'cubic-bezier(.22,1,.36,1)' }
    }
  },
  plugins: []
};
