# Proposal

## Why

The live CV page presents four substantial production case studies only as bullet points inside the experience timeline, so a recruiter scanning the page cannot see the outcomes up front. A Stitch mockup in the `JP-dev` project explores a "Featured Projects & Solutions" section with image-led cards; you want that visual idea kept as inspiration while you later replace placeholder data and images with your own real project details.

## What Changes

- Add a semantic `projects-section` with `id="projects"` directly after the hero, titled "Featured Projects & Solutions", containing four stacked case-study cards: TCS insurance lifecycle platform, Brilla Group payment gateway (NTT Data), Colima Judicial Tribunal Electrónico, and Iberdrola fraud/telemetry dashboard.
- Add a "Projects" link to the desktop navigation, ahead of "Experience".
- Give each card a category/client metadata row, a title, a short narrative, three highlight items, a tech-tag footer, and a local placeholder image covering the full card behind a left-to-right token-based gradient scrim with left-aligned content; the first card links back to its full career role with `#experience`.
- Translate the mockup's full-card background and gradient scrim into the page's existing design system: `--md-sys-color-*` tokens, Merriweather Sans typography, hairline borders, `--radius-xl`, and the existing `.tag` chip component. No Tailwind CDN, no remote images, no Stitch assets, and no new palette colors.
- Keep all copy derived from facts already present in `index.html`; real project data and images are a later static-only swap, not part of this change.
- Add one local placeholder image asset under `images/projects/` and reuse it for all four cards until real assets arrive.
- Add a section-scoped `styles/projects.css`, register it in `styles/style.css` before the responsive overrides, add the section background rule to `styles/sections.css`, and keep card background, gradient scrim, and left-aligned content rules in `projects.css` using only existing custom properties.
- Reuse the existing navigation handler, scroll observer, and native image loading; no new JavaScript module or fade handler is required.

No breaking changes.

## Capabilities

### New Capabilities
- `projects-section`: A static, accessible case-study section that presents four featured projects using the CV page's existing design tokens, section structure, card idioms, and one local placeholder image, with copy derived from the existing experience entries.

### Modified Capabilities

None. The change adds a local placeholder asset under the existing native-image rules; the named `image-loading` assets and their first-visit budget are unchanged, and no spec-level behavior in `image-loading` or `web-modular-structure` changes.

## Impact

- `index.html`: new section between hero and experience, one navigation link, and full-card placeholder backgrounds with left-aligned content layers on each card.
- `styles/projects.css` (new), `styles/style.css`, `styles/sections.css`, `styles/responsive.css` if breakpoint rules are centralized there.
- `images/projects/` (new): one local SVG placeholder reused by all four cards.
- `README.md`: project structure list gains the new stylesheet and placeholder asset.
- Unchanged: `scripts/` handlers, existing `images/` and `assets/`, the vacancy-match dialog, and all existing specs.
- No new dependencies, build step, external network assets, or API changes.
