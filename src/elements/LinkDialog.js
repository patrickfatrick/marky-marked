import Element from './Element';
import Dialog from './Dialog';

/**
 * Creates dialog (modal) elements
 * @type {Dialog}
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */
export default class LinkDialog extends Dialog {
  constructor(id) {
    super(id, 'Link Dialog');

    this.form = new Element('form', {
      id: `${id}-link-form`,
      title: 'Link Form',
    })
      .appendToElement(this);

    this.urlInput = new Element('input', {
      type: 'text',
      name: `${id}-link-url-input`,
      placeholder: 'http://url.com',
      title: 'Link Url',
    })
      .addClass('link-url-input');

    this.nameInput = new Element('input', {
      type: 'text',
      name: `${id}-link-display-input`,
      placeholder: 'Display text',
      title: 'Link Display',
    })
      .addClass('link-display-input');

    this.insertButton = new Element('button', {
      type: 'submit',
      textContent: 'Insert',
      title: 'Insert Link',
    })
      .addClass('insert-link');

    this.form.appendElements([
      this.urlInput,
      this.nameInput,
      this.insertButton,
    ]);
  }
}
