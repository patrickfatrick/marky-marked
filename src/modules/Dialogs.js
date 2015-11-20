import {Element} from './Element';

/**
 * Creates dialog (modal) elements
 * @class
 * @requires Element
 * @param {String}			type		tag name for the element
 * @param {String}			title		title for the element
 * @param {String}			id			editor ID to associate with the element
 * @param {HTMLElement}	parent	element this element should have access to
 */

export class LinkDialog extends Element {
	constructor (type, title, id, parent) {
		super(type || 'div', title || 'Link Dialog', id, parent);
		super.addClass([this.title, id, 'dialog']);
		let element = this.element;
		let editor = this.parent.element;

		let linkForm = new Element('form', 'Link-Form');
		linkForm.assign('id', id + '-link-form');

		let linkUrlInput = new Element('input', 'Link-Url');
		linkUrlInput.addClass(['link-url-input']);
		linkUrlInput.assign('type', 'text');
		linkUrlInput.assign('name', id + '-link-url-input');
		linkUrlInput.assign('placeholder', 'http://url.com');

		let linkDisplayInput = new Element('input', 'Link-Display');
		linkDisplayInput.addClass(['link-display-input']);
		linkDisplayInput.assign('type', 'text');
		linkDisplayInput.assign('name', id + '-link-display-input');
		linkDisplayInput.assign('placeholder', 'Display text');

		let insertButton = new Element('button', 'Insert Link');
		insertButton.addClass(['insert-link']);
		insertButton.assign('textContent', 'Insert');

		linkForm.appendTo(this.element);
		linkUrlInput.appendTo(linkForm.element);
		linkDisplayInput.appendTo(linkForm.element);
		insertButton.appendTo(linkForm.element);

		linkForm.listen('submit', function (e) {
			e.preventDefault();
			editor.focus();
		});
		insertButton.listen('click', function (e) {
			e.preventDefault;
			editor.focus();
			let url = linkUrlInput.element.value ? linkUrlInput.element.value : 'http://url.com';
			let display = linkDisplayInput.element.value ? linkDisplayInput.element.value : url;
			linkUrlInput.element.value = '';
			linkDisplayInput.element.value = '';
			element.style.visibility = 'hidden';
			return editor._marky.link([editor.selectionStart, editor.selectionEnd], url, display);
		});
		this.parent.listen('click', () => {
			super.removeClass(['toggled']);
			return element.style.visibility = 'hidden';
		});
	}
}

export class ImageDialog extends Element {
	constructor (type, title, id, parent) {
		super(type || 'div', title || 'Image Dialog', id, parent);
		super.addClass([this.title, id, 'dialog']);
		let element = this.element;
		let editor = this.parent.element;

		let imageForm = new Element('form', 'Image-Form');
		imageForm.assign('id', id + '-image-form');

		let imageSourceInput = new Element('input', 'Image-Source');
		imageSourceInput.addClass(['image-source-input']);
		imageSourceInput.assign('type', 'text');
		imageSourceInput.assign('name', id + '-image-source-input');
		imageSourceInput.assign('placeholder', 'http://imagesource.com/image.jpg');

		let imageAltInput = new Element('input', 'Image-Alt');
		imageAltInput.addClass(['image-alt-input']);
		imageAltInput.assign('type', 'text');
		imageAltInput.assign('name', id + '-image-display-input');
		imageAltInput.assign('placeholder', 'Alt text');

		let insertButton = new Element('button', 'Insert Image');
		insertButton.addClass(['insert-image']);
		insertButton.assign('textContent', 'Insert');

		imageForm.appendTo(this.element);
		imageSourceInput.appendTo(imageForm.element);
		imageAltInput.appendTo(imageForm.element);
		insertButton.appendTo(imageForm.element);

		imageForm.listen('submit', e => {
			e.preventDefault();
			editor.focus();
		});
		insertButton.listen('click', e => {
			e.preventDefault;
			editor.focus();
			let source = imageSourceInput.element.value ? imageSourceInput.element.value : 'http://imagesource.com/image.jpg';
			let alt = imageAltInput.element.value ? imageAltInput.element.value : source;
			imageSourceInput.element.value = '';
			imageAltInput.element.value = '';
			element.style.visibility = 'hidden';
			return editor._marky.image([editor.selectionStart, editor.selectionEnd], source, alt);
		});
	}
}
