/**
 * Creates an HTML element with some built-in shortcut methods
 * @param {String}      type    tag name for the element
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */
export default class Element {
  constructor(type, title = null, id = null) {
    this.type = type;
    this.title = title;
    this.id = id;
    this.element = this.create();
    this.listeners = {};
    if (this.title) this.element.title = this.title;
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
