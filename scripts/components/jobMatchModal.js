import {
  compareVacancy,
  JobMatchError,
  MAX_VACANCY_LENGTH,
  verdictFromScore,
} from '../services/geminiService.js';

const COOLDOWN_MS = 20000;
const COOLDOWN_KEY = 'jp-job-match-last-submit';

const VERDICT_LABELS = {
  strong: 'Strong match',
  partial: 'Partial match',
  weak: 'Weak match',
};

const FAILURE_MESSAGES = {
  config: 'AI comparison is unavailable right now. You can still email me or download my CV.',
  network:
    'AI comparison could not reach the service. Please try again, or email me or download my CV.',
  quota:
    'The AI service is busy right now. Please try again later, or email me or download my CV.',
  http: 'AI comparison is unavailable right now. You can still email me or download my CV.',
  timeout:
    'AI comparison took too long to respond. Please try again, or email me or download my CV.',
  invalid:
    'The AI response could not be read. Please try again, or email me or download my CV.',
  input: 'Paste the vacancy text to compare.',
};

class JobMatchModal {
  constructor() {
    this.trigger = document.querySelector('[data-job-match-open]');
    this.dialog = document.getElementById('job-match-dialog');
    this.form = document.getElementById('job-match-form');
    this.input = document.getElementById('job-match-input');
    this.counter = document.getElementById('job-match-counter');
    this.closeButton = document.querySelector('[data-job-match-close]');
    this.submitButton = document.querySelector('[data-job-match-submit]');
    this.errorMessage = document.getElementById('job-match-error');
    this.status = document.getElementById('job-match-status');
    this.result = document.getElementById('job-match-result');
    this.score = document.getElementById('job-match-score');
    this.verdict = document.getElementById('job-match-verdict');
    this.matched = document.getElementById('job-match-matched');
    this.gaps = document.getElementById('job-match-gaps');
    this.rationale = document.getElementById('job-match-rationale');
    this.fallback = document.getElementById('job-match-fallback');
    this.fallbackMessage = document.getElementById('job-match-fallback-message');
    this.cooldownTimer = null;
    this.cooldownUntil = 0;
    this.loading = false;
    this.lastFocused = null;

    if (
      !this.trigger ||
      !this.dialog ||
      !this.form ||
      !this.input ||
      !this.submitButton
    ) {
      return;
    }

    this.initializeDialog();
    this.initializeForm();
    this.restoreCooldown();
  }

  initializeDialog() {
    this.trigger.addEventListener('click', () => this.open());
    this.closeButton?.addEventListener('click', () => this.dialog.close());
    this.dialog.addEventListener('close', () => {
      if (this.lastFocused) {
        this.lastFocused.focus();
      }
    });
  }

  initializeForm() {
    this.form.addEventListener('submit', (event) => this.handleSubmit(event));
    this.input.addEventListener('input', () => this.handleInput());
    this.updateCounter();
  }

  open() {
    this.lastFocused = document.activeElement;
    this.dialog.showModal();
    this.input.focus();
  }

  handleInput() {
    this.updateCounter();

    if (this.input.value.trim()) {
      this.clearFieldError();
    }
  }

  updateCounter() {
    const length = this.input.value.length;
    const limitReached = length >= MAX_VACANCY_LENGTH;

    this.counter.textContent = limitReached
      ? `${length} / ${MAX_VACANCY_LENGTH} (limit reached)`
      : `${length} / ${MAX_VACANCY_LENGTH}`;
    this.counter.classList.toggle('is-limit', limitReached);
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (this.loading) {
      return;
    }

    const text = this.input.value.trim();

    if (!text) {
      this.showFieldError('Paste the vacancy text to compare.');
      this.input.focus();
      return;
    }

    if (this.isCoolingDown()) {
      this.setStatus(
        `Please wait ${this.remainingCooldownSeconds()}s before comparing again.`,
      );
      return;
    }

    this.clearFieldError();
    this.prepareRequest();

    try {
      const result = await compareVacancy(text.slice(0, MAX_VACANCY_LENGTH));
      this.showResult(result);
    } catch (error) {
      this.showFailure(error);
    } finally {
      this.setLoading(false);
    }

    this.startCooldown();
  }

  prepareRequest() {
    this.setLoading(true);
    this.result.hidden = true;
    this.fallback.hidden = true;
    this.setStatus('Comparing vacancy with my profile...');
    this.rememberSubmit();
  }

  showResult(result) {
    const band = verdictFromScore(result.score);

    this.score.textContent = String(result.score);
    this.verdict.textContent = VERDICT_LABELS[band];
    this.verdict.dataset.band = band;
    this.renderList(this.matched, result.matchedSkills, 'No clear matches found.');
    this.renderList(this.gaps, result.gaps, 'No major gaps identified.');
    this.rationale.textContent = result.rationale;
    this.result.hidden = false;
    this.setStatus('Comparison complete.');
  }

  showFailure(error) {
    const code = error instanceof JobMatchError ? error.code : 'invalid';
    const message = FAILURE_MESSAGES[code] ?? FAILURE_MESSAGES.invalid;

    this.result.hidden = true;
    this.fallbackMessage.textContent = message;
    this.fallback.hidden = false;
    this.setStatus('');
  }

  renderList(list, items, emptyMessage) {
    list.replaceChildren();

    const values = items.length ? items : [emptyMessage];

    for (const value of values) {
      const item = document.createElement('li');
      item.textContent = value;
      list.appendChild(item);
    }
  }

  showFieldError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.hidden = false;
    this.input.setAttribute('aria-invalid', 'true');
  }

  clearFieldError() {
    this.errorMessage.textContent = '';
    this.errorMessage.hidden = true;
    this.input.removeAttribute('aria-invalid');
  }

  setStatus(message) {
    this.status.textContent = message;
  }

  setLoading(isLoading) {
    this.loading = isLoading;
    this.submitButton.disabled = isLoading || this.isCoolingDown();
    this.form.toggleAttribute('aria-busy', isLoading);

    if (!isLoading) {
      this.submitButton.textContent = 'Compare vacancy';
    }
  }

  rememberSubmit() {
    this.cooldownUntil = Date.now() + COOLDOWN_MS;

    try {
      localStorage.setItem(COOLDOWN_KEY, String(this.cooldownUntil));
    } catch {
      return;
    }
  }

  restoreCooldown() {
    let stored = 0;

    try {
      stored = Number(localStorage.getItem(COOLDOWN_KEY)) || 0;
    } catch {
      stored = 0;
    }

    if (stored > Date.now()) {
      this.cooldownUntil = stored;
      this.submitButton.disabled = true;
      this.startCooldownCountdown();
    }
  }

  startCooldown() {
    this.submitButton.disabled = true;
    this.startCooldownCountdown();
  }

  startCooldownCountdown() {
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer);
    }

    const tick = () => {
      const remaining = this.remainingCooldownSeconds();

      if (remaining <= 0) {
        clearInterval(this.cooldownTimer);
        this.cooldownTimer = null;
        this.submitButton.disabled = this.loading;
        if (this.fallback.hidden) {
          this.setStatus(this.result.hidden ? '' : 'Comparison complete.');
        }
        return;
      }

      if (this.fallback.hidden) {
        this.setStatus(`You can compare again in ${remaining}s.`);
      }
    };

    tick();
    this.cooldownTimer = setInterval(tick, 1000);
  }

  isCoolingDown() {
    return Date.now() < this.cooldownUntil;
  }

  remainingCooldownSeconds() {
    return Math.max(0, Math.ceil((this.cooldownUntil - Date.now()) / 1000));
  }
}

export default JobMatchModal;
