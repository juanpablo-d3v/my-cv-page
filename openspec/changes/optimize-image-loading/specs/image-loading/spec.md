# Spec Delta

## Purpose

Defines how the CV page delivers its images: WebP assets within a strict size budget, an eagerly high-priority hero background, and technical-stack cards that paint a blurred placeholder instantly and fade in the real image, degrading gracefully without JavaScript or motion.

## ADDED Requirements

### Requirement: Page images served as WebP within a size budget

The hero background, the six technical-stack images, and the TCS logo SHALL be served as WebP files, and their combined transfer size on a first visit SHALL NOT exceed 500 KB.

#### Scenario: Converted images are WebP
- **WHEN** the hero, technical-stack, and TCS logo image URLs are requested from the deployed site
- **THEN** each response has content type `image/webp`

#### Scenario: First-visit image budget holds
- **WHEN** a cold-cache browser loads the page and downloads the hero, six technical-stack, and TCS logo images
- **THEN** their combined transfer size is at most 500 KB

### Requirement: Hero background loads eagerly at high priority

The hero background image SHALL NOT be lazily loaded. Its fetch SHALL begin during initial HTML discovery and be marked high priority, so the hero is fetched ahead of below-the-fold content.

#### Scenario: Hero is not lazy
- **WHEN** the hero background image element is inspected in the served HTML
- **THEN** it carries no `loading="lazy"` attribute and carries `fetchpriority="high"`

#### Scenario: Hero fetch starts at discovery
- **WHEN** a cold-cache browser parses the initial HTML
- **THEN** the hero background image request begins before any technical-stack image request

### Requirement: Below-fold images load lazily

The six technical-stack images and the experience-section logos SHALL be fetched only as their sections approach the viewport.

#### Scenario: Skills images deferred until scroll
- **WHEN** a cold-cache browser loads the page at the top
- **THEN** no technical-stack image request is made until the skills section approaches the viewport

### Requirement: Skills cards paint a blurred placeholder before the image loads

Each technical-stack card SHALL display a blurred low-quality preview, painted from CSS without any additional network request, immediately when the card renders and before the real image arrives.

#### Scenario: Placeholder visible before load
- **WHEN** a skills card renders and its real image has not finished loading
- **THEN** the card's image area shows a blurred preview of the image with no additional network request

#### Scenario: Real image fades in over the placeholder
- **WHEN** a skills card's real image finishes loading
- **THEN** the image becomes visible over the blurred preview through a fade transition

### Requirement: Images remain fully visible without JavaScript

All images SHALL be displayed normally when JavaScript is unavailable or fails, with no permanently hidden, faded, or placeholder-only state.

#### Scenario: No-JavaScript fallback
- **WHEN** the page is loaded with JavaScript disabled
- **THEN** every image, once loaded, is displayed at full intended opacity with no fade applied

### Requirement: Fade transitions respect reduced motion

When the user's system preference is `prefers-reduced-motion: reduce`, image fade transitions SHALL be skipped and images SHALL appear immediately once loaded.

#### Scenario: Reduced-motion users see no fade
- **WHEN** the page loads with `prefers-reduced-motion: reduce` active
- **THEN** skills images appear without a fade transition once loaded
