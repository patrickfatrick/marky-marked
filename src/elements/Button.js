import Element from './Element';
import Icon from './Icon';

/**
 * Creates HTML button elements
 * @type {Element}
 * @requires Icon
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 * @param {String[]}      iconClasses      classes to use for <i> elements
 */
export default class Button extends Element {
  constructor(id, title, ...iconClasses) {
    super('button', { title, value: title, type: 'button' });
    this.addClass(title, id);

    this.icon = new Icon(...iconClasses)
      .appendToElement(this);
  }
}
