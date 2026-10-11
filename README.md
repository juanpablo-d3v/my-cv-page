# my-cv-page

CV representation in web page to apply for job.

## Stack

- HTML, CSS, and modern Vanilla JavaScript (ES modules).
- No frameworks, no bundlers, no build step, no runtime dependencies.

## Project structure

```
web-cv/
├── index.html            # Main page markup (semantic sections)
├── styles/
│   ├── style.css         # Entry point: @imports the section stylesheets
│   ├── base.css          # Design tokens, reset, typography, icon font
│   ├── header.css        # Header and navigation
│   ├── sections.css      # Main layout and shared section backgrounds
│   ├── hero.css          # Hero section
│   ├── experience.css    # Experience section
│   ├── skills.css        # Skills section
│   ├── certifications.css
│   ├── interests.css
│   ├── footer.css
│   ├── responsive.css    # Mobile/breakpoint overrides
│   └── utilities.css     # Focus states and helper utility classes
├── scripts/
│   ├── main.js           # Entry point: imports and boots the handlers
│   ├── nav.js            # Navigation / smooth scroll
│   ├── icons.js          # Social, share, and download icons
│   ├── certifications.js # Certification interactions
│   ├── scrollAnimations.js
│   └── utils/
│       ├── smoothScroll.js
│       └── handleKeyboardNavigation.js
└── images/, assets/      # Static assets
```

## Conventions

- **One concern per file.** Each section's behavior lives in its own ES module
  under `scripts/`; shared helpers live in `scripts/utils/`.
- **Import/initialize in `main.js`.** Section modules export a class and
  `main.js` is the only place that instantiates them.
- **CSS is section-scoped.** Add or edit a section's styles in its own file
  under `styles/`; `style.css` only lists imports (order matters: tokens first,
  responsive overrides and utilities last).
- **No external dependencies.** Keep everything browser-native.

## Running locally

Open `index.html` directly, or serve the folder to enable ES module loading
over `file://`-restricted browsers:

```bash
python3 -m http.server 8080
```
