import Element from './Element'

/**
 * Creates HTML i elements
 * @type {Element}
 * @param {Array} classNames classes to use with element
 */
export default class Icon extends Element {
  constructor (...classNames) {
    super('i')
    this.addClass(...classNames)
  }
}
