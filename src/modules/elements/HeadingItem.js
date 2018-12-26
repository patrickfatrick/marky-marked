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
    super('li', title);
    this.addClass(this.title.replace(' ', '-'))
      .assign('value', value);

    this.button = new Element('button', title)
      .assign('type', 'button')
      .assign('value', value)
      .addClass('heading-button')
      .appendTo(this.element);

    if (iconClasses.length) {
      this.icon = new Icon(...iconClasses)
        .appendTo(this.button.element);
    } else {
      this.button.assign('textContent', value);
    }
  }
}
