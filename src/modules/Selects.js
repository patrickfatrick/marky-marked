import {Element} from './Element';
import {HeadingOption} from './Options';

export class HeadingSelect extends Element {
	constructor (type = 'select', title = 'Heading') {
		super(type, title);
		super.addClass(this.title);
		super.listen('change', e => {
			e.preventDefault();
			console.log('select on ' + this.title);
		});

		let optionPlaceholder = new HeadingOption('option', 'Normal');
		optionPlaceholder.assign('value', '');
		let option1 = new HeadingOption('option', 'Heading 1');
		let option2 = new HeadingOption('option', 'Heading 2');
		let option3 = new HeadingOption('option', 'Heading 3');
		let option4 = new HeadingOption('option', 'Heading 4');
		let option5 = new HeadingOption('option', 'Heading 5');
		let option6 = new HeadingOption('option', 'Heading 6');

		optionPlaceholder.appendTo(this.element);
		option1.appendTo(this.element);
		option2.appendTo(this.element);
		option3.appendTo(this.element);
		option4.appendTo(this.element);
		option5.appendTo(this.element);
		option6.appendTo(this.element);
	}
}
