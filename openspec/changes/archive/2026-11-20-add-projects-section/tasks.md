# Tasks

## 1. Markup and navigation

- [x] 1.1 Add `<a href="#projects">Projects</a>` as the first link in `nav.header-nav-desktop` in `index.html`; verify at a viewport wider than 768px that four links appear and activating the new link scrolls to the projects section.
- [x] 1.2 Add `<section class="projects-section" id="projects" aria-labelledby="projects-title">` immediately after the hero and before `#experience`, with `.section-container`, a `.section-title` containing `<h2 id="projects-title">Featured Projects & Solutions</h2>`, and a short intro paragraph; verify the DOM order and that opening `index.html#projects` lands on this section.
- [x] 1.3 Add four `article.project-card` entries for TCS insurance, Brilla Group payments, Colima judicial platform, and Iberdrola fraud monitoring, each with a metadata row, `h3` title, narrative, three highlight items with text labels and decorative icons, and technology tags; verify four distinct cards render with every part present and the TCS "View Career Role" link navigates to `#experience`.
- [x] 1.4 Write card copy from the experience bullets in `index.html:90-249` and technical-stack descriptions in `index.html:251-368`; verify no unsupported phrases such as "Angular 17", "multinational carrier", "thousands of attorneys", or "global energy utility" remain and each claim is traceable to the existing CV text.

## 2. Styling and documentation

- [x] 2.1 Create `styles/projects.css` with stacked card, metadata, highlight, and footer layout using only existing `--md-sys-color-*` tokens, `--radius-xl`, hairline borders, and the shared `.tag` chip; verify the file exists and contains no hard-coded new palette colors, external URLs, or CSS `url()` image references.
- [x] 2.2 Add `@import url('./projects.css');` to `styles/style.css` before `responsive.css`, and add a `section.projects-section` background rule using `var(--md-sys-color-surface-container)` in `styles/sections.css`; verify the stylesheet loads without a 404 and the section visibly alternates with the following `experience-section` background.
- [x] 2.3 Implement responsive rules with highlights stacked by default and three columns from 640px, matching `skills.css` breakpoints; verify at 375px width there is no horizontal overflow and at desktop width each card shows three highlight items in a row.
- [x] 2.4 Add `projects.css` to the `styles/` tree in `README.md`; verify the documented structure matches the files on disk.

## 3. Integration verification

- [x] 3.1 Confirm no script changes were introduced: `scripts/nav.js` binds the new hash link and `scripts/scrollAnimations.js` observes the new section; verify the reveal works without any visibility-gating CSS and the section scrolls correctly from both nav and fragment URL.
- [x] 3.2 Confirm no new remote assets or frameworks: verify no `lh3.googleusercontent.com`, Stitch asset, or Tailwind CDN URL appears in `index.html` or `styles/`, and the vacancy-match dialog still opens and closes as before; defer local placeholder request verification to task 4.3.
- [x] 3.3 Verify accessibility with browser devtools or a screen reader: section has an accessible name, headings are `h2` then `h3`, decorative icons are hidden from assistive technology, and all links are keyboard reachable.
- [x] 3.4 Disable JavaScript and reload the served page; verify all four case studies, their highlights, and technology labels remain visible without any permanently hidden or loading-only placeholder state (the planned static placeholder is content, not a fade or LQIP state).

## 4. Placeholder imagery and future assets

- [x] 4.1 Create `images/projects/project-placeholder.svg` as a lightweight local decorative placeholder and reference it from all four `article.project-card` entries with `alt=""`, `loading="lazy"`, and `decoding="async"`; verify no remote URL or Stitch asset is referenced and the same local file is reused four times.
- [x] 4.2 Add a full-card placeholder background and a left-to-right gradient overlay in `styles/projects.css` built only from existing `--md-sys-color-*` tokens and transparency; verify no hard-coded palette colors, CSS `url()` image references, or Tailwind classes appear and the left-aligned content layer leaves the right portion of the image visible.
- [x] 4.3 Verify cold-load image behavior in a browser: placeholder requests are local and lazy, no remote image request is added, the hero/technical-stack/TCS logo priorities and first-visit budget are unchanged, and with JavaScript disabled all four placeholders remain visible at full intended opacity.
- [x] 4.4 Document the static swap path in `README.md`: include `images/projects/project-placeholder.svg` in the structure list and note that real local images and verified copy replace the placeholder paths without new dependencies; verify the documented files match disk.
- [x] 4.5 Re-run accessibility and responsive checks on the revised cards: accessible name, `h2` then `h3` headings, decorative icons and placeholder not announced, link keyboard reachable, and no horizontal overflow at 375px; verify in browser devtools.
- [x] 4.6 Restructure each card to match the Stitch proposal: move the placeholder image to an absolutely positioned full-card background, wrap the existing content in a left-aligned layer of roughly 48rem or 64% desktop width, and verify in the browser that the right side of the image remains visible through the scrim, text contrast is readable at 375px and desktop widths, and headings, links, no-JS visibility, and dialog behavior still pass.
