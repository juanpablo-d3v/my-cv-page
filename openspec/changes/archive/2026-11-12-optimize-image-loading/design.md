# Design

## Context

Static CV site (no build step, no CI) deployed on GitHub Pages from the repo; browser-run ES modules under `scripts/` bootstrapped by `main.js` (`DOMContentLoaded` pattern, e.g. `scrollAnimations.js`). Images referenced directly in `index.html`; styles split per-section and chained via `@import` in `style.css`. GitHub Pages serves `cache-control: max-age=600`, so asset weight recurs for returning visitors. See proposal.md for the size/priority problems being fixed.

Measured display slots (from CSS):

| Asset | Source | Rendered slot | Export target |
|---|---|---|---|
| Hero background | `desktop-wide.jpg` 1280x960, 76 KB | full viewport, behind 0.4 opacity + gradient | 1280x960 WebP q~45, <= 50 KB |
| Skills (x6) | `skills_*.png` 1312x816, 1.2-2.3 MB | ~308x192 (4-col grid, `height: 12rem`) | ~650x408 WebP q~80, <= 80 KB each |
| TCS logo | `logo-tcs.png` 7429x1771, 196 KB | ~153x64 (`4rem` box, 2.39:1) | ~612x256 WebP q~85, <= 15 KB |

2x-slot sizing covers retina displays without shipping 4x pixels; ~650px wide instead of 1312px.

## Goals / Non-Goals

**Goals:**
- One-time conversion producing the WebP set above; no pipeline or automation.
- Hero fetched eagerly, ahead of everything else.
- Skills cards: CSS-painted blurred placeholder + fade-in of the real image.
- Works without JavaScript; fades disabled under `prefers-reduced-motion`.

**Non-Goals:**
- AVIF, `srcset`/`<picture>` variants, hero LQIP (rejected: gradient overlay already makes the pre-image state look finished; the preload-priority workaround for data-URI src adds machinery for no visible gain).
- Automation/CI of image optimization; CSS `@import` chain and icon font (separate threads, deferred).
- Touching unreferenced files (`desktop.jpg`, `photo_*.jpg`, `cv-web-sketching.jpg`, `stich.html`) or small assets (`ntt.svg`, `jp.svg`, `logo_stj.png`, `inteliglobe.jpeg`).

## Decisions

### D1: WebP, single file per image, renamed in place
WebP is universally supported and enough to hit the budget; AVIF would need `<picture>` fallbacks for marginal gain. Files: `images/hero.webp` (renamed from `desktop-wide.jpg` for clarity), `images/skills_*.webp` (same names, new extension), `images/logos/logo-tcs.webp`. Conversion via ImageMagick (`identify` already on this machine; `magick <in> -resize <dims> -quality <q> <out>.webp`), run once by hand, no script added to the repo. GitHub Pages sets MIME by extension, so the extension change is required. Source files are deleted after conversion — git history keeps them recoverable.

### D2: Hero priority via plain eager tag + preload link
In `index.html`: remove `loading="lazy"` from the hero `<img>`, add `fetchpriority="high"` and `decoding="async"`, and add `<link rel="preload" as="image" href="images/hero.webp" fetchpriority="high">` in `<head>` so the fetch starts at head-parse time. Skills/logos keep `loading="lazy"` (correct for below-fold).

### D3: Skills LQIP as CSS backgrounds, not src-swapping
The blurred preview is a base64 data URI (~24px wide, blur baked in at export, ~0.5 KB each, ~3 KB total) set as `background-image` on `.skill-card-image`. Each card gets a modifier class in HTML (e.g. `skill-card-image--ai`) so six small CSS rules paint the right thumb. This paints during CSS parse with zero network requests and keeps the browser's native `loading="lazy"` untouched. Rejected alternative: swapping `src` via IntersectionObserver — duplicates native lazy loading with custom code and loses preload-scanner priority.

The real `<img>` sits above the background. When its `load` event fires, JS adds `is-loaded` and it fades from transparent to its design opacity. Because cards already render grayscale at 0.6 opacity, the blur state reads as intentional.

### D4: Fade mechanics — progressive enhancement, one small module
Styles are scoped under a `.js-enabled` class that `main.js` adds to `<html>` at startup, so without JS the images show at full design opacity immediately (spec: visible without JavaScript):

- `.js-enabled .skill-card-image img { opacity: 0; transition: opacity var(--transition-slow); }`
- `.js-enabled .skill-card-image img.is-loaded { opacity: 0.6; }` (hero equivalent: `0.4`)
- `@media (prefers-reduced-motion: reduce)`: transitions removed.

A new `scripts/imageFade.js` (same class/module conventions as `scrollAnimations.js`, wired in `main.js`) handles the `is-loaded` class: for each target image, if `img.complete && img.naturalWidth > 0` (cached load finished before JS ran), add the class immediately; otherwise attach a `load` listener. On `error`, add the class anyway so the card shows its alt/placeholder state rather than staying stuck faded. Reduced motion is handled purely in CSS.

Interaction with existing rules: `.skill-card-image img` already declares `transition: all` for the hover color reveal — the fade transition composes on the same `opacity` property, and hover (`opacity: 1`) remains the winning declaration once loaded. `scrollAnimations.js` animates section-level opacity/transform and composes independently.

### D5: Explicit dimensions on skills images
Add `width`/`height` attributes matching the exported intrinsic size (~650x408) on the six skills `<img>` tags. The card's fixed `12rem` image height prevents layout shift anyway; this is cheap insurance for aspect-ratio hints.

## Risks / Trade-offs

- [Hero q~45 shows banding] → It renders at 0.4 opacity behind a dark gradient covering ~70%; visually verify, raise quality in steps (50/55) if needed — still far under budget.
- [LQIP thumbs bloat CSS] → Cap each at ~0.6 KB base64 (~3 KB total); measured after export.
- [Fade appears broken if `is-loaded` never fires] → `complete` pre-check, `load` + `error` listeners all add the class; no-JS path bypasses fades entirely via `.js-enabled` scoping.
- [Quality/regression invisible until deploy] → Verify locally with a server (`python3 -m http.server`) before push; GH Pages' 10-minute cache means a fix propagates quickly after rollback (`git revert`).

## Migration Plan

Single deploy: convert assets, update `index.html`/CSS/JS in one change, push to `main`. Old PNG/JPG URLs are replaced by `.webp` URLs (site is self-contained; no external references expected). Rollback is `git revert` of the change commit.
