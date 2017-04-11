'use strict'

import Element from './Element'
import Icon from './Icon'

/**
 * Creates HTML button elements
 * @type {Element}
 * @requires Icon
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 * @param {Array}      iconClasses      classes to use for <i> elements
 */
const Button = Object.create(Element)
Button.init = function (title, id, ...iconClasses) {
  Element.init.call(this, 'button', title, id)
  .addClass(this.title, this.id)
  .assign('value', this.title)
  .assign('type', 'button')

  this.icon = Object.create(Icon)
  .init(...iconClasses)
  .appendTo(this.element)

  return this
}

export default Button
