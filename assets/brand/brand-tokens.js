/**
 * Garage Door ASAP — shared brand tokens (Tailwind preset).
 * Single source of truth for every concept: `presets: [require('../assets/brand/brand-tokens.js')]`.
 *
 * Every value below is taken from the live site (garagedoorasapservice.com, theme `xvxlabs-gasap/style.css`,
 * inspected 18 Oct 2026) or measured from the client's own logo / Mr. ASAP mascot artwork:
 *   red        #DB0000  theme: links, buttons, .star, "sunflower" CTA sections        white text 5.23:1
 *   red-deep   #AD2529  measured: Mr. ASAP mascot lettering/cape — hover & pressed    white text 6.83:1
 *   red-logo   #ED161F  measured: "ASAP" wordmark in logo-1.png — logo artwork only
 *   midnight   #2F2D2E  theme: .nav_theme_midnight / .section_theme_midnight (dark UI)
 *   ink        #1C1F2A  theme: html { color }, hero overlay — body text
 *   slate      #2C2F39  theme: .section_theme_midnight_3, white-section text
 *   grey-*              theme: midnight_8…12 section greys + its neutral scale
 *
 * Accessibility rules (WCAG AA):
 *   - Red text only on white / grey-50 / grey-100. Never red text on midnight/ink (2.6:1) — use a red fill instead.
 *   - Muted text: grey-700 on light (6.3:1), grey-400 on dark (7.7:1). grey-500/600 are for borders and icons only.
 *
 * Deliberately excluded: the theme's "sunflower" yellows (#FDD032, #D19000, #FCDA64…) and the inline #FFC600 star
 * colour — they are not part of the identity customers see (logo, mascot, trucks). Stars are brand red, as the
 * theme's own `.star` rule specifies.
 *
 * Fonts: the theme declares Poppins for html/body/headings (h1 800, headings 600, section titles 700, body 400)
 * but never loads it — the live site falls back to the visitor's system sans. Poppins (SIL OFL) is loaded from
 * Google Fonts in every concept so the declared brand face actually renders.
 */
const brand = {
  red: { DEFAULT: '#DB0000', deep: '#AD2529', logo: '#ED161F', tint: '#FDF0F0' },
  midnight: '#2F2D2E',
  ink: '#1C1F2A',
  slate: '#2C2F39',
  white: '#FFFFFF',
  grey: {
    50: '#F6F7F8',
    100: '#EFF0F2',
    200: '#E6E8EA',
    300: '#E1E2E5',
    400: '#C0C2C6',
    500: '#949596',
    600: '#7F8188',
    700: '#5D6068',
    800: '#3C3F49',
    900: '#0D0F14'
  }
};

module.exports = {
  theme: {
    extend: {
      colors: { brand },
      fontFamily: {
        brand: ['Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif']
      },
      fontWeight: { body: '400', heading: '600', title: '700', display: '800' },
      letterSpacing: { brand: '-0.0125em' },
      borderRadius: { brand: '4px' },
      boxShadow: { brand: '0 2px 10px 0 rgba(28, 31, 42, 0.18)' }
    }
  }
};

module.exports.brand = brand;
