import Element from './Element';
import Dialog from './Dialog';

/**
 * Creates dialog (modal) elements
 * @type {Dialog}
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */
export default class LinkDialog extends Dialog {
  constructor(title, id) {
    super(title, id);
    this.addClass(this.title, id, 'dialog');

    this.form = new Element('form', 'Link Form')
      .assign('id', `${this.id}-link-form`)
      .appendTo(this.element);

    this.urlInput = new Element('input', 'Link Url')
      .addClass('link-url-input')
      .assign('type', 'text')
      .assign('name', `${this.id}-link-url-input`)
      .assign('placeholder', 'http://url.com')
      .appendTo(this.form.element);

    this.nameInput = new Element('input', 'Link Display')
      .addClass('link-display-input')
      .assign('type', 'text')
      .assign('name', `${this.id}-link-display-input`)
      .assign('placeholder', 'Display text')
      .appendTo(this.form.element);

    this.insertButton = new Element('button', 'Insert Link')
      .addClass('insert-link')
      .assign('type', 'submit')
      .assign('textContent', 'Insert')
      .appendTo(this.form.element);
  }
}
