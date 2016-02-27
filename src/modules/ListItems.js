'use strict'

import {Element} from './Element'
import {Icon} from './Icon'

/**
 * Creates HTML option elements
 * @type {Element}
 * @requires  Icon
 * @param {String}  title   title for the element
 * @param {String}  value   a value to assign the element
 * @param {Array}  iconClasses    classes to use for <i> elements
 */
export var HeadingItem = Object.create(Element)
HeadingItem.init = function (title, value, ...iconClasses) {
  Element.init.call(this, 'li', title)
  this.addClass(this.title.replace(' ', '-'))
  this.assign('value', value)

  this.button = Object.create(Element)
  this.button.init('button', title)
  this.button.assign('value', value)
  this.button.addClass('heading-button')
  this.button.appendTo(this.element)

  if (iconClasses.length) {
    this.icon = Object.create(Icon)
    this.icon.init(iconClasses)
    this.icon.appendTo(this.button.element)
  } else {
    this.button.assign('textContent', value)
  }
}
