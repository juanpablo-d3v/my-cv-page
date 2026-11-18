# Tasks

## 1. Dialog markup

- [x] 1.1 Wrap the privacy notice, form, and fallback panel in an input view container (`job-match-view`) while keeping `#job-match-status` outside all views; verify the initial DOM shows only the input view and the status element remains a direct dialog child with `aria-live="polite"`.
- [x] 1.2 Add a hidden loading view containing a spinner and a progress message with `tabindex="-1"`; verify it exists in the markup and is hidden on load.
- [x] 1.3 Add `tabindex="-1"` to the result heading and a result action row with a **Compare another vacancy** button plus email and CV download links; verify the result view is hidden initially and exposes both actions.
- [x] 1.4 Give each view container a stable id and a shared `job-match-view` class; verify all three containers can be toggled through one attribute without changing existing result field ids.

## 2. View state and transitions in the handler

- [x] 2.1 Add an explicit `this.view` state and a `setView(view)` method that toggles `hidden` on the three view containers; verify that setting each state leaves exactly one view visible in the browser.
- [x] 2.2 Route valid submit to `loading`, `showResult()` to `result`, `showFailure()` to `input`, and dialog open to `input`; verify a successful compare shows no form and a failed compare shows the form with the fallback message and no score.
- [x] 2.3 Add `resetInput()` to clear the textarea, counter, field error, fallback message, status, and result fields, and call it on open and from the return control; verify reopening after a result shows an empty field and no result, and the return control clears previously submitted text.
- [x] 2.4 Wire the **Compare another vacancy** control to reset the input, show the input view, and focus the textarea; verify the cooldown remains active after returning.
- [x] 2.5 Move focus on each transition to the loading message, result heading, or textarea per the design table; verify with a keyboard-only pass that focus never remains on a hidden control.

## 3. Cooldown feedback in the submit control

- [x] 3.1 Add `syncSubmitControl()` to set the label (`Compare vacancy`, `Comparing...`, or `Compare vacancy (Ns)`) and toggle `aria-disabled` while preserving the `loading` and `isCoolingDown()` guards in `handleSubmit()`; verify the button stays tabbable during cooldown and an activation sends no request.
- [x] 3.2 Change the cooldown ticker and `restoreCooldown()` to call `syncSubmitControl()` only, removing all writes to the status line; verify the label counts down and resets while the status text stays stable.

## 4. Styling and motion

- [x] 4.1 Add styles for view visibility, the spinner, the return control, and `[aria-disabled='true']` using existing design tokens; verify the loading and result views render correctly at desktop width and at the 768px breakpoint with the existing result grid intact.
- [x] 4.2 Disable the spinner animation and keep a static progress indicator under `prefers-reduced-motion`; verify with reduced-motion emulation that progress remains visible without animation.

## 5. Integration verification

- [x] 5.1 Exercise a successful comparison end to end with a valid result: verify loading replaces the form, the result view appears alone with score, verdict, skills, gaps, rationale, focus on the result heading, and working email/CV actions.
- [x] 5.2 Exercise a failed comparison end to end with AI unavailable: verify the dialog returns to the input view with the explanatory message, email and CV actions, no score, and focus on the textarea.
- [x] 5.3 Verify the reopen and cooldown flow: close and reopen during the 20-second cooldown to see an empty input and a counting-down submit label, then confirm a new comparison is accepted only after it expires.
- [x] 5.4 Confirm the change stays scoped to `index.html`, `styles/job-match.css`, and `scripts/components/jobMatchModal.js` with `git diff --check` clean and no browser console errors.
