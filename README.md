# Metasho Next.js Website

A modern multilingual Next.js landing page for **Metasho** in Persian, English, and Arabic.

## What changed in this pass
- **Real Vazir font, everywhere, self-hosted.** The whole site now loads the
  actual **Vazirmatn Variable** font via `@fontsource-variable/vazirmatn`
  (npm package, bundled at build time — no dependency on Google's CDN, so it
  works even where fonts.googleapis.com is slow or blocked). It covers
  Persian, Arabic and Latin text in one file, weights 100–900, so headings
  can use true bold/black weights instead of the browser faking it.
- **Motion & effects pass:**
  - Scroll-reveal — every section and card fades/rises into place as you scroll (`IntersectionObserver`, respects `prefers-reduced-motion`)
  - A soft light that follows the cursor (desktop only)
  - 3D tilt on cards that follows the mouse
  - Animated gradient headline text
  - Stat numbers count up when they enter view
  - Scroll progress bar, a nav that condenses on scroll with active-section highlighting, ripple buttons, and a back-to-top button
  - Subtle film-grain texture and a refined gradient border on every glass card
- Better language separation with clearer UI treatment per language
- RTL/LTR-aware spacing and direction handling

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run start
```

## Included
- Persian / English / Arabic language switcher
- RTL support for Persian and Arabic
- Premium glassmorphism + gradient design
- Responsive landing page sections
