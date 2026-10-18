/** Concept hub (root index.html) — a neutral presentation page that lets the concepts speak for themselves. */
module.exports = {
  content: { relative: true, files: ['./index.html'] },
  theme: {
    extend: {
      colors: { ink: '#111213', panel: '#1A1B1D', line: 'rgba(255,255,255,.1)', fog: '#A3A6AB', brand: '#DB0000' },
      fontFamily: { sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'] },
      maxWidth: { hub: '1320px' }
    }
  },
  plugins: []
};
