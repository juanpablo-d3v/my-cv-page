# Proposal

## Why

The GitHub Pages-hosted CV downloads ~11 MB of images on first visit: the six technical-stack images ship as lossless PNGs of 1.2–2.3 MB each at 1312x816, rendered into ~308x192 card slots, and the hero background image is deprioritized with `loading="lazy"` despite being the first thing visitors see. GitHub Pages serves a 10-minute cache (`max-age=600`), so returning visitors repeatedly re-pay this cost. The result is a slow, low-priority hero and visibly late-loading skill cards.

## What Changes

- Convert the 8 heaviest images to WebP at their needed display resolution: hero background (`desktop-wide.jpg`), six skills images, and the TCS logo. Expected total drops from ~11 MB to ~350 KB (~97% reduction).
- Delete the replaced source files (the six `skills_*.png`, `desktop-wide.jpg`, `logo-tcs.png`) after conversion; the repo and deploy no longer carry ~11 MB of dead weight.
- Fix hero loading priority: remove `loading="lazy"` from the hero image, add `fetchpriority="high"` and `decoding="async"`, and add a `<link rel="preload" as="image">` for the hero in `<head>`.
- Add low-quality inline placeholders (LQIP) for the six skills cards: tiny blurred data-URI thumbnails painted from CSS, with a small runtime JS module that fades the real WebP over the blur once loaded. Cards already render grayscale at reduced opacity, so the blurred preview reads as intentional design, not degradation.
- Harden the fade behavior: images remain fully visible without JavaScript (fade styles gated behind a `js-enabled` class), and fades are skipped under `prefers-reduced-motion`.

Non-goals: no build pipeline, CI, or automation of image optimization; no `srcset`/`<picture>` variants or AVIF; no hero LQIP; no changes to unrelated unused images, the CSS `@import` chain, or icon font loading.

## Capabilities

### New Capabilities
- `image-loading`: How page images are formatted, prioritized, and progressively presented — WebP assets sized for their display slots, an eagerly high-priority hero background, and skills cards that paint a blurred placeholder instantly and fade in the real image on load, degrading gracefully without JavaScript or motion.

### Modified Capabilities
<!-- None: the project has no existing specs to modify. -->

## Impact

- `images/`: 8 new `.webp` files; 8 replaced source files deleted (the six `skills_*.png`, `desktop-wide.jpg`, `logo-tcs.png`). Small existing assets (`ntt.svg`, `jp.svg`, `logo_stj.png`, `inteliglobe.jpeg`) and unreferenced files are untouched.
- `index.html`: 8 `<img src>` updates, hero image attributes (`fetchpriority`, `decoding`, lazy removal), one `<link rel="preload">` in `<head>`.
- `styles/skills.css`: blurred data-URI placeholder backgrounds and fade-in styles scoped to `.js-enabled`.
- `styles/hero.css`: hero fade-in style scoped to `.js-enabled`.
- `scripts/`: new small `imageFade.js` module following existing conventions (like `scrollAnimations.js`), wired into `main.js`.
- No new dependencies, no build step, no deployment changes beyond asset files themselves.
