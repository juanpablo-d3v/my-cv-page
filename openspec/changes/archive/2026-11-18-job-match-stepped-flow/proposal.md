# Proposal

## Why

After a successful comparison the dialog currently shows the vacancy form and the result together, so a recruiter has to scroll past the text they pasted to reach the verdict, and the loading, cooldown, and error messages all compete for the same status line. Making the comparison a short sequence of dedicated views keeps the result in focus while keeping retry and the existing contact paths obvious.

## What Changes

- Present the dialog as three sequential views: `input`, `loading`, and `result`. Submitting hides the input view; a successful comparison reveals the result view instead of appending it below the form.
- Show a spinner and progress message in place of the form while the comparison is in flight, then swap to the result or return to the input view on failure.
- Add a **Compare another vacancy** control to the result view. Activating it clears the pasted text, returns to the input view, and moves focus to the empty textarea.
- Move the existing 20-second cooldown countdown from the status line into the submit button label (for example, `Compare vacancy (17s)`). Keep the button focusable with `aria-disabled` while cooling down so the countdown is discoverable by keyboard and screen-reader users; the status line is reserved for view transitions.
- Reset the dialog to the input view each time it opens so a previous result is never shown on reopening.
- Preserve the existing failure taxonomy, email/CV fallbacks, request contract, scoring, privacy notice, key handling, and no-JavaScript behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `job-match`: the comparison dialog gains sequential input, loading, and result views with focused transitions; a result-view action to start another comparison by clearing the input; cooldown feedback presented in the submit button rather than the status line; and a reset to the input view on every open.

## Impact

- **Markup**: `index.html` — restructure the dialog body into view containers, add loading indicator and result-view return control.
- **Styles**: `styles/job-match.css` — view visibility, loading state, return control styling, transition and reduced-motion handling.
- **Scripts**: `scripts/components/jobMatchModal.js` — explicit view state, focus management on transitions, open reset, and button-label cooldown countdown.
- **Unchanged**: `scripts/services/geminiService.js`, `scripts/data/cvProfile.js`, deployment workflow, design tokens, and responsive breakpoint conventions.
- **Dependencies**: none added; no API, quota, or key-handling changes.
