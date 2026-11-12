# Design

## Context

See proposal.md - Why. Current state: main.js and style.css are monolithic; feature additions or changes require touching a large, unstructured code file, increasing cognitive load and risk of conflicts.

## Goals / Non-Goals

**Goals:**
- Decouple interactive logic per section (nav, hero, skills, icons)
- Enable feature addition by importing a module, not rewriting main.js
- Support optional CSS splitting, but not enforce it if not needed
- Absolutely no frameworks or build toolchain

**Non-Goals:**
- No component framework, runtime templating, or Shadow DOM usage.
- No change to core site content or external APIs.
- No automatic code splitting or async chunk loading (keep it simple and sync).

## Decisions

- Use ES module imports for all JS; one file per main UI section.
- All section modules export an init/initSection function; main.js imports and calls them.
- Shared logic (e.g., smoothScroll, aria helpers) in utils/ as ES module files.
- Main stylesheet (style.css) continues as single file and is split (via @import) only when actually beneficial.
- HTML scripts use `type="module"` and static refs.

**Alternatives considered:**
- Web Components rejected for simplicity and lower boilerplate.
- Keeping monolithic files rejected for agility and maintainability.

## Risks / Trade-offs

- Too granular splitting can introduce unnecessary overhead for small sites.
- Section splitting must not break global style or logic—changes should be atomic and reviewed.
- Import order for CSS using @import must be managed with specificity in mind.

## Migration Plan

1. Move one section at a time into its own ES module.
2. Test UI/UX after each refactor step.
3. For CSS, split out only when files become too large.
4. Update HTML script tags as chunking occurs.

## Open Questions

None identified.
