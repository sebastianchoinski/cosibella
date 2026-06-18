export function debounce(callback, delay) {
  let timeoutId;

  return (...args) => {
    // wait for typing to calm down a bit
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
