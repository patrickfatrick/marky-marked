import {Marky} from '../marky';
import {Element} from './Element';
import {BoldButton, ItalicButton, StrikethroughButton, CodeButton, BlockquoteButton, LinkButton, ImageButton, UnorderedListButton, OrderedListButton, UndoButton, RedoButton} from './Buttons';
import {HeadingSelect} from './Selects';

/**
 * Register and append the DOM elements needed and set the event listeners
 * @param 	{String}	tag name to be used for initialization
 * @returns {Object} a Marky Mark instance
 */
export default function (tag = 'marky-mark') {

	const update = new CustomEvent('update');
	let containers = document.getElementsByTagName(tag);

	Array.prototype.forEach.call(containers, container => {
		let toolbar = new Element('div', 'Toolbar');
		toolbar.addClass('marky-toolbar');

		let headingSelect = new HeadingSelect;
		let boldButton = new BoldButton;
		let italicButton = new ItalicButton;
		let strikethroughButton = new StrikethroughButton;
		let codeButton = new CodeButton;
		let blockquoteButton = new BlockquoteButton;
		let linkButton = new LinkButton;
		let imageButton = new ImageButton;
		let unorderedListButton = new UnorderedListButton;
		let orderedListButton = new OrderedListButton;
		let undoButton = new UndoButton;
		let redoButton = new RedoButton;

		let separatorA = new Element('span');
		separatorA.assign('textContent', '|');
		separatorA.addClass('separator');

		let separatorB = new Element('span');
		separatorB.assign('textContent', '|');
		separatorB.addClass('separator');

		let separatorC = new Element('span');
		separatorC.assign('textContent', '|');
		separatorC.addClass('separator');

		let separatorD = new Element('span');
		separatorD.assign('textContent', '|');
		separatorD.addClass('separator');

		let textarea = new Element('textarea', 'Editor');
		textarea.assign('contentEditable', true);
		textarea.addClass('marky-editor');

		let input = new Element('input', 'Output');
		input.assign('type', 'hidden');
		input.addClass('marky-output');

		toolbar.appendTo(container);
		textarea.appendTo(container);
		input.appendTo(container);
		headingSelect.appendTo(toolbar.element);
		separatorA.appendTo(toolbar.element);
		boldButton.appendTo(toolbar.element);
		italicButton.appendTo(toolbar.element);
		strikethroughButton.appendTo(toolbar.element);
		codeButton.appendTo(toolbar.element);
		blockquoteButton.appendTo(toolbar.element);
		separatorB.appendTo(toolbar.element);
		linkButton.appendTo(toolbar.element);
		imageButton.appendTo(toolbar.element);
		separatorC.appendTo(toolbar.element);
		unorderedListButton.appendTo(toolbar.element);
		orderedListButton.appendTo(toolbar.element);
		separatorD.appendTo(toolbar.element);
		undoButton.appendTo(toolbar.element);
		redoButton.appendTo(toolbar.element);
	});

	let editors = document.querySelectorAll('.marky-editor');

	Array.prototype.forEach.call(editors, editor => {
		editor._marky = new Marky;

		editor.addEventListener('update', function (e) {
			this._marky.update(e.target.value, this._marky.state, this._marky.index);
			let html = this._marky.state[this._marky.index].get('html');
			return e.target.nextSibling.value = html;
		}, false);

		editor.addEventListener('input', function (e) {
			return e.target.dispatchEvent(update);
		}, false);

	});

}
