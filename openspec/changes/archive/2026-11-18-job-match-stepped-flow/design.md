# Design

## Context

See `proposal.md` for motivation. Current state that shapes the approach:

- Native `<dialog>` in `index.html:457-519` contains the privacy notice, form, result section, and fallback panel as siblings; the form and result are visible together after a successful comparison.
- `scripts/components/jobMatchModal.js` tracks state implicitly with a `loading` flag plus independent `hidden` flags on the result and fallback panels (`prepareRequest`, `showResult`, `showFailure`). `open()` calls `showModal()` and focuses the textarea without resetting prior state.
- The 20-second cooldown is persisted in `localStorage` under `jp-job-match-last-submit`; the ticker currently disables the submit button with `disabled` and rewrites the shared `aria-live` status line every second (`startCooldownCountdown`).
- Static, framework-free ES modules; design tokens in `styles/base.css`, section styles in `styles/job-match.css`, one 768px breakpoint, and a `prefers-reduced-motion` block already in place.
- The Gemini service, curated profile, result schema, failure taxonomy, and deployment workflow are unchanged by this change.

## Goals / Non-Goals

**Goals:**

- One explicit view state with a single place that controls visibility, so error and success paths cannot leave two views visible.
- The result occupies the dialog alone once the comparison succeeds, with the input unavailable until the visitor chooses otherwise.
- Retry, cooldown, failure fallbacks, and contact paths stay reachable and announceable in every view.
- Keep the change to markup, styles, and the one handler module.

**Non-Goals:**

- New comparison states beyond `input`, `loading`, and `result`.
- Changing the cooldown duration, its storage key, the request contract, scoring bands, or result fields.
- Persisting or restoring a draft vacancy after the dialog closes.
- Refactoring unrelated handlers or adding dependencies.

## Decisions

### D1 — Explicit view state with one setter

`JobMatchModal` holds `this.view` with values `input | loading | result`. A single `setView(view)` toggles `hidden` on the three view containers; every transition goes through it: `open()` and the return control use `input`, submit uses `loading`, `showResult()` uses `result`, and `showFailure()` uses `input`. Alternative: keep the current independent `hidden` flags and set them at each call site — rejected because the failure path and the cooldown ticker can then disagree with the visible view. Alternative: CSS classes alone — rejected because the `hidden` attribute also removes inactive content from the accessibility tree.

### D2 — View containers in the dialog markup

Wrap the privacy notice, form, and fallback panel in an input view container; add a loading view container with a visible spinner and progress text; reuse the existing result section as the result view and add an action row containing **Compare another vacancy**, email, and CV download. `tabindex="-1"` is added to the loading message and result heading as programmatic focus targets. The existing `#job-match-status` stays outside the views as the single polite live region for transition messages; the cooldown no longer writes to it.

### D3 — Reset semantics

A `resetInput()` helper clears the textarea, counter, field error, fallback message, status, and result fields, then shows the input view. It runs on every `open()` and whenever **Compare another vacancy** is activated, so a previous result or in-flight state is never shown on reopening and the return path starts with an empty field. Discarding an unsent draft when the dialog is closed is accepted: the page deliberately does not store vacancy text.

### D4 — Focus follows the view

| Transition | Focus target |
|---|---|
| Open / return from result | Vacancy textarea |
| Submit to loading | Loading message container |
| Success to result | Result heading |
| Failure to input | Vacancy textarea; fallback uses its existing `role="alert"` |

Leaving focus on a hidden control would strand keyboard users inside the modal, so focus is moved after each `setView()` call.

### D5 — Cooldown feedback lives in the submit control

Replace the native `disabled` attribute with `aria-disabled="true"` and a `syncSubmitControl()` helper that sets either `Compare vacancy`, `Comparing...`, or `Compare vacancy (Ns)` plus the unavailable state. `handleSubmit()` keeps its existing `loading` and `isCoolingDown()` guards because `aria-disabled` does not block activation. The countdown ticker calls only `syncSubmitControl()`; `restoreCooldown()` calls it once at construction. CSS mirrors the existing disabled styling with an `[aria-disabled='true']` selector. Native `disabled` was rejected because it removes the button from the tab order, making the countdown undiscoverable to keyboard and screen-reader users.

### D6 — Fallback and contact paths stay reachable

The fallback panel moves inside the input view, so a failed comparison returns to an editable form with the explanatory message and email/CV actions. The result view gets its own action row rather than relying on the form's "Email me instead" link, which is hidden once the form is gone.

### D7 — Styling and motion

View containers rely on the `hidden` attribute, with an explicit `.job-match-view[hidden] { display: none; }` guard for grid/flex children. The spinner uses a CSS rotation keyframe; under `prefers-reduced-motion` the animation is removed and a static progress indicator remains. The dialog keeps its existing `max-height` and internal scrolling; view swaps use no additional transition, avoiding layout-driven animation complexity.

## Risks / Trade-offs

- **Focus lands on a hidden element** → move focus in the same method that switches views and verify with a keyboard-only pass.
- **`aria-disabled` does not prevent form submission** → retain the JavaScript guards in `handleSubmit()` and verify rapid submissions send no extra request.
- **Countdown label changes every second** → the label is not a live region, so screen readers read it on focus instead of announcing repeatedly; the shared status line stays stable.
- **Closing the dialog discards an unsent draft** → accepted per D3; no storage is introduced.
- **Dialog height differs between views** → existing `max-height` and scrolling keep it usable; add a `min-height` only if the resize proves distracting during verification.
- **Reduced-motion users lose progress feedback** → static indicator is retained when the animation is disabled.

## Migration Plan

Deploy the three edited files through the existing GitHub Actions Pages workflow; no API, secret, or storage migration is needed. Rollback is reverting `index.html`, `styles/job-match.css`, and `scripts/components/jobMatchModal.js` — the cooldown key is unchanged, so no persisted state is invalidated. Verify the success, failure, and return paths with keyboard only, at the 768px breakpoint, and with reduced motion enabled; confirm a second submission inside the cooldown sends no request.
