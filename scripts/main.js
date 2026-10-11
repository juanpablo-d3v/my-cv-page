import NavigationHandler from './nav.js';
import IconHandler from './icons.js';
import CertificationHandler from './certifications.js';
import ScrollAnimations from './scrollAnimations.js';

class App {
  constructor() {
    this.initialize();
  }

  initialize() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.run());
    } else {
      this.run();
    }
  }

  run() {
    new NavigationHandler();
    new IconHandler();
    new CertificationHandler();
    new ScrollAnimations();
    console.log('[JP-DEV] CV Landing Page initialized');
  }
}

const app = new App();
