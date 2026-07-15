/**
 * Main.js - Entry point for CV Landing Page
 * Vanilla JavaScript with ES modules
 * No external dependencies
 */

// ================================================
// Utility Functions
// ================================================

/**
 * Smooth scroll to element
 */
function smoothScroll(target) {
  const element = document.querySelector(target);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Handle keyboard navigation
 */
function handleKeyboardNavigation(event, callback) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    callback();
  }
}

// ================================================
// Interactive Components
// ================================================

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

class IconHandler {
  constructor() {
    this.initializeIcons();
  }

  initializeIcons() {
    // Header social icons
    const headerIcons = document.querySelectorAll('.header-icons .material-symbols-outlined');
    headerIcons.forEach(icon => {
      icon.addEventListener('click', () => this.handleHeaderIcon(icon));
      icon.addEventListener('keydown', (e) => {
        handleKeyboardNavigation(e, () => this.handleHeaderIcon(icon));
      });
    });

    // CTA icons
    const ctaIcons = document.querySelectorAll('.cta-icons .material-symbols-outlined');
    ctaIcons.forEach(icon => {
      icon.addEventListener('click', () => this.handleCtaIcon(icon));
      icon.addEventListener('keydown', (e) => {
        handleKeyboardNavigation(e, () => this.handleCtaIcon(icon));
      });
    });
  }

  handleHeaderIcon(icon) {
    const iconType = (icon.getAttribute('data-icon') || icon.textContent || '').trim();
    switch (iconType) {
      case 'mail':
        window.location.href = 'mailto:hello@juanpablo.dev';
        break;
      case 'share':
        this.shareProfile();
        break;
    }
  }

  handleCtaIcon(icon) {
    const iconType = icon.getAttribute('title') || icon.textContent;
    switch (iconType) {
      case 'LinkedIn':
        this.openExternalLink('https://linkedin.com');
        break;
      case 'GitHub':
        this.openExternalLink('https://github.com');
        break;
    }
  }

  openExternalLink(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  shareProfile() {
    if (navigator.share) {
      navigator.share({
        title: 'JuanPablo Dev',
        text: 'Check out my CV and experience',
        url: window.location.href,
      }).catch(err => console.log('Share failed:', err));
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          console.log('Profile URL copied to clipboard');
          // Optional: Show a toast notification
        })
        .catch(err => console.error('Failed to copy:', err));
    }
  }
}

class CertificationHandler {
  constructor() {
    this.initializeCertifications();
  }

  initializeCertifications() {
    const certItems = document.querySelectorAll('.certification-item');
    certItems.forEach(cert => {
      cert.addEventListener('click', () => this.handleCertificationClick(cert));
      cert.addEventListener('keydown', (e) => {
        handleKeyboardNavigation(e, () => this.handleCertificationClick(cert));
      });
    });
  }

  handleCertificationClick(certItem) {
    const docPath = certItem.getAttribute('data-doc');
    if (docPath) {
      window.open(docPath, '_blank', 'noopener,noreferrer');
      return;
    }

    const certName = certItem.querySelector('.cert-name').textContent;
    console.log(`Certification clicked: ${certName}`);
  }
}

class ScrollAnimations {
  constructor() {
    this.initializeScrollAnimations();
  }

  initializeScrollAnimations() {
    // Intersection Observer for fade-in animations when elements come into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Initialize sections for scroll animation
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });
  }
}

// ================================================
// App Initialization
// ================================================

class App {
  constructor() {
    this.initialize();
  }

  initialize() {
    // Ensure DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.run());
    } else {
      this.run();
    }
  }

  run() {
    // Initialize all handlers
    new NavigationHandler();
    new IconHandler();
    new CertificationHandler();
    new ScrollAnimations();

    console.log('[JP-DEV] CV Landing Page initialized');
  }
}

// Start the application
const app = new App();
