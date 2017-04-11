import Element from './Element'

/**
 * Create separator spans for the toolbar
 * @type {Element}
 */
const Separator = Object.create(Element)
Separator.init = function () {
  Element.init.call(this, 'span')
  this.addClass('separator')

  return this
}

export default Separator
