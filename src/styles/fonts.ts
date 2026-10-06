import localFont from 'next/font/local';

/**
 * Self-hosted variable fonts copied from the @fontsource-variable packages
 * (OFL licences alongside the files in src/fonts). next/font/local handles
 * preloading and size-adjusted fallbacks so text does not shift on load.
 */
export const bricolage = localFont({
  src: '../fonts/bricolage-grotesque-latin-opsz-normal.woff2',
  variable: '--font-bricolage',
  weight: '200 800',
  display: 'swap',
  fallback: ['Arial Black', 'Arial', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

export const inter = localFont({
  src: '../fonts/inter-latin-opsz-normal.woff2',
  variable: '--font-inter',
  weight: '100 900',
  display: 'swap',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

export const jetbrains = localFont({
  src: '../fonts/jetbrains-mono-latin-wght-normal.woff2',
  variable: '--font-jetbrains',
  weight: '100 800',
  display: 'swap',
  fallback: ['ui-monospace', 'Menlo', 'monospace'],
  adjustFontFallback: false,
});

export const fontClassName = `${bricolage.variable} ${inter.variable} ${jetbrains.variable}`;
