import Element from './Element';

/**
 * Creates HTML i elements
 * @type {Element}
 * @param {String[]} classNames classes to use with element
 */
export default class Icon extends Element {
  constructor(...classNames) {
    super('i');
    this.addClass(...classNames);
  }
}
