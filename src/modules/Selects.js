import {Element} from './Element';
import {HeadingOption} from './Options';
import {blockHandler} from './handlers';

export class HeadingSelect extends Element {
	constructor (type = 'select', title = 'Heading', id) {
		super(type, title, id);
		super.addClass([this.title, id]);
		super.listen('change', () => {
			let selected = this.element.selectedIndex;
			let value = this.element.options[selected].value;
			const editor = document.querySelector('textarea.' + id);
			editor.focus();
			const indices = [editor.selectionStart, editor.selectionEnd];
			let headingify = blockHandler(editor.value, indices, value + ' ');
			editor.value = headingify.value;
			editor.setSelectionRange(headingify.range[0], headingify.range[1]);
			editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
			let html = editor._marky.state[editor._marky.index].get('html');
			this.element.selectedIndex = 0;
			return editor.nextSibling.value = html;
		});

		let optionPlaceholder = new HeadingOption('option', 'Normal');
		optionPlaceholder.assign('value', '');
		let option1 = new HeadingOption('option', 'Heading 1', '#');
		let option2 = new HeadingOption('option', 'Heading 2', '##');
		let option3 = new HeadingOption('option', 'Heading 3', '###');
		let option4 = new HeadingOption('option', 'Heading 4', '####');
		let option5 = new HeadingOption('option', 'Heading 5', '#####');
		let option6 = new HeadingOption('option', 'Heading 6', '######');

		optionPlaceholder.appendTo(this.element);
		option1.appendTo(this.element);
		option2.appendTo(this.element);
		option3.appendTo(this.element);
		option4.appendTo(this.element);
		option5.appendTo(this.element);
		option6.appendTo(this.element);
	}
}
