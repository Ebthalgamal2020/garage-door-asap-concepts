/** Concept A — Classic Chic, rebuilt on the real Garage Door ASAP identity.
 *  Navy, white and steel grey from the Mr. ASAP emblem; red is reserved for calls and emergencies.
 *  Archivo (display, semi-condensed) + Public Sans (text). */
module.exports = {
  content: { relative: true, files: ['./index.html', './main.js', '../assets/js/quote-form.js'] },
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#10203A', 2: '#1A2D4E', 3: '#243B62', deep: '#0A1628' },
        steel: { DEFAULT: '#8A8D91', light: '#C9CCD1', dark: '#5D6168' },
        mist: '#EDF0F4',
        cloud: '#F6F7F9',
        ink: '#0E1726',
        slate: '#4F5A6B',
        // #DB0000 is the live site's CTA red; #AD2529 is the mascot's deep red. light = red text on navy.
        red: { DEFAULT: '#DB0000', deep: '#AD2529', light: '#FF6B6B', soft: '#FCE8E8' },
        line: 'rgba(16, 32, 58, 0.12)'
      },
      fontFamily: {
        display: ['Archivo', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        sans: ['"Public Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif']
      },
      maxWidth: { wrap: '1280px' },
      letterSpacing: { label: '0.16em' },
      transitionTimingFunction: { door: 'cubic-bezier(.7,0,.2,1)', silk: 'cubic-bezier(.22,.61,.36,1)' }
    }
  },
  plugins: []
};
