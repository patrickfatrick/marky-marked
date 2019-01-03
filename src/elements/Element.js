/**
 * Creates an HTML element with some built-in shortcut methods
 * @param {String} type   tag name for the element
 * @param {String} id     editor ID to associate with the element
 * @param {Object} props  props to assign to the element
 */
export default class Element {
  constructor(type, props = {}) {
    this.type = type;
    this.element = this.create();
    this.listeners = {};
    Object.entries(props).forEach(([prop, value]) => {
      this.assign(prop, value);
    });
  }

  create() {
    return document.createElement(this.type);
  }

  assign(prop, value) {
    this.element[prop] = value;

    return this;
  }

  appendTo(container) {
    container.appendChild(this.element);

    return this;
  }

  /**
   * @param {Element} element an instance of Element
   */
  appendToElement(element) {
    element.element.appendChild(this.element);

    return this;
  }

  /**
   * @param {Element[]} elements an array of elements
   */
  appendElements(elements) {
    elements.forEach(element => this.element.appendChild(element.element));

    return this;
  }

  addClass(...classNames) {
    this.element.classList.add(
      ...classNames.map(name => name.replace(/[ ]/g, '-').toLowerCase()),
    );

    return this;
  }

  removeClass(...classNames) {
    this.element.classList.remove(
      ...classNames.map(name => name.replace(/[ ]/g, '-').toLowerCase()),
    );

    return this;
  }

  toggleClass(...classNames) {
    this.element.classList.toggle(
      ...classNames.map(name => name.replace(/[ ]/g, '-').toLowerCase()),
    );

    return this;
  }

  listen(evt, cb) {
    this.listeners[evt] = cb;
    this.element.addEventListener(evt, cb);

    return this;
  }

  removeListener(evt, cb) {
    this.element.removeEventListener(evt, cb);

    return this;
  }

  removeListeners() {
    Object.keys(this.listeners).forEach((listener) => {
      this.removeListener(listener, this.listeners[listener]);
    });

    return this;
  }
}
