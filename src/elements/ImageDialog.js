import Element from './Element';
import Dialog from './Dialog';

/**
 * Creates image dialog modal
 * @type {Dialog}
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */
export default class ImageDialog extends Dialog {
  constructor(id) {
    super(id, 'Image Dialog');

    this.form = new Element('form', { id: `${id}-image-form`, title: 'Image Form' })
      .appendToElement(this);

    this.urlInput = new Element('input', {
      type: 'text',
      name: `${id}-image-source-input`,
      placeholder: 'http://url.com/image.jpg',
      title: 'Image Source',
    })
      .addClass('image-source-input');

    this.nameInput = new Element('input', {
      type: 'text',
      name: `${id}-image-alt-input`,
      placeholder: 'Alt text',
      title: 'Image Alt',
    })
      .addClass('image-alt-input');

    this.insertButton = new Element('button', {
      type: 'submit',
      textContent: 'Insert',
      title: 'Insert Image',
    })
      .addClass('insert-image');

    this.form.appendElements([
      this.urlInput,
      this.nameInput,
      this.insertButton,
    ]);
  }
}
