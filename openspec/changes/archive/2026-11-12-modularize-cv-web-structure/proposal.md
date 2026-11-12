# Proposal

## Why

The current CV web project is organized in single, large files for JavaScript and CSS. As the site grows, this structure makes navigation, testing, and iterative improvement difficult, potentially leading to duplicated logic or tightly coupled sections. A modular structure using ES modules and per-section code, with optional CSS grouping, will make the codebase easier to maintain, extend, and debug. Now is an ideal time, as the codebase is still contained enough for a high-leverage refactor and the project’s intended purpose is a professional showcase of best web engineering practices—modularity and maintainability are essential.

## What Changes

- Refactor all interactive/logic code into per-section ES module JS files (e.g., nav.js, hero.js, skills.js, icons.js, utils/).
- Refactor CSS as needed into section-based files using native @import in style.css (when/if main file grows cumbersome).
- Update main HTML references as needed to load new module structure.
- Keep all interactivity and styling fully framework-free with no builder nor dependencies.
- Document the new structure for future maintainers.

## Capabilities

### New Capabilities
- web-modular-structure: Enables modular JS and CSS with clear per-section code responsibility and maintainable structure.

### Modified Capabilities
- _None_: This breaks no prior external contract; the site is still a static single-page CV.

## Impact

- All site JavaScript and CSS organization.
- No external API or data model, but all new and existing logic will be organized for maintainability.
- Maintainers will be able to extend features or styles by adding, not rewriting, code sections.
