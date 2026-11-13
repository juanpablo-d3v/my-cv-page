import NavigationHandler from './nav.js';
import IconHandler from './icons.js';
import CertificationHandler from './certifications.js';
import ScrollAnimations from './scrollAnimations.js';
import ImageFade from './imageFade.js';
import JobMatchModal from './components/jobMatchModal.js';

document.documentElement.classList.add('js-enabled');

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
    new ImageFade();
    new JobMatchModal();
    console.log('[JP-DEV] CV Landing Page initialized');
  }
}

const app = new App();
