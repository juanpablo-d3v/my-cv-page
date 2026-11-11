# Tasks

## 1. Convert image assets (one-time, no repo scripts)

- [x] 1.1 Convert hero: `magick images/desktop-wide.jpg -quality 45 images/hero.webp` (keep 1280x960). Verify with `file images/hero.webp` (WebP) and `du -b` <= 50 KB; if banding is visible at 0.4 opacity behind the gradient, raise quality in steps (50, 55) and re-check the budget
- [x] 1.2 Convert the six skills images: for each, `magick images/skills_<name>.png -resize 650x -quality 80 images/skills_<name>.webp` (yields ~650x404). Verify each is WebP and <= 80 KB with `file` + `du -b`
- [x] 1.3 Convert the TCS logo: `magick images/logos/logo-tcs.png -resize x128 -quality 85 images/logos/logo-tcs.webp` (yields ~537x128, ~2.6x its ~48px display height). Verify WebP and <= 15 KB
- [x] 1.4 Generate six LQIP thumbs to a temp dir (not committed): for each skills WebP, `magick images/skills_<name>.webp -resize 24x -blur 0x1 -quality 50 /tmp/opencode/lqip/skills_<name>.webp`, then `base64 -w0` each. Verify each base64 string is <= ~0.8 KB and the six together stay around ~3 KB
- [x] 1.5 Delete the replaced originals (six `images/skills_*.png`, `images/desktop-wide.jpg`, `images/logos/logo-tcs.png`) and verify with `ls` that only the `.webp` versions and the untouched small assets remain in `images/`

## 2. Update index.html

- [x] 2.1 Hero priority: in `<head>` add `<link rel="preload" as="image" href="images/hero.webp" fetchpriority="high">`; on the hero `<img>` remove `loading="lazy"` and add `fetchpriority="high" decoding="async"` with `src="images/hero.webp"`. Verify with `grep -n "hero.webp\|loading=\"lazy\"" index.html` — preload present, hero img carries no lazy, and remaining `loading="lazy"` hits are only logos + skills images
- [x] 2.2 Swap the six skills `<img>` sources to `images/skills_<name>.webp` and add `width="650" height="404"`. Verify with `grep -c "skills_.*\.webp" index.html` = 6 and no `skills_.*\.png` matches remain
- [x] 2.3 Add a per-card modifier class to each `.skill-card-image` container (e.g. `skill-card-image skill-card-image--ai`) matching the six images, and swap the TCS logo `<img>` to `images/logos/logo-tcs.webp`. Verify with `grep -n "skill-card-image--" index.html` = 6 and no `.png` logo reference remains

## 3. Placeholder + fade layer (CSS and runtime JS)

- [x] 3.1 In `styles/skills.css`: add six `.skill-card-image--<name>` rules setting `background-image: url(data:image/webp;base64,...)` from 1.4 thumbs, plus fade styles scoped under `.js-enabled` (`.skill-card-image img` starts `opacity: 0` with `transition: opacity var(--transition-slow)`, `.skill-card-image img.is-loaded` returns to `opacity: 0.6`), and a `@media (prefers-reduced-motion: reduce)` block removing the transition. Verify locally (`python3 -m http.server`) with network throttling: cards show the blurred preview before load, then fade in
- [x] 3.2 In `styles/hero.css`: add the `.js-enabled`-scoped fade for `.hero-bg img` (`opacity: 0` until `.is-loaded` returns to `0.4`) with the same reduced-motion guard. Verify locally: hero fades from gradient-only to full image on load
- [x] 3.3 Create `scripts/imageFade.js` following `scrollAnimations.js` conventions (exported class, initialized from `main.js`): mark target imgs (`.skill-card-image img`, `.hero-bg img`) with `is-loaded` when `img.complete && naturalWidth > 0` immediately, else on `load`, and on `error` too; wire it in `main.js` and add `document.documentElement.classList.add('js-enabled')` at startup. Verify: with JS disabled (or `main.js` blocked), all images display at full design opacity; with JS enabled, fades work; `grep -n "imageFade\|js-enabled" scripts/main.js` confirms wiring

## 4. Integration verification

- [x] 4.1 Budget check: `du -bc images/hero.webp images/skills_*.webp images/logos/logo-tcs.webp | tail -1` <= 500 KB total
- [x] 4.2 Loading behavior pass on a local server: hero request starts at document parse (devtools network, eager, high priority), no skills image request fires until scrolling near the section, hover still colorizes skill images after fade-in, section scroll animations still work
- [x] 4.3 Regression greps: no references to deleted files anywhere in `index.html`, `scripts/`, or `styles/` (`grep -rn "desktop-wide\|logo-tcs.png\|skills_.*\.png" index.html scripts styles` returns nothing), and every `images/` reference in `index.html` resolves to an existing file
