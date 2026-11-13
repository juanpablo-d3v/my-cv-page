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
│   ├── job-match.css     # Vacancy match dialog, result, and CTA
│   ├── responsive.css    # Mobile/breakpoint overrides
│   └── utilities.css     # Focus states and helper utility classes
├── scripts/
│   ├── main.js           # Entry point: imports and boots the handlers
│   ├── nav.js            # Navigation / smooth scroll
│   ├── icons.js          # Social, share, and download icons
│   ├── certifications.js # Certification interactions
│   ├── scrollAnimations.js
│   ├── components/
│   │   └── jobMatchModal.js  # Vacancy match dialog state and rendering
│   ├── services/
│   │   └── geminiService.js  # Gemini request, prompt, and validation
│   ├── data/
│   │   └── cvProfile.js      # Curated CV profile for AI comparison
│   └── utils/
│       ├── smoothScroll.js
│       └── handleKeyboardNavigation.js
├── .github/workflows/
│   └── pages.yml         # Pages deploy; injects the AI key at build time
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

## AI vacancy match

The hero "Match a vacancy" button opens a dialog where a recruiter pastes a
vacancy and receives an AI comparison against the curated profile in
`scripts/data/cvProfile.js`. Requests go directly from the browser to the Google
Gemini API, so the API key is part of the deployed artifact. Keep it restricted
and treat it as public.

The key is never committed. `scripts/config.js` is gitignored and is generated
for deployment by `.github/workflows/pages.yml` from the `GEMINI_API_KEY`
Actions secret.

### 1. Create and restrict the key

In [Google AI Studio](https://aistudio.google.com/), create (or reuse) a free-tier
key and restrict it in Google Cloud console:

- API restriction: **Generative Language API**.
- HTTP referrer restriction: `https://juanpablo-d3v.github.io/my-cv-page/*`.
- Create a separate, unrestricted development key for local work; the production
  allowlist does not cover `http://localhost`.

### 2. Local development

Create `scripts/config.js` (ignored by git):

```js
export const config = {
  apiKey: 'YOUR_DEV_KEY',
  model: 'gemini-2.5-flash',
};

export default config;
```

Serve the folder as shown above and open `http://localhost:8080`.

### 3. Deploy from GitHub Actions

1. Repository **Settings → Secrets and variables → Actions → New repository
   secret**: `GEMINI_API_KEY`.
2. Optional **Variables** entry: `GEMINI_MODEL` (defaults to
   `gemini-2.5-flash`).
3. Repository **Settings → Pages → Build and deployment → Source**:
   **GitHub Actions**.
4. Push to `main`, or run the **Deploy CV site to GitHub Pages** workflow
   manually from the Actions tab.

Verify the published artifact contains the config module:

```bash
curl -s https://juanpablo-d3v.github.io/my-cv-page/scripts/config.js
```

### Rollback and rotation

- **Rollback:** set **Settings → Pages → Source** back to **Deploy from a
  branch** (`main` / root). The dialog still renders but reports AI comparison
  unavailable without a key.
- **Key rotation:** update the `GEMINI_API_KEY` secret and re-run the workflow;
  no code change is required.
- The served key is extractable and can consume the free-tier quota. Email and
  CV download remain the fallbacks when comparison is unavailable.
