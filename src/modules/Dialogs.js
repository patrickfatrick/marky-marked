import {Element} from './Element';

/**
 * Creates HTML button elements
 * @class
 * @requires Element
 * @param {String}			type		tag name for the element
 * @param {String}			title		title for the element
 * @param {String}			id			editor ID to associate with the element
 * @param {HTMLElement}	parent	element this element should have access to
 */

export class LinkDialog extends Element {
	constructor (type, title, id, parent) {
		super(type || 'div', title || 'Link-Dialog', id, parent);
		super.addClass([this.title, id]);
		let editor = this.parent.element;
		
		let linkForm = new Element('form', 'Link-Form');
		
		let linkUrlInput = new Element('input', 'Link-Url');
		linkUrlInput.assign('type', 'text');
		
		let linkDisplayInput = new Element('input', 'Link-Display');
		linkDisplayInput.assign('type', 'text');
		
		let insertButton = new Element('button', 'Insert-Link');
		insertButton.addClass(['insert']);
		insertButton.assign('textContent', 'Insert');
		
		linkForm.appendTo(this.element);
		linkUrlInput.appendTo(linkForm.element);
		linkDisplayInput.appendTo(linkForm.element);
		insertButton.appendTo(linkForm.element);
		
		linkForm.listen('blur', function () {
			this.element.style.display = 'none';
		});
	}
}