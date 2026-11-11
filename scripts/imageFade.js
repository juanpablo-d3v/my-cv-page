class ImageFade {
  constructor() {
    this.initializeImageFade();
  }

  initializeImageFade() {
    // Mark images as loaded so the .is-loaded class (scoped to .js-enabled)
    // can fade them in over the LQIP placeholder.
    const images = document.querySelectorAll('.hero-bg img, .skill-card-image img');

    images.forEach(img => {
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add('is-loaded');
        return;
      }

      img.addEventListener('load', () => img.classList.add('is-loaded'));
      img.addEventListener('error', () => img.classList.add('is-loaded'));
    });
  }
}

export default ImageFade;
