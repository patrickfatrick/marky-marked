import {Element} from './element';
import {HeadingOption} from './options';
import {blockHandler} from './handlers';
import {update} from './custom-events';

export class HeadingSelect extends Element {
	constructor (type = 'select', title = 'Heading', id, parent) {
		super(type, title, id, parent);
		super.addClass([this.title, id]);
		const editor = parent.element;
		super.listen('change', () => {
			let selected = this.element.selectedIndex;
			let value = this.element.options[selected].value;
			editor.focus();
			const indices = [editor.selectionStart, editor.selectionEnd];
			let headingify = blockHandler(editor.value, indices, value + ' ');
			editor.value = headingify.value;
			editor.setSelectionRange(headingify.range[0], headingify.range[1]);
			editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
			let html = editor._marky.state.get(editor._marky.index).get('html');
			this.element.selectedIndex = 0;
			editor.nextSibling.value = html;
			editor.dispatchEvent(update);
		});

		let optionPlaceholder = new HeadingOption('option', 'Headings', '');
		optionPlaceholder.assign('value', '');
		let remove = new HeadingOption('option', 'Remove', '');
		let option1 = new HeadingOption('option', 'Heading 1', '#');
		let option2 = new HeadingOption('option', 'Heading 2', '##');
		let option3 = new HeadingOption('option', 'Heading 3', '###');
		let option4 = new HeadingOption('option', 'Heading 4', '####');
		let option5 = new HeadingOption('option', 'Heading 5', '#####');
		let option6 = new HeadingOption('option', 'Heading 6', '######');

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
