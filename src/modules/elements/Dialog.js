'use strict'

import Element from './Element'

/**
 * Creates dialog elements
 * @type {Element}
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */
const Dialog = Object.create(Element)
Dialog.init = function (title, id) {
  Element.init.call(this, 'div', title, id)
  .addClass(this.title, id, 'dialog')

  return this
}

export default Dialog
