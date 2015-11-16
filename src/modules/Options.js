import {Element} from './Element';

/**
 * Creates HTML option elements
 * @class
 * @requires Element
 * @param {String}	type		tag name for the element
 * @param {String}	title		title for the element
 * @param {String} 	value		a value to assign the element
 */
export class HeadingOption extends Element {
	constructor (type, title, value) {
		super(type || 'option', title);
		super.addClass([this.title.replace(' ', '-')]);
		super.assign('value', value);
		super.assign('textContent', this.title);
	}
}
