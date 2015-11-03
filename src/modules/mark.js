import {Marky} from '../marky';
import {Element} from './Element';
import {BoldButton, ItalicButton, StrikethroughButton, CodeButton, BlockquoteButton, LinkButton, ImageButton, UnorderedListButton, OrderedListButton, UndoButton, RedoButton} from './Buttons';
import {HeadingSelect} from './Selects';
import {update, markychange} from './custom-events';

/**
 * Register and append the DOM elements needed and set the event listeners
 * @param 	{String}	tag name to be used for initialization
 * @returns {Object} a Marky Mark instance
 */
export default function (tag = 'marky-mark') {

	let containers = document.getElementsByTagName(tag);
	Array.prototype.forEach.call(containers, (container, i) => {
		let toolbar = new Element('div', 'Toolbar');
		let id = 'editor-' + i;
		container.id = id;
		toolbar.addClass(['marky-toolbar', id]);

		let headingSelect = new HeadingSelect('select', 'Heading', id);
		let boldButton = new BoldButton('button', 'Bold', id);
		let italicButton = new ItalicButton('button', 'Italic', id);
		let strikethroughButton = new StrikethroughButton('button', 'Strikethrough', id);
		let codeButton = new CodeButton('button', 'Code', id);
		let blockquoteButton = new BlockquoteButton('button', 'Blockquote', id);
		let linkButton = new LinkButton('button', 'Link', id);
		let imageButton = new ImageButton('button', 'Image', id);
		let unorderedListButton = new UnorderedListButton('button', 'Unordered-List', id);
		let orderedListButton = new OrderedListButton('button', 'Ordered-List', id);
		let undoButton = new UndoButton('button', 'Undo', id);
		let redoButton = new RedoButton('button', 'Redo', id);

		let separatorA = new Element('span');
		separatorA.assign('textContent', '|');
		separatorA.addClass(['separator']);

		let separatorB = new Element('span');
		separatorB.assign('textContent', '|');
		separatorB.addClass(['separator']);

		let separatorC = new Element('span');
		separatorC.assign('textContent', '|');
		separatorC.addClass(['separator']);

		let separatorD = new Element('span');
		separatorD.assign('textContent', '|');
		separatorD.addClass(['separator']);

		let textarea = new Element('textarea', 'Editor');
		textarea.assign('contentEditable', true);
		textarea.addClass(['marky-editor', id]);
		textarea.assign('_marky', new Marky);

		let input = new Element('input', 'Output');
		input.assign('type', 'hidden');
		input.addClass(['marky-output', id]);

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

		textarea.listen('update', function (e) {
			this._marky.update(e.target.value, this._marky.state, this._marky.index);
			return e.target.dispatchEvent(markychange);
		}, false);

		textarea.listen('markychange', function (e) {
			let html = this._marky.state.get(this._marky.index).get('html');
			if (this._marky.index === 0)  {
				undoButton.addClass(['disabled']);
			} else {
				undoButton.removeClass(['disabled']);
			}
			if (this._marky.index === this._marky.state.size - 1) {
				redoButton.addClass(['disabled']);
			} else {
				redoButton.removeClass(['disabled']);
			}
			return e.target.nextSibling.value = html;
		}, false);

		textarea.listen('input', function (e) {
			return e.target.dispatchEvent(update);
		}, false);

	});

}
