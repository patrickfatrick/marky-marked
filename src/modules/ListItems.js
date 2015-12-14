import {Element} from './Element';

/**
 * Creates HTML option elements
 * @class
 * @requires Element
 * @param {String}	type		tag name for the element
 * @param {String}	title		title for the element
 * @param {String} 	value		a value to assign the element
 */
export class HeadingItem extends Element {
	constructor (type, title, value, iconClass = null) {
		super(type || 'li', title);
		super.addClass([this.title.replace(' ', '-')]);
		super.assign('value', value);
		let button = new Element('button', title);
		button.assign('value', value);
		button.addClass(['heading-button']);
		button.appendTo(this.element);
		if (iconClass) {
			let icon = new Element('i');
			icon.addClass(['fa', iconClass]);
			icon.appendTo(button.element);
		} else {
			button.assign('textContent', value);
		}
	}
}
