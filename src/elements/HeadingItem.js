import Element from './Element';
import Icon from './Icon';

/**
 * Creates HTML option elements
 * @type {Element}
 * @requires  Icon
 * @param {String}  title   title for the element
 * @param {String}  value   a value to assign the element
 * @param {Array}  iconClasses    classes to use for <i> elements
 */
export default class HeadingItem extends Element {
  constructor(title, value, ...iconClasses) {
    super('li', { title, value });
    this.addClass(title);

    this.button = new Element('button', { type: 'button', value })
      .addClass('heading-button', title)
      .appendToElement(this);

    if (iconClasses.length) {
      this.icon = new Icon(...iconClasses)
        .appendToElement(this.button);
    } else {
      this.button.assign('textContent', value);
    }
  }
}
