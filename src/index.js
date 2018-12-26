import initializer from './modules/initializer';

/**
 * Register and append the DOM elements needed and set the event listeners
 * @param   {HTMLCollection}  containers empty elements to initialize marky marked into
 */
export default function markymark(container = document.getElementsByTagName('marky-mark')) {
  if (container instanceof HTMLElement) {
    return initializer(container);
  }

  if (
    !(container instanceof Array)
    && !(container instanceof HTMLCollection)
    && !(container instanceof NodeList)
  ) {
    throw new TypeError('argument should be an HTMLElement, Array, HTMLCollection');
  }

  return Array.from(container).map(initializer);
}
