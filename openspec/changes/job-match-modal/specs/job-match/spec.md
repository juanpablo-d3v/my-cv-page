# Spec Delta

## Purpose

Lets a recruiter paste a vacancy description from the hero section and see how well it matches the CV profile, including a match score, matched skills, gaps, and a short rationale, while degrading to the existing contact paths when AI comparison is unavailable.

## ADDED Requirements

### Requirement: Vacancy comparison is reachable from the hero

The page SHALL present a vacancy comparison entry point in the hero section that opens a modal dialog containing the vacancy input. The entry point SHALL be exposed only when JavaScript is available. The dialog SHALL be closeable with a visible close control and the Escape key, and focus SHALL return to the entry point after closing.

#### Scenario: Opening the comparison
- **WHEN** a visitor activates the hero comparison control
- **THEN** a modal dialog with the vacancy input opens and keyboard focus moves into it

#### Scenario: Closing the comparison
- **WHEN** the dialog is open and the visitor presses Escape or activates the close control
- **THEN** the dialog closes and focus returns to the hero comparison control

#### Scenario: No-JavaScript fallback
- **WHEN** the page loads with JavaScript unavailable
- **THEN** the comparison entry point is not shown and the email and CV download controls remain available

### Requirement: Vacancy is captured as a single free-text input

The comparison dialog SHALL provide a single free-text field into which the visitor pastes the vacancy details, and SHALL NOT require separate role, seniority, or skills inputs. The field SHALL be required, SHALL enforce a maximum length, and SHALL present an inline validation message when it is empty. No comparison request SHALL be sent while the input is invalid.

#### Scenario: Empty submission
- **WHEN** the visitor submits the dialog with an empty vacancy field
- **THEN** the dialog shows an inline validation message and no comparison request is sent

#### Scenario: Input length limit
- **WHEN** a visitor types or pastes text beyond the field's maximum length
- **THEN** the field accepts only up to the limit and indicates that the limit was reached

### Requirement: Comparison uses only the submitted vacancy and the CV profile

The page SHALL send the comparison request to the configured Google Gemini service using only the pasted vacancy text and a curated profile of the candidate's skills and experience. The request SHALL constrain the response to a structured result and SHALL NOT include visitor-identifying data beyond the submitted text.

#### Scenario: Successful comparison
- **WHEN** the visitor submits valid vacancy text while the AI service is available
- **THEN** the page displays a comparison result derived from the submitted text and the CV profile

### Requirement: Comparison result is structured and safely rendered

The result SHALL present a match score as an integer from 0 to 100, a match verdict, the matched skills, the unmet skills or gaps, and a short rationale. All model-provided text SHALL be rendered as plain text. A result whose score is missing, non-numeric, or outside the valid range SHALL be treated as a failed comparison rather than displayed.

#### Scenario: Result composition
- **WHEN** a comparison succeeds
- **THEN** the result shows a score between 0 and 100, a verdict, matched skills, gaps, and a rationale

#### Scenario: Malformed model response
- **WHEN** the AI service returns a result that does not contain a valid score or required fields
- **THEN** the page does not display a score and shows the comparison-unavailable state

### Requirement: Unavailable AI degrades without fabricating a result

When the comparison cannot be completed because the AI service is unconfigured, unreachable, rate-limited, times out, or returns an invalid response, the page SHALL show an explanatory message and the email and CV download actions, and SHALL NOT display a score or any fabricated comparison result. The visitor SHALL be able to retry after a failure, subject to a short cooldown that prevents rapid repeated submissions.

#### Scenario: Rate limited or timed out
- **WHEN** the AI service responds with a rate-limit error or does not respond within the request timeout
- **THEN** the dialog shows an unavailable message with the email and CV download actions and no score

#### Scenario: Rapid repeated submissions
- **WHEN** the visitor submits again immediately after a comparison attempt
- **THEN** the page blocks the new submission until the cooldown elapses and explains why

### Requirement: Comparison sends vacancy data to a third party with disclosure

The dialog SHALL disclose that the submitted vacancy text is sent to Google AI for comparison and is not stored by the page.

#### Scenario: Disclosure before submission
- **WHEN** the visitor views the vacancy input
- **THEN** a privacy notice describing the third-party AI processing is visible before submitting

### Requirement: API key is never committed to the repository

The Gemini API key SHALL be supplied to the deployed site only through the deployment pipeline's secret mechanism. The repository, including its history, SHALL NOT contain the key, and local development configuration containing a key SHALL be excluded from version control. When no key is available to the page, the comparison SHALL report itself as unavailable rather than fail silently or expose an error detail.

#### Scenario: Repository contains no key
- **WHEN** the repository files and history are searched for the API key
- **THEN** no occurrence of the key is found

#### Scenario: Build without a configured key
- **WHEN** the site is served without an injected key
- **THEN** the comparison reports that AI comparison is unavailable and the email and CV download actions remain usable
