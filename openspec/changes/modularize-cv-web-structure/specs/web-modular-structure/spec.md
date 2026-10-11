# Spec Delta

## Purpose
This capability enables clean, maintainable, section-oriented modularization of the CV web project’s codebase, supporting scalable feature addition and clear separation of logic and style without requiring frameworks or build tools. 

## ADDED Requirements

### Requirement: Section-based ES Module JavaScript
The codebase SHALL organize JS files such that each main UI section (header/nav, hero, skills, icons, etc.) is implemented in its own ES module, loaded via main.js, with shared logic in utils.

#### Scenario: Hero section logic
- **WHEN** the user interacts with the hero section (e.g., clicks CTA, smooth scroll)
- **THEN** only the hero module acts, with no leakage into unrelated code sections

### Requirement: Section-based CSS (when needed)
The codebase SHALL allow CSS to be grouped per section (e.g., header.css, hero.css, icons.css) and imported into main stylesheet when style.css grows large enough for sectioning to help maintainability.

#### Scenario: CSS for hero section grows
- **WHEN** hero styles exceed 150 lines or frequent edits of unrelated code are needed
- **THEN** hero-specific CSS may be split out and @imported

### Requirement: No Frameworks or Build Tools
All JS and CSS SHALL remain native (browser-supported), with no dependency on bundlers, compilers, or third-party libraries.

#### Scenario: Editor opens project for the first time
- **WHEN** a maintainer opens the codebase in a plain text editor or browser
- **THEN** all code is visible and editable without any build or package step

### Requirement: Maintainable Imports and Exports
Shared utilities SHALL be placed in a utils/ folder, imported as needed, and not duplicated among per-section modules.

#### Scenario: Smooth scroll logic
- **WHEN** a section requires smooth scrolling
- **THEN** it imports the shared smoothScroll utility from utils/, not a new local implementation

