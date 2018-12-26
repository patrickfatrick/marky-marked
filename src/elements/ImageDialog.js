import Element from './Element';
import Dialog from './Dialog';

/**
 * Creates image dialog modal
 * @type {Dialog}
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */
export default class ImageDialog extends Dialog {
  constructor(title, id) {
    super(title, id);
    this.addClass(this.title, id, 'dialog');

    this.form = new Element('form', 'Image Form')
      .assign('id', `${this.id}-image-form`)
      .appendTo(this.element);

    this.urlInput = new Element('input', 'Image Source')
      .addClass('image-source-input')
      .assign('type', 'text')
      .assign('name', `${this.id}-image-source-input`)
      .assign('placeholder', 'http://url.com/image.jpg')
      .appendTo(this.form.element);

    this.nameInput = new Element('input', 'Image Alt')
      .addClass('image-alt-input')
      .assign('type', 'text')
      .assign('name', `${this.id}-image-alt-input`)
      .assign('placeholder', 'Alt text')
      .appendTo(this.form.element);

    this.insertButton = new Element('button', 'Insert Image')
      .addClass('insert-image')
      .assign('type', 'submit')
      .assign('textContent', 'Insert')
      .appendTo(this.form.element);
  }
}
