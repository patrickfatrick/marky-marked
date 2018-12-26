import Element from './Element';
import Icon from './Icon';

/**
 * Creates HTML button elements
 * @type {Element}
 * @requires Icon
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 * @param {Array}      iconClasses      classes to use for <i> elements
 */
export default class Button extends Element {
  constructor(title, id, ...iconClasses) {
    super('button', title, id);
    this.addClass(this.title, this.id)
      .assign('value', this.title)
      .assign('type', 'button');

    this.icon = new Icon(...iconClasses)
      .appendTo(this.element);
  }
}
