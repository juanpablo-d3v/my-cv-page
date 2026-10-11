import { handleKeyboardNavigation } from './utils/handleKeyboardNavigation.js';

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
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          console.log('Profile URL copied to clipboard');
          // Optional: Show a toast notification
        })
        .catch(err => console.error('Failed to copy:', err));
    }
  }
}

export default IconHandler;
