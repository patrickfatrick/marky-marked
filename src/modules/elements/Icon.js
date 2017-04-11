import Element from './Element'

/**
 * Creates HTML i elements
 * @type {Element}
 * @param {Array} classNames classes to use with element
 */
const Icon = Object.create(Element)
Icon.init = function (...classNames) {
  Element.init.call(this, 'i')
  .addClass(...classNames)

  return this
}

export default Icon
