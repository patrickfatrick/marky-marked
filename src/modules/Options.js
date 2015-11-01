import {Element} from './Element';

export class HeadingOption extends Element {
	constructor (type = 'option', title) {
		super(type, title);
		super.addClass(this.title.replace(' ', '-'));
		super.assign('value', this.title.replace(' ', '-').toLowerCase());
		super.assign('textContent', this.title);
	}
}
