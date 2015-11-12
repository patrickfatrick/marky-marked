import {Element} from './Element';
import {HeadingOption} from './Options';

/**
 * Creates HTML select elements
 * @class
 * @requires Element
 * @param {String}			type		tag name for the element
 * @param {String}			title		title for the element
 * @param {String}			id			editor ID to associate with the element
 * @param {HTMLElement}	parent	element this element should have access to
 */

export class HeadingSelect extends Element {
	constructor (type = 'select', title = 'Heading', id, parent) {
		super(type, title, id, parent);
		super.addClass([this.title, id]);
		const editor = parent.element;
		super.listen('change', () => {
			let selected = this.element.selectedIndex;
			let value = parseInt(this.element.options[selected].value);
			editor.focus();
			this.element.selectedIndex = 0;
			return editor._marky.heading(value, [editor.selectionStart, editor.selectionEnd]);
		});

		let optionPlaceholder = new HeadingOption('option', 'Headings', '');
		optionPlaceholder.assign('value', '');
		let remove = new HeadingOption('option', 'Remove', '0');
		let option1 = new HeadingOption('option', 'Heading 1', '1');
		let option2 = new HeadingOption('option', 'Heading 2', '2');
		let option3 = new HeadingOption('option', 'Heading 3', '3');
		let option4 = new HeadingOption('option', 'Heading 4', '4');
		let option5 = new HeadingOption('option', 'Heading 5', '5');
		let option6 = new HeadingOption('option', 'Heading 6', '6');

		optionPlaceholder.appendTo(this.element);
		remove.appendTo(this.element);
		option1.appendTo(this.element);
		option2.appendTo(this.element);
		option3.appendTo(this.element);
		option4.appendTo(this.element);
		option5.appendTo(this.element);
		option6.appendTo(this.element);
	}
}
