'use strict'

import {Element} from './Element'
import {Icon} from './Icon'

/**
 * Creates HTML button elements
 * @type {Element}
 * @requires Icon
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 * @param {Array}      iconClasses      classes to use for <i> elements
 */
export var Button = Object.create(Element)
Button.init = function (title, id, ...iconClasses) {
  Element.init.call(this, 'button', title, id)
  this.addClass(this.title, this.id)
  this.assign('value', this.title)
  this.icon = Object.create(Icon)
  this.icon.init(iconClasses)
  this.icon.appendTo(this.element)
}
