'use strict'

import Element from './Element'
import Icon from './Icon'

/**
 * Creates HTML option elements
 * @type {Element}
 * @requires  Icon
 * @param {String}  title   title for the element
 * @param {String}  value   a value to assign the element
 * @param {Array}  iconClasses    classes to use for <i> elements
 */
const HeadingItem = Object.create(Element)
HeadingItem.init = function (title, value, ...iconClasses) {
  Element.init.call(this, 'li', title)
  .addClass(this.title.replace(' ', '-'))
  .assign('value', value)

  this.button = Object.create(Element)
  .init('button', title)
  .assign('type', 'button')
  .assign('value', value)
  .addClass('heading-button')
  .appendTo(this.element)

  if (iconClasses.length) {
    this.icon = Object.create(Icon)
    .init(...iconClasses)
    .appendTo(this.button.element)
  } else {
    this.button.assign('textContent', value)
  }

  return this
}

export default HeadingItem
