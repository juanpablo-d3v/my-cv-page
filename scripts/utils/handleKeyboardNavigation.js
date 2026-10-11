// utils/handleKeyboardNavigation.js
/**
 * Handle keyboard navigation (Enter and Space as activation)
 */
export function handleKeyboardNavigation(event, callback) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    callback();
  }
}
