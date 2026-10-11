# Tasks

## 1. JavaScript Modularization

- [x] 1.1 Create scripts/utils/ and migrate shared helpers (e.g., smoothScroll)
- [x] 1.2 For each major UI section, extract all JS logic to its own module (nav.js, hero.js, skills.js, icons.js)
- [x] 1.3 Update main.js to import/init all section modules and shared utilities
- [x] 1.4 Verify site interactivity works for all sections after each refactor

## 2. CSS Structure

- [x] 2.1 Monitor style.css size; when sections exceed ~150 lines or frequent unrelated edits, split into per-section files (header.css, hero.css, etc.)
- [x] 2.2 Use native `@import` in style.css for new section files
- [x] 2.3 Verify all styles render correctly and no cascade/specificity issues occur after each CSS split

## 3. HTML & Integration

- [x] 3.1 Update <script> and <link> tags as needed for new modular file structure
- [x] 3.2 Test site in a browser with JS enabled/disabled; verify non-JS fallback
- [x] 3.3 Verify no errors in console on all major browsers

## 4. Documentation & Review

- [x] 4.1 Document new structure and conventions in comments and/or readme
- [x] 4.2 Review for duplicated logic or CSS and consolidate where found

