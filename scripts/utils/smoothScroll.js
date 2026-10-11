// utils/smoothScroll.js
/**
 * Smooth scroll to element
 */
export function smoothScroll(target) {
  const element = document.querySelector(target);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
