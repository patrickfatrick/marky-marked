import Element from './Element';
import Dialog from './Dialog';
import HeadingItem from './HeadingItem';

/**
 * Creates heading dialog element
 * @type {Dialog}
 * @param {String}      id      editor ID to associate with the element
 * @param {String}      title   title for the element
 */
export default class HeadingDialog extends Dialog {
  constructor(id) {
    super(id, 'Heading Dialog');

    this.headingList = new Element('ul', { title: 'Heading List' })
      .addClass(`${id}-heading-list`)
      .appendToElement(this);

    this.options = [...Array(6)]
      .map((_, i) => new HeadingItem(`Heading ${i + 1}`, i + 1));
    this.options.push(new HeadingItem('Remove Heading', 0, 'fa', 'fa-remove'));

    this.options.forEach((option) => {
      option.appendToElement(this.headingList);
    });
  }
}
