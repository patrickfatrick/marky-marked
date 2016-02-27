'use strict'

/**
 * Creates an HTML element with some built-in shortcut methods
 * @param {String}      type    tag name for the element
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */
export var Element = {
  init (type, title = null, id = null) {
    this.type = type
    this.title = title
    this.id = id
    this.element = this.register()
    if (this.title) this.element.title = this.title
  },
  register () {
    return document.createElement(this.type)
  },
  assign (prop, value) {
    this.element[prop] = value
  },
  appendTo (container) {
    container.appendChild(this.element)
  },
  addClass (...classNames) {
    classNames.forEach((className) => {
      this.element.classList.add(className.replace(/[ ]/g, '-').toLowerCase())
    })
  },
  removeClass (...classNames) {
    classNames.forEach((className) => {
      this.element.classList.remove(className.replace(/[ ]/g, '-').toLowerCase())
    })
  },
  listen (evt, cb) {
    this.element.addEventListener(evt, cb)
  }
}
