import Element from './Element';

/**
 * Create separator spans for the toolbar
 * @type {Element}
 */
export default class Separator extends Element {
  constructor() {
    super('span');
    this.addClass('separator');
  }
}
