import { smoothScroll } from './utils/smoothScroll.js';
import { handleKeyboardNavigation } from './utils/handleKeyboardNavigation.js';

class NavigationHandler {
  constructor() {
    this.initializeNavigation();
  }

  initializeNavigation() {
    // Handle navigation links
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          smoothScroll(href);
        }
      });
    });

    // Handle connect button
    const connectBtn = document.querySelector('nav button');
    if (connectBtn) {
      connectBtn.addEventListener('click', () => {
        smoothScroll('#experience');
      });
    }
  }
}

export default NavigationHandler;
