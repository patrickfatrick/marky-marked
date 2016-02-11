'use strict';

import {Marky} from './Marky';
import {Element} from './Element';
import {HeadingButton, BoldButton, ItalicButton, StrikethroughButton, CodeButton, BlockquoteButton, LinkButton, ImageButton, UnorderedListButton, OrderedListButton, IndentButton, OutdentButton, UndoButton, RedoButton, FullscreenButton} from './Buttons';
import {LinkDialog, ImageDialog, HeadingDialog} from './Dialogs';
import {markyblur, markyfocus, markyselect, markyupdate, markychange} from './custom-events';

let timeoutID; //Used later for input events

/**
 * Register and append the DOM elements needed and set the event listeners
 * @param 	{String}	tag name to be used for initialization
 */
export default function (tag = 'marky-mark') {
	let containers = document.getElementsByTagName(tag);
	return Array.prototype.forEach.call(containers, (container, i) => {
		if (container.children.length) return;
		let toolbar = new Element('div', 'Toolbar');
		let id = 'marky-mark-' + i;
		container.id = id;
		toolbar.addClass(['marky-toolbar', id]);

		let dialogs = new Element('div', 'Dialogs');
		dialogs.addClass(['marky-dialogs', id]);

		let markyEditor = new Element('textarea', 'Marky Marked Editor');
		markyEditor.addClass(['marky-editor', id]);
		markyEditor.assign('_marky', new Marky(markyEditor.element));

		let markyOutput = new Element('input', 'Marky Marked Output');
		markyOutput.assign('type', 'hidden');
		markyOutput.addClass(['marky-output', id]);

		let headingDialog = new HeadingDialog('div', 'Heading Dialog', id, markyEditor);
		headingDialog.element.style.visibility = 'hidden';

		let linkDialog = new LinkDialog('div', 'Link Dialog', id, markyEditor);
		linkDialog.element.style.visibility = 'hidden';

		let imageDialog = new ImageDialog('div', 'Image Dialog', id, markyEditor);
		imageDialog.element.style.visibility = 'hidden';

		let headingButton = new HeadingButton('button', 'Heading', id, headingDialog);
		headingButton.listen('click', function () {
			imageDialog.element.style.visibility = 'hidden';
			imageDialog.removeClass(['toggled']);
			linkDialog.element.style.visibility = 'hidden';
			linkDialog.removeClass(['toggled']);
		});
		let boldButton = new BoldButton('button', 'Bold', id, markyEditor);
		let italicButton = new ItalicButton('button', 'Italic', id, markyEditor);
		let strikethroughButton = new StrikethroughButton('button', 'Strikethrough', id, markyEditor);
		let codeButton = new CodeButton('button', 'Code', id, markyEditor);
		let blockquoteButton = new BlockquoteButton('button', 'Blockquote', id, markyEditor);
		let linkButton = new LinkButton('button', 'Link', id, [linkDialog, markyEditor]);
		linkButton.listen('click', function () {
			imageDialog.element.style.visibility = 'hidden';
			imageDialog.removeClass(['toggled']);
			headingDialog.element.style.visibility = 'hidden';
			headingDialog.removeClass(['toggled']);
		});
		let imageButton = new ImageButton('button', 'Image', id, [imageDialog, markyEditor]);
		imageButton.listen('click', function () {
			linkDialog.element.style.visibility = 'hidden';
			linkDialog.removeClass(['toggled']);
			headingDialog.element.style.visibility = 'hidden';
			headingDialog.removeClass(['toggled']);
		});
		let unorderedListButton = new UnorderedListButton('button', 'Unordered List', id, markyEditor);
		let orderedListButton = new OrderedListButton('button', 'Ordered List', id, markyEditor);
		let outdentButton = new OutdentButton('button', 'Outdent', id, markyEditor);
		let indentButton = new IndentButton('button', 'Indent', id, markyEditor);
		let undoButton = new UndoButton('button', 'Undo', id, markyEditor);
		let redoButton = new RedoButton('button', 'Redo', id, markyEditor);
		let fullscreenButton = new FullscreenButton('button', 'Fullscreen', id, [container, markyEditor]);

		let separatorA = new Element('span');
		separatorA.addClass(['separator']);

		let separatorB = new Element('span');
		separatorB.addClass(['separator']);

		let separatorC = new Element('span');
		separatorC.addClass(['separator']);

		let separatorD = new Element('span');
		separatorD.addClass(['separator']);

		let separatorE = new Element('span');
		separatorE.addClass(['separator']);

		toolbar.appendTo(container);
		markyEditor.appendTo(container);
		markyOutput.appendTo(container);
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
		separatorE.appendTo(toolbar.element);
		fullscreenButton.appendTo(toolbar.element);
		dialogs.appendTo(toolbar.element);
		linkDialog.appendTo(dialogs.element);
		imageDialog.appendTo(dialogs.element);
		headingDialog.appendTo(dialogs.element);

		markyEditor.listen('markyupdate', function (e) {
			this._marky.update(e.target.value, [e.target.selectionStart, e.target.selectionEnd], this._marky.state, this._marky.index);
			return e.target.dispatchEvent(markychange);
		}, false);

		markyEditor.listen('markychange', function (e) {
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


		/**
		 * Listen for input events, set timeout to update state, clear timeout from previous input
		 */
		markyEditor.listen('input', function (e) {
			window.clearTimeout(timeoutID);
			timeoutID = window.setTimeout(() => {
				return e.target.dispatchEvent(markyupdate);
			}, 1000);
		}, false);

		/**
		 * Listen for change events (requires loss of focus) and update state
		 */
		markyEditor.listen('change', function (e) {
			return e.target.dispatchEvent(markyupdate);
		}, false);

		/**
		 * Listen for pasting into the editor and update state
		 */
		markyEditor.listen('paste', function (e) {
			setTimeout(() => {
				return e.target.dispatchEvent(markyupdate);
			}, 0);
		}, false);

		/**
		 * Listen for cutting from the editor and update state
		 */
		markyEditor.listen('cut', function (e) {
			setTimeout(() => {
				return e.target.dispatchEvent(markyupdate);
			}, 0);
		}, false);

		let deleteSelection = 0;

		/**
		 * Listen for keydown events, if key is delete key, set deleteSelection to length of selection
		 */
		markyEditor.listen('keydown', function (e) {
			if (e.which === 8) return deleteSelection = e.target.selectionEnd - e.target.selectionStart;
		});

		let keyMap = []; // Used for determining whether or not to update state on space keyup
		let punctuations = [
			46, // period
			44, // comma
			63, // question mark
			33, // exclamation point
			58, // colon
			59, // semi-colon
			47, // back slash
			92, // forward slash
			38, // ampersand
			124, // vertical pipe
			32 // space
		];

		/**
		 * Listen for keyup events, if key is space or punctuation 
		 * (but not a space following punctuation or another space), update state and clear input timeout.
		 */
		markyEditor.listen('keypress', function (e) {
			keyMap.push(e.which);
			if (keyMap.length > 2) keyMap.shift();
			punctuations.forEach(punctuation => {
				if (e.which === 32 && keyMap[0] === punctuation) {
					return window.clearTimeout(timeoutID);
				}
				if (e.which === punctuation) {
					window.clearTimeout(timeoutID);
					return e.target.dispatchEvent(markyupdate);
				}
			});
		});

		/**
		 * Listen for keyup events, if key is delete and it's a bulk selection, update state and clear input timeout.
		 */
		markyEditor.listen('keyup', function (e) {
			if (e.which === 8 && deleteSelection > 0) {
				window.clearTimeout(timeoutID);
				deleteSelection = 0;
				return e.target.dispatchEvent(markyupdate);
			}
		});

		markyEditor.listen('select', function (e) {
			return e.target.dispatchEvent(markyselect);
		});

		markyEditor.listen('blur', function (e) {
			return e.target.dispatchEvent(markyblur);
		});

		markyEditor.listen('focus', function (e) {
			return e.target.dispatchEvent(markyfocus);
		});
		
		markyEditor.listen('click', function () {
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
