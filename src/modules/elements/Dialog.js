import Element from './Element';

/**
 * Creates dialog elements
 * @type {Element}
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */
export default class Dialog extends Element {
  constructor(title, id) {
    super('div', title, id);
    this.addClass(this.title, id, 'dialog');
  }
}
