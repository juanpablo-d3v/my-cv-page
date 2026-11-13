# Proposal

## Why

A recruiter visiting the CV page has to manually map a vacancy against the profile and then decide whether to reach out. A one-click "compare this vacancy with my profile" flow shortens that decision, gives the candidate a concrete score and gap list to discuss, and demonstrates a practical, privacy-aware integration of a generative AI service in a framework-free static site.

## What Changes

- Add a hero call-to-action button that opens a native `<dialog>` match flow (visible only when JavaScript is available; email and CV download remain the primary contact paths).
- Add a single free-text vacancy field: the recruiter pastes the vacancy details directly, with a length cap, character counter, and inline validation — no multi-field form.
- On submit, send only the pasted vacancy text plus a compact, curated CV profile to the Google Gemini API (Google AI Studio key) using a single `fetch` call with JSON-schema-constrained output.
- Render the result as a match score (0–100), verdict band, matched skills, gaps, and a short rationale, plus email/CV actions; all model output is rendered as text, never HTML.
- Handle unavailable AI (missing key, offline, quota/429, timeout, malformed response) with a clear message and the existing email/PDF fallbacks — no fabricated score.
- Deliver the API key at deploy time through a GitHub Actions secret injected into the published artifact; the key MUST NOT be committed to the repository. Local development uses a gitignored config module.
- Document the Google AI Studio key restrictions (API and HTTP-referrer allowlist) and the accepted residual risk that the served key is extractable and can consume the free-tier quota.

Out of scope for this change: a server-side proxy/Worker, deterministic offline scoring, browser-built-in AI, automatic CV-profile extraction from the DOM, internationalization, and analytics.

## Capabilities

### New Capabilities

- `job-match`: recruiter-facing vacancy-to-CV comparison flow — entry point, single-field free-text vacancy input, AI comparison request, result presentation, failure degradation, privacy disclosure, no-JavaScript behavior, and the requirement that the API key never lives in the repository.

### Modified Capabilities

None. The change adds a new capability and does not alter existing `image-loading` or `web-modular-structure` requirements.

## Impact

- **Markup**: `index.html` — new hero CTA and `<dialog>` markup.
- **Styles**: new `styles/job-match.css` imported by `styles/style.css`; responsive rules at the existing 768px breakpoint; design tokens from `styles/base.css`.
- **Scripts**: new `scripts/components/jobMatchModal.js`, `scripts/services/geminiService.js`, `scripts/data/cvProfile.js`; wiring in `scripts/main.js`.
- **Deployment**: new `.github/workflows/pages.yml`; GitHub Pages source switches from branch deploy to GitHub Actions; `.gitignore` gains the local config module.
- **External service**: Google Gemini API (`generativelanguage.googleapis.com`), free tier, no billing attached.
- **Secrets**: `GEMINI_API_KEY` stored as a GitHub Actions secret; the key is published inside the deployed artifact by design (risk accepted and documented).
