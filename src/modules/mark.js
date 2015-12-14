import {Marky} from './Marky';
import {Element} from './Element';
import {HeadingButton, BoldButton, ItalicButton, StrikethroughButton, CodeButton, BlockquoteButton, LinkButton, ImageButton, UnorderedListButton, OrderedListButton, IndentButton, OutdentButton, UndoButton, RedoButton} from './Buttons';
import {LinkDialog, ImageDialog, HeadingDialog} from './Dialogs';
import {markyblur, markyfocus, markyselect, markyupdate, markychange} from './custom-events';

/**
 * Register and append the DOM elements needed and set the event listeners
 * @param 	{String}	tag name to be used for initialization
 */
export default function (tag = 'marky-mark') {

	let containers = document.getElementsByTagName(tag);
	Array.prototype.forEach.call(containers, (container, i) => {
		if (container.children.length) return;
		let toolbar = new Element('div', 'Toolbar');
		let id = 'editor-' + i;
		container.id = id;
		toolbar.addClass(['marky-toolbar', id]);

		let dialogs = new Element('div', 'Dialogs');
		dialogs.addClass(['marky-dialogs', id]);

		let textarea = new Element('textarea', 'Marky Marked Editor');
		textarea.addClass(['marky-editor', id]);
		textarea.assign('_marky', new Marky(textarea.element));

		let input = new Element('input', 'Marky Marked Output');
		input.assign('type', 'hidden');
		input.addClass(['marky-output', id]);

		let headingDialog = new HeadingDialog('div', 'Heading Dialog', id, textarea);
		headingDialog.element.style.visibility = 'hidden';

		let linkDialog = new LinkDialog('div', 'Link Dialog', id, textarea);
		linkDialog.element.style.visibility = 'hidden';

		let imageDialog = new ImageDialog('div', 'Image Dialog', id, textarea);
		imageDialog.element.style.visibility = 'hidden';

		let headingButton = new HeadingButton('button', 'Heading', id, headingDialog);
		headingButton.listen('click', function () {
			imageDialog.element.style.visibility = 'hidden';
			imageDialog.removeClass(['toggled']);
			linkDialog.element.style.visibility = 'hidden';
			linkDialog.removeClass(['toggled']);
		});
		let boldButton = new BoldButton('button', 'Bold', id, textarea);
		let italicButton = new ItalicButton('button', 'Italic', id, textarea);
		let strikethroughButton = new StrikethroughButton('button', 'Strikethrough', id, textarea);
		let codeButton = new CodeButton('button', 'Code', id, textarea);
		let blockquoteButton = new BlockquoteButton('button', 'Blockquote', id, textarea);
		let linkButton = new LinkButton('button', 'Link', id, linkDialog);
		linkButton.listen('click', function () {
			imageDialog.element.style.visibility = 'hidden';
			imageDialog.removeClass(['toggled']);
			headingDialog.element.style.visibility = 'hidden';
			headingDialog.removeClass(['toggled']);
		});
		let imageButton = new ImageButton('button', 'Image', id, imageDialog);
		imageButton.listen('click', function () {
			linkDialog.element.style.visibility = 'hidden';
			linkDialog.removeClass(['toggled']);
			headingDialog.element.style.visibility = 'hidden';
			headingDialog.removeClass(['toggled']);
		});
		let unorderedListButton = new UnorderedListButton('button', 'Unordered List', id, textarea);
		let orderedListButton = new OrderedListButton('button', 'Ordered List', id, textarea);
		let outdentButton = new OutdentButton('button', 'Outdent', id, textarea);
		let indentButton = new IndentButton('button', 'Indent', id, textarea);
		let undoButton = new UndoButton('button', 'Undo', id, textarea);
		let redoButton = new RedoButton('button', 'Redo', id, textarea);

		let separatorA = new Element('span');
		separatorA.addClass(['separator']);

		let separatorB = new Element('span');
		separatorB.addClass(['separator']);

		let separatorC = new Element('span');
		separatorC.addClass(['separator']);

		let separatorD = new Element('span');
		separatorD.addClass(['separator']);

		toolbar.appendTo(container);
		textarea.appendTo(container);
		input.appendTo(container);
		headingButton.appendTo(toolbar.element);
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
		outdentButton.appendTo(toolbar.element);
		indentButton.appendTo(toolbar.element);
		separatorD.appendTo(toolbar.element);
		undoButton.appendTo(toolbar.element);
		redoButton.appendTo(toolbar.element);
		dialogs.appendTo(toolbar.element);
		linkDialog.appendTo(dialogs.element);
		imageDialog.appendTo(dialogs.element);
		headingDialog.appendTo(dialogs.element);

		textarea.listen('markyupdate', function (e) {
			this._marky.update(e.target.value, [e.target.selectionStart, e.target.selectionEnd], this._marky.state, this._marky.index);
			return e.target.dispatchEvent(markychange);
		}, false);

		textarea.listen('markychange', function (e) {
			let html = this._marky.state[this._marky.index].html;
			if (this._marky.index === 0)  {
				undoButton.addClass(['disabled']);
			} else {
				undoButton.removeClass(['disabled']);
			}
			if (this._marky.index === this._marky.state.length - 1) {
				redoButton.addClass(['disabled']);
			} else {
				redoButton.removeClass(['disabled']);
			}
			return e.target.nextSibling.value = html;
		}, false);

		textarea.listen('input', function (e) {
			return e.target.dispatchEvent(markyupdate);
		}, false);

		textarea.listen('select', function (e) {
			return e.target.dispatchEvent(markyselect);
		});

		textarea.listen('blur', function (e) {
			return e.target.dispatchEvent(markyblur);
		});

		textarea.listen('focus', function (e) {
			return e.target.dispatchEvent(markyfocus);
		});
		
		textarea.listen('click', function () {
			imageDialog.element.style.visibility = 'hidden';
			imageDialog.removeClass(['toggled']);
			linkDialog.element.style.visibility = 'hidden';
			linkDialog.removeClass(['toggled']);
			headingDialog.element.style.visibility = 'hidden';
			headingDialog.removeClass(['toggled']);
			return;
		});

	});
}
