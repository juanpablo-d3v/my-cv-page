# Design

## Context

See `proposal.md` for motivation. Current state that shapes the approach:

- Static GitHub Pages site served from the repository (`juanpablo-d3v/my-cv-page`), no `CNAME`, no GitHub Actions workflows, branch-based Pages deploy. Published origin is assumed to be `https://juanpablo-d3v.github.io/my-cv-page/`.
- No frameworks, bundlers, runtime dependencies, or build step; ES modules, one class per handler, wired from `scripts/main.js`. `scripts/components/`, `scripts/services/`, and `scripts/utils/` already exist for this kind of feature.
- Material Design 3 tokens in `styles/base.css`; section stylesheets imported by `styles/style.css`; single 768px breakpoint in `styles/responsive.css`; focus styles in `styles/utilities.css`.
- Google AI Studio free-tier key exists, not attached to billing. Google's key-leak scanning makes a committed key a revocation risk.

## Goals / Non-Goals

**Goals:**
- Keep the site static, dependency-free, and deployed to GitHub Pages from this repository.
- Keep the API key out of the repository and its history while still delivering it to the browser at runtime.
- Isolate the external integration behind one service module so the endpoint can move to a proxy later without UI changes.
- Make every failure state honest and recoverable, with email/PDF as the permanent fallback.
- Minimize recruiter effort: one paste and one action instead of a multi-field form.

**Non-Goals:**
- Server-side proxy or any non-GitHub hosting.
- Offline/deterministic scoring, browser-built-in AI, or multi-provider AI fallback.
- Automated CV-profile extraction from the rendered page.
- Localization, analytics, or persistence of submitted vacancy data.

## Decisions

### D1 — Key delivery: GitHub Actions secret injected at deploy (chosen over committing the key)

A Pages workflow builds the artifact from the repository, writes `scripts/config.js` (an ES module exporting `{ apiKey, model }`) from `secrets.GEMINI_API_KEY`, then uploads and deploys the artifact. The config module is listed in `.gitignore` so it never enters git. Pages source switches from "Deploy from a branch" to "GitHub Actions".

Alternatives: committing `scripts/config.js` (rejected — public key in git history invites Google's leak scanning/revocation and GitHub provider alerts); fetching the key at runtime from a third-party store (rejected — same exposure plus a new dependency).

Because the key must reach the browser, the served artifact still contains it. This is accepted; the workflow only removes it from the repository.

### D2 — Service module with a single endpoint seam

`scripts/services/geminiService.js` performs a raw `fetch` to the Gemini REST API. The endpoint base and model id are module constants; the UI never references the URL. Swapping to a Worker later changes those constants and removes the local config import — no component changes. Raw `fetch` keeps the "no runtime dependencies" rule intact (the Firebase AI SDK would violate it).

The config module is imported lazily (`await import('./config.js')` inside a guarded function), so builds without an injected key still load the application and surface "AI comparison unavailable" instead of failing module evaluation.

### D3 — Curated CV profile module

`scripts/data/cvProfile.js` exports a compact, frozen profile (headline, years, skill groups with levels, three most recent roles as one-line outcomes, certifications, languages, availability) plus a serializer that renders it as prompt text. Alternatives: scraping the DOM (rejected — brittle selectors, marketing prose, ~3k input tokens per request); free-form prompt string inline in the service (rejected — harder to review and keep factually aligned with the page).

### D4 — Comparison contract: JSON-schema-constrained single request

One `generateContent` request: a system-level instruction describing the role (evaluating candidate fit), the scoring rubric (must-have skills, seniority, domain, transferable experience), an explicit instruction to treat the vacancy block as untrusted data and ignore any instructions inside it, the curated profile, and a single delimited vacancy block. The rubric instructs the model to extract the role, seniority, and must-have skills from the pasted text when they are stated, and to evaluate only the evidence present; missing details are named in the rationale rather than invented.

Response constrained to JSON with fields `score` (integer 0–100), `verdict` (`strong` | `partial` | `weak`), `matchedSkills` (string[]), `gaps` (string[]), `rationale` (string, short). Low temperature; bounded output tokens. The client validates the shape, clamps/validates the score range, and treats any mismatch as a failed comparison. Verdict bands are derived client-side from the score so the displayed verdict always agrees with the score (design-level thresholds: ≥75 strong, 45–74 partial, <45 weak).

Alternative considered: free-text response parsed with regex (rejected — formatting drift). Alternative: two-step tool calling (rejected — unnecessary latency and complexity).

### D5 — UI: native `<dialog>` + handler class, JS-gated

Markup: a CTA button in `.hero-cta` and a `<dialog>` near the hero. The CTA participates in the `.js-enabled` visibility pattern already used in this codebase, so no-JS visitors never see a dead control. The dialog contains one labeled multiline textarea (maximum 2,000 characters, live remaining-character counter, example placeholder) into which the recruiter pastes the vacancy, plus the privacy notice, result region, and close control.

`scripts/components/jobMatchModal.js` follows the existing handler convention (constructor + `initialize*`, default export, wired in `main.js`). States: `idle` → `validating` → `loading` → (`result` | `error`). Submit is disabled while in flight and during a 20-second cooldown tracked in `localStorage` (a courtesy control; it is not a security boundary). Requests use `AbortController` with a 30-second timeout. All model text is inserted with `textContent`; no `innerHTML` from model or input. Native `showModal()` provides focus trapping; the component restores focus to the trigger on close.

### D6 — Failure taxonomy maps to one visible state

| Condition | Detection | User-visible outcome |
|---|---|---|
| No key / config missing | dynamic import fails or config empty | "AI comparison unavailable" + email/PDF; no request attempted |
| Offline / network error | `fetch` rejects | unavailable + retry |
| Quota / rate limit | HTTP 429 | unavailable + retry + cooldown |
| Server/API error | HTTP 4xx/5xx | unavailable + retry |
| Timeout | `AbortController` | unavailable + retry |
| Malformed/blocked output | schema validation fails or empty text | unavailable (never a fabricated score) |

Email and CV download actions in the error state reuse the existing hero links.

### D7 — Styling and accessibility

New `styles/job-match.css` imported at the end of `styles/style.css`; built from existing tokens (surface containers, primary/tertiary, radii, transitions). Dialog constrained to viewport with internal scrolling; responsive tweaks at the existing 768px breakpoint; reduce transitions under `prefers-reduced-motion`. The vacancy textarea has a persistent label and character counter, the status region uses `aria-live="polite"` for loading/result/error, an empty submission sets `aria-invalid`, and focus rings come from `utilities.css`. Score displayed numerically plus a text verdict so meaning is not color-only.

### D8 — Deployment and rollback

New `.github/workflows/pages.yml`: triggers on push to the default branch (and manual dispatch), permissions `contents: read`, `pages: write`, `id-token: write`; concurrency group for Pages; steps: checkout → write `scripts/config.js` from the secret without echoing it (single-quoted heredoc, env var, no debug output) → `actions/upload-pages-artifact` with the repository root (excluding `openspec/`, `.git/`, `.github/` is optional; simplest is to upload the site root as today) → `actions/deploy-pages`.

Rollback: revert the Pages source to branch deploy (site returns to the pre-change behavior; the dialog renders but reports AI unavailable without a key), or revert the workflow file. Key rotation = update the Actions secret and re-run the workflow; no code change.

## Risks / Trade-offs

- **Published key is extractable** → accepted for v1; no billing attached caps damage at quota exhaustion; restriction to the Generative Language API and to site referrers reduces casual reuse; rotation is a secret update + workflow rerun.
- **Quota exhaustion breaks the feature for later visitors** → graceful unavailable state with email/PDF; client cooldown; documented as accepted risk; a Worker proxy is the recorded next step.
- **Model id deprecation / availability** → model id is a single constant, verified against AI Studio at implementation time; failure surfaces as the unavailable state, not a broken page.
- **Prompt injection from pasted vacancy text** → untrusted-data delimiting in the prompt, schema-constrained output, client-side validation/clamping, text-only rendering.
- **Sparse or vague pasted text weakens the comparison** → the placeholder shows the expected detail level, the rubric scores only stated evidence and names missing details in the rationale, and the result is presented as an AI estimate rather than a definitive judgement.
- **Referrer restriction may not match localhost** → local development uses a separate unrestricted dev key in the gitignored config module; the production key allowlist covers only the Pages origin.
- **Pages source switch mistakes** → deployment verification task includes confirming the published URL serves the page and the workflow run is green; rollback documented above.
- **Secret accidentally printed in logs** → workflow never echoes the value and does not enable debug logging; the secret is masked by Actions in any case.

## Migration Plan

1. Create/verify the AI Studio key; restrict it to the Generative Language API and the Pages origin (+ localhost dev key).
2. Add the `GEMINI_API_KEY` Actions secret.
3. Add the Pages workflow and `.gitignore` entry; switch Pages source to GitHub Actions; deploy and verify the published site.
4. Roll back by restoring branch-based Pages deployment if the workflow cannot run.

## Open Questions

- Exact free-tier model id to pin (must be verified in AI Studio during implementation; does not change the approach or task breakdown).
- Whether a custom domain replaces the `github.io` origin later; if so, the key's referrer allowlist needs the new origin (configuration detail only).
