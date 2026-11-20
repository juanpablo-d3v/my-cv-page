# Design

## Context

The page is a static, framework-free CV: one hand-authored `index.html`, section-scoped CSS imported by `styles/style.css`, and vanilla ES modules bootstrapped in `scripts/main.js`. Section content is hard-coded; `scripts/data/cvProfile.js` exists only to feed the vacancy-match prompt. Navigation links beginning with `#` are bound generically by `scripts/nav.js:11-19`, and `scripts/scrollAnimations.js:21` observes every `<section>`, so a new section needs no new handler. The Stitch `JP-dev` mockup supplies structure, card imagery, and gradient-scrim ideas but is built on a different Tailwind theme and remote imagery; real project data and images will be supplied later by you, so this change uses one local placeholder as an interim asset.

## Goals / Non-Goals

**Goals:**

- Present four case studies in the same visual language as the existing experience and skills sections.
- Translate the mockup's full-card image background and left-to-right gradient scrim into a token-based overlay built from existing design tokens rather than Stitch colors or remote assets.
- Use one local SVG placeholder image as interim card imagery, reusable across all four cards and replaceable by real assets later.
- Keep all content in the served HTML, visible without JavaScript and reachable by keyboard or URL fragment.
- Reuse existing tokens, components, handlers, and native image loading without changing any current spec requirement.

**Non-Goals:**

- Migrating the page to the Stitch "Precision Dark Tech" palette, fonts, or Tailwind tooling.
- Fetching remote images, copying Stitch assets, adding LQIP fades, or changing `scripts/imageFade.js`.
- Adding your real project data or final images in this change; only a static swap path is planned.
- Adding filters, tabs, carousels, modals, or any new JavaScript module.
- Adding claims, metrics, client descriptors, or tool versions not already supported by the CV.

## Decisions

1. **Translate the mockup into live design tokens.** Map its card surface to the existing card treatment used by experience cards (`surface-variant`, `1px` hairline border on hover, `--radius-xl`), its primary/label colors to `--md-sys-color-primary` and `--md-sys-color-on-surface-variant`, its tech badges to the existing `.tag` chip, and its image-band gradient to a token-derived overlay using existing surface colors and transparency. Work Sans/Inter/JetBrains Mono and the cyan/green status accents are not adopted; the live page uses Merriweather Sans throughout and has no status-color token, so the "Production Active" indicator becomes a neutral text badge. Alternatives considered: adopt the Stitch design system globally (too broad, touches every section), or scope Stitch tokens to this section only (creates a second palette on one page).

2. **Keep wide stacked cards with a full-card image background.** Each entry stays one per row with the mockup's information hierarchy: absolute full-card placeholder image, left-to-right gradient scrim, then metadata row, title, narrative, three highlight items, and technology tags. The scrim is strongest on the left for contrast and fades toward the right so image detail remains visible; the text layer is constrained to roughly 48rem or 64% of the card on desktop and widens on mobile. Alternatives considered: the earlier contained top media band with text below (loses the mockup's visible image detail on the right), the experience section's sticky two-column layout (narrows the cards and loses the case-study rhythm), and the skills section's image grid (cannot hold the narratives and highlights).

3. **Place the section after the hero and add "Projects" as the first nav link.** This leads with outcomes before chronology and matches the mockup's document order. `id="projects"` and `aria-labelledby="projects-title"` make it directly linkable. The fourth nav link fits the existing 88rem header with `gap: 2rem`; the nav is already hidden below 768px. Alternatives considered: placing it after experience or after skills, which weaken the upfront impact.

4. **Author the four entries as static HTML with a static replacement path.** Titles and narratives are derived from the experience bullets in `index.html:90-249` and the technical-stack descriptions in `index.html:251-368`; Stitch's unsupported specifics are removed. The TCS entry keeps the "View Career Role" anchor to `#experience`. When real data/images arrive, each card can be updated by editing the served HTML and replacing local files under `images/projects/`; no renderer, data module, or new JavaScript is introduced. Alternatives considered: rendering from `cvProfile.js`, which would duplicate content and make the section invisible without JavaScript, or building a data schema for future projects, which is beyond this change.

5. **Add one stylesheet and one local placeholder asset.** `styles/projects.css` holds card background, gradient scrim, left-aligned content, metadata, highlight, and tag layout and is imported in `styles/style.css` before `responsive.css`; the section background goes in `styles/sections.css` using `surface-container` so it visibly alternates with the following `experience-section`, whose `surface-container-low` resolves to the same value as `surface` in the current palette. The placeholder is one lightweight local SVG at `images/projects/project-placeholder.svg`, referenced from each card's absolutely positioned `<img>` element; the CSS uses no `url()` for imagery and no hard-coded palette colors. The highlights use a single-column stack by default and three columns from 640px, matching the breakpoints already used in `skills.css`. The README structure list is updated to include the new stylesheet and placeholder asset.

6. **Rely on existing behavior for interaction, motion, and image loading.** `nav.js` smooth-scrolls any hash link, and `scrollAnimations.js` reveals any section without gating visibility in CSS, so no script changes are needed. Placeholder images use native `loading="lazy"` and `decoding="async"` with `alt=""` because they are decorative, and they are not added to `imageFade.js`; they remain visible with JavaScript disabled. Decorative Material Symbols icons are marked `aria-hidden="true"` while their text labels carry the meaning; headings stay `h2` for the section and `h3` per card.

## Risks / Trade-offs

- **[Longer pre-chronology page]** → Keep each narrative short, keep the scrim opaque on the left and faded on the right, and lazy-load the placeholder so the section adds height without adding above-fold network cost.
- **[Placeholder-to-real drift]** → Treat the placeholder as decorative only; when real data/images arrive, verify each replacement claim against the CV and keep the same static markup structure.
- **[Gradient contrast]** → Build the overlay from existing surface tokens and transparency, keep text in a left-aligned layer over the strongest part of the scrim, and verify contrast at desktop and mobile widths.
- **[Content overlaps the experience timeline]** → Frame entries as outcomes with highlights rather than repeating role descriptions verbatim, and link the TCS entry back to its role.
- **[Copy could drift beyond the CV]** → Verify each claim against `index.html` before writing it; do not import Stitch's "Angular 17", "multinational carrier", "thousands of attorneys", or "global energy utility" phrases.
- **[Nav crowding on mid-width desktops]** → Rely on the existing 88rem container and 768px nav breakpoint; no new responsive nav pattern is introduced.
- **[Visual drift over time]** → Use only existing CSS custom properties and the shared `.tag` component; do not introduce section-only accent colors.
- **[Image budget impact]** → The named hero, technical-stack, and TCS logo assets and their 500 KB budget are unchanged; the new placeholder is a tiny local SVG, loaded lazily, with no high-priority fetch.

## Migration Plan

Ship as a single static-site deployment: add the markup with full-card placeholder backgrounds and left-aligned content layers, stylesheet, import, section background rule, nav link, local SVG placeholder, and README entries together. No data migration or API change is involved. Later, replace the placeholder SVG references and card copy with real local assets and verified data in the same static files. Rollback by reverting the commit and redeploying the previous artifact; the page returns to its current section order with no storage or configuration residue.
