'use strict'

import {Element} from './Element'

/**
 * Creates HTML button elements
 * @class
 * @requires Element
 * @param {String}      type    tag name for the element
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 * @param {HTMLElement} relevant  element this element should have access to
 */
let Icon = Object.create(Element)
Icon.init = function (type, classNames) {
  Element.init.call(this, 'i')
  this.addClass(classNames)
}

export var Button = Object.create(Element)
Button.init = function (title, id, ...iconClasses) {
  Element.init.call(this, 'button', title, id)
  this.addClass([this.title, this.id])
  this.assign('value', this.title)
  this.icon = Object.create(Icon)
  this.icon.init('i', iconClasses)
  this.icon.appendTo(this.element)
}