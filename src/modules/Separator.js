import {Element} from './Element'

/**
 * Create separator spans for the toolbar
 * @type {Element}
 */
export var Separator = Object.create(Element)
Separator.init = function () {
  Element.init.call(this, 'span')
  this.addClass('separator')
}
