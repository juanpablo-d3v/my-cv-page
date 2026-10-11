import { handleKeyboardNavigation } from './utils/handleKeyboardNavigation.js';

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

export default CertificationHandler;
