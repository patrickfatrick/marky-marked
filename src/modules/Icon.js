import {Element} from './Element'

/**
 * Creates HTML i elements
 * @type {Element}
 * @param {Array} classNames classes to use with element
 */
export var Icon = Object.create(Element)
Icon.init = function (classNames) {
  Element.init.call(this, 'i')
  this.addClass(...classNames)
}
