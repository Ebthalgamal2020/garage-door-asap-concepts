/** Concept B — Modern Architectural. Stone, charcoal, chalk + a signal accent; Archivo (variable width) + JetBrains Mono. */
module.exports = {
  content: { relative: true, files: ['./index.html', './main.js', '../assets/js/quote-form.js'] },
  theme: {
    extend: {
      colors: {
        chalk: '#F5F3EF',
        stone: { DEFAULT: '#E7E3DB', 2: '#DAD4C9', 3: '#C8C1B4' },
        char: { DEFAULT: '#1B1C1A', 2: '#262724', 3: '#353632' },
        mute: '#6B6860',
        signal: { DEFAULT: '#DB0000', dark: '#AD2529', light: '#FF7468' }
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      maxWidth: { frame: '1480px' },
      transitionTimingFunction: { arch: 'cubic-bezier(.77,0,.18,1)', out: 'cubic-bezier(.16,1,.3,1)' }
    }
  },
  plugins: []
};
