import {Element} from './element';

export class HeadingOption extends Element {
	constructor (type = 'option', title, value) {
		super(type, title);
		super.addClass([this.title.replace(' ', '-')]);
		super.assign('value', value);
		super.assign('textContent', this.title);
	}
}
