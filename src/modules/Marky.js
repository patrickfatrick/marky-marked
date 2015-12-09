'use strict';

/**
 * Marky Mark
 * Author: Patrick Fricano
 * https://www.github.com/patrickfatrick/marky-marked
 */

import prototypes from './prototypes';
import mark from './mark';
import * as dispatcher from './dispatcher';
import {update, markychange} from './custom-events';
import {inlineHandler, blockHandler, insertHandler, listHandler, indentHandler} from './handlers';

prototypes();

export class Marky {
	constructor (editor) {
		this.mark = mark;
		this.state = [{markdown: '', html: '', selection: [0, 0]}];
		this.index = 0;
		this.editor = editor;
	}

	/**
	 * Handles updating the state on forward-progress changes
	 * @requires dispatcher/update
	 * @param {String} markdown the new markdown blob
	 * @param {Array}  state    the state timeline
	 * @param {Number} index    current state index
	 */
	update (markdown, selection = [0, 0], state = this.state, index = this.index) {
		markdown = markdown.replace(/\</g, '&lt;');
		const action = dispatcher.update(markdown, selection, state, index);
		this.state = action.state;
		this.index = action.index;
	}

	/**
	 * Handles moving backward in state
	 * @requires dispatcher/undo
	 * @param   {Number}      num    number of states to move back
	 * @param   {Array}       state  the state timeline
	 * @param   {Number}      index  current state index
	 * @param   {HTMLElement} editor the marky marked editor
	 * @returns {Number}      the new index
	 */
	undo (num = 5, state = this.state, index = this.index, editor = this.editor) {
		if (index === 0) return index;

		const action = dispatcher.undo(num, state, index);
		this.index = action.index;
		editor.value = action.state.markdown;
		editor.setSelectionRange(action.state.selection[0], action.state.selection[1]);
		editor.nextSibling.value = action.state.html;
		editor.dispatchEvent(markychange);
		return this.index;
	}

	/**
	 * Handles moving forward in state
	 * @requires dispatcher/redo
	 * @param   {Number}      num    number of states to move back
	 * @param   {Array}       state  the state timeline
	 * @param   {Number}      index  current state index
	 * @param   {HTMLElement} editor the marky marked editor
	 * @returns {Number}      the new index
	 */
	redo (num = 5, state = this.state, index = this.index, editor = this.editor) {
		if (index === state.length - 1) return index;

		const action = dispatcher.redo(num, state, index);
		this.index = action.index;
		editor.value = action.state.markdown;
		editor.setSelectionRange(action.state.selection[0], action.state.selection[1]);
		editor.nextSibling.value = action.state.html;
		editor.dispatchEvent(markychange);
		return this.index;
	}

	/**
	 * Setsa the selection indices in the editor
	 * @param   {Array}       arr    starting and ending indices
	 * @param   {HTMLElement} editor the marky marked editor
	 * @returns {Array}       the array that was passed in
	 */
	setSelection (arr = [0, 0], editor = this.editor) {
		editor.setSelectionRange(arr[0], arr[1]);
		return arr;
	}

	/**
	 * expands the selection to the right
	 * @param   {Number}      num    number of characters to expand by
	 * @param   {HTMLElement} editor the marky marked editor
	 * @returns {Array}       the new selection indices
	 */
	expandSelectionForward (num = 0, editor = this.editor) {
		const start = editor.selectionStart;
		const end = editor.selectionEnd + num;

		editor.setSelectionRange(start, end);
		return [start, end];
	}

	/**
	 * expands the selection to the left
	 * @param   {Number}      num    number of characters to expand by
	 * @param   {HTMLElement} editor the marky marked editor
	 * @returns {Array}       the new selection indices
	 */
	expandSelectionBackward (num = 0, editor = this.editor) {
		const start = editor.selectionStart - num;
		const end = editor.selectionEnd;

		editor.setSelectionRange(start, end);
		return [start, end];
	}

	/**
	 * expands the cursor to the right
	 * @param   {Number}      num    number of characters to move by
	 * @param   {HTMLElement} editor the marky marked editor
	 * @returns {Array}       the new cursor position
	 */
	moveCursorBackward (num = 0, editor = this.editor) {
		const start = editor.selectionStart - num;

		editor.setSelectionRange(start, start);
		return start;
	}

	/**
	 * expands the cursor to the left
	 * @param   {Number}      num    number of characters to move by
	 * @param   {HTMLElement} editor the marky marked editor
	 * @returns {Array}       the new cursor position
	 */
	moveCursorForward (num = 0, editor = this.editor) {
		const start = editor.selectionStart + num;

		editor.setSelectionRange(start, start);
		return start;
	}

	/**
	 * implements a bold on a selection
	 * @requires handlers/inlineHandler
	 * @param   {Array}       indices starting and ending positions for the selection
	 * @param   {HTMLElement} editor  the marky marked editor
	 * @returns {Array}       the new selection after the bold
	 */
	bold (indices, editor = this.editor) {
		indices = indices || [editor.selectionStart, editor.selectionEnd];
		let boldify = inlineHandler(editor.value, indices, '**');
		editor.value = boldify.value;
		editor.setSelectionRange(boldify.range[0], boldify.range[1]);
		editor._marky.update(editor.value, [boldify.range[0], boldify.range[1]], editor._marky.state, editor._marky.index);
		let html = editor._marky.state[editor._marky.index].html;
		editor.nextSibling.value = html;
		editor.dispatchEvent(update);
		return [boldify.range[0], boldify.range[1]];
	}

	/**
	 * implements an italic on a selection
	 * @requires handlers/inlineHandler
	 * @param   {Array}       indices starting and ending positions for the selection
	 * @param   {HTMLElement} editor  the marky marked editor
	 * @returns {Array}       the new selection after the italic
	 */
	italic (indices, editor = this.editor) {
		indices = indices || [editor.selectionStart, editor.selectionEnd];
		let italicize = inlineHandler(editor.value, indices, '_');
		editor.value = italicize.value;
		editor.setSelectionRange(italicize.range[0], italicize.range[1]);
		editor._marky.update(editor.value, [italicize.range[0], italicize.range[1]], editor._marky.state, editor._marky.index);
		let html = editor._marky.state[editor._marky.index].html;
		editor.nextSibling.value = html;
		editor.dispatchEvent(update);
		return [italicize.range[0], italicize.range[1]];
	}

	/**
	 * implements a strikethrough on a selection
	 * @requires handlers/inlineHandler
	 * @param   {Array}       indices starting and ending positions for the selection
	 * @param   {HTMLElement} editor  the marky marked editor
	 * @returns {Array}       the new selection after the strikethrough
	 */
	strikethrough (indices, editor = this.editor) {
		indices = indices || [editor.selectionStart, editor.selectionEnd];
		let strikitize = inlineHandler(editor.value, indices, '~~');
		editor.value = strikitize.value;
		editor.setSelectionRange(strikitize.range[0], strikitize.range[1]);
		editor._marky.update(editor.value, [strikitize.range[0], strikitize.range[1]], editor._marky.state, editor._marky.index);
		let html = editor._marky.state[editor._marky.index].html;
		editor.nextSibling.value = html;
		editor.dispatchEvent(update);
		return [strikitize.range[0], strikitize.range[1]];
	}

	/**
	 * implements a code on a selection
	 * @requires handlers/inlineHandler
	 * @param   {Array}       indices starting and ending positions for the selection
	 * @param   {HTMLElement} editor  the marky marked editor
	 * @returns {Array}       the new selection after the code
	 */
	code (indices, editor = this.editor) {
		indices = indices || [editor.selectionStart, editor.selectionEnd];
		let codify = inlineHandler(editor.value, indices, '`');
		editor.value = codify.value;
		editor.setSelectionRange(codify.range[0], codify.range[1]);
		editor._marky.update(editor.value, [codify.range[0], codify.range[1]], editor._marky.state, editor._marky.index);
		let html = editor._marky.state[editor._marky.index].html;
		editor.nextSibling.value = html;
		editor.dispatchEvent(update);
		return [codify.range[0], codify.range[1]];
	}

	/**
	 * implements a blockquote on a selection
	 * @requires handlers/blockHandler
	 * @param   {Array}       indices starting and ending positions for the selection
	 * @param   {HTMLElement} editor  the marky marked editor
	 * @returns {Array}       the new selection after the bold
	 */
	blockquote (indices, editor = this.editor) {
		indices = indices || [editor.selectionStart, editor.selectionEnd];
		let quotify = blockHandler(editor.value, indices, '> ');
		editor.value = quotify.value;
		editor.setSelectionRange(quotify.range[0], quotify.range[1]);
		editor._marky.update(editor.value, [quotify.range[0], quotify.range[1]], editor._marky.state, editor._marky.index);
		let html = editor._marky.state[editor._marky.index].html;
		editor.nextSibling.value = html;
		editor.dispatchEvent(update);
		return [quotify.range[0], quotify.range[1]];
	}

	/**
	 * implements a heading on a selection
	 * @requires handlers/blockHandler
	 * @param   {Array}       indices starting and ending positions for the selection
	 * @param   {HTMLElement} editor  the marky marked editor
	 * @returns {Array}       the new selection after the heading
	 */
	heading (value = 0, indices, editor = this.editor) {
		indices = indices || [editor.selectionStart, editor.selectionEnd];
		let markArr = [];
		let mark;
		for (let i = 1; i <= value; i++) {
			markArr.push('#');
		}
		mark = markArr.join('');
		let space = mark ? ' ' : '';
		let headingify = blockHandler(editor.value, indices, mark + space);
		editor.value = headingify.value;
		editor.setSelectionRange(headingify.range[0], headingify.range[1]);
		editor._marky.update(editor.value, [headingify.range[0], headingify.range[1]], editor._marky.state, editor._marky.index);
		let html = editor._marky.state[editor._marky.index].html;
		editor.nextSibling.value = html;
		editor.dispatchEvent(update);
		return [headingify.range[0], headingify.range[1]];
	}

	/**
	 * inserts a link snippet at the end of a selection
	 * @requires handlers/insertHandler
	 * @param   {Array}       indices starting and ending positions for the selection
	 * @param   {HTMLElement} editor  the marky marked editor
	 * @returns {Array}       the new selection after the snippet is inserted
	 */
	link (indices, url = 'http://url.com', display = 'http://url.com', editor = this.editor) {
		indices = indices || [editor.selectionStart, editor.selectionEnd];
		const mark = '[' + display + '](' + url + ')';
		let linkify = insertHandler(editor.value, indices, mark);
		editor.value = linkify.value;
		editor.setSelectionRange(linkify.range[0], linkify.range[1]);
		editor._marky.update(editor.value, [linkify.range[0], linkify.range[1]], editor._marky.state, editor._marky.index);
		let html = editor._marky.state[editor._marky.index].html;
		editor.nextSibling.value = html;
		editor.dispatchEvent(update);
		return [linkify.range[0], linkify.range[1]];
	}

	/**
	 * inserts an image snippet at the end of a selection
	 * @requires handlers/insertHandler
	 * @param   {Array}       indices starting and ending positions for the selection
	 * @param   {HTMLElement} editor  the marky marked editor
	 * @returns {Array}       the new selection after the snippet is inserted
	 */
	image (indices, source = 'http://imagesource.com/image.jpg', alt = 'http://imagesource.com/image.jpg', editor = this.editor) {
		indices = indices || [editor.selectionStart, editor.selectionEnd];
		const mark = '![' + alt + '](' + source + ')';
		let imageify = insertHandler(editor.value, indices, mark);
		editor.value = imageify.value;
		editor.setSelectionRange(imageify.range[0], imageify.range[1]);
		editor._marky.update(editor.value, [imageify.range[0], imageify.range[1]], editor._marky.state, editor._marky.index);
		let html = editor._marky.state[editor._marky.index].html;
		editor.nextSibling.value = html;
		editor.dispatchEvent(update);
		return [imageify.range[0], imageify.range[1]];
	}

	/**
	 * implements an unordered list on a selection
	 * @requires handlers/listHandler
	 * @param   {Array}       indices starting and ending positions for the selection
	 * @param   {HTMLElement} editor  the marky marked editor
	 * @returns {Array}       the new selection after the list is implemented
	 */
	unorderedList (indices, editor = this.editor) {
		indices = indices || [editor.selectionStart, editor.selectionEnd];
		let listify = listHandler(editor.value, indices, 'ul');
		editor.value = listify.value;
		editor.setSelectionRange(listify.range[0], listify.range[1]);
		editor._marky.update(editor.value, [listify.range[0], listify.range[1]], editor._marky.state, editor._marky.index);
		let html = editor._marky.state[editor._marky.index].html;
		editor.nextSibling.value = html;
		editor.dispatchEvent(update);
		return [listify.range[0], listify.range[1]];
	}

	/**
	 * implements an ordered list on a selection
	 * @requires handlers/listHandler
	 * @param   {Array}       indices starting and ending positions for the selection
	 * @param   {HTMLElement} editor  the marky marked editor
	 * @returns {Array}       the new selection after the list is implemented
	 */
	orderedList (indices, editor = this.editor) {
		indices = indices || [editor.selectionStart, editor.selectionEnd];
		let listify = listHandler(editor.value, indices, 'ol');
		editor.value = listify.value;
		editor.setSelectionRange(listify.range[0], listify.range[1]);
		editor._marky.update(editor.value, [listify.range[0], listify.range[1]], editor._marky.state, editor._marky.index);
		let html = editor._marky.state[editor._marky.index].html;
		editor.nextSibling.value = html;
		editor.dispatchEvent(update);
		return [listify.range[0], listify.range[1]];
	}

	/**
	 * implements an indent on a selection
	 * @requires handlers/indentHandler
	 * @param   {Array}       indices starting and ending positions for the selection
	 * @param   {HTMLElement} editor  the marky marked editor
	 * @returns {Array}       the new selection after the indent is implemented
	 */
	indent (indices, editor = this.editor) {
		indices = indices || [editor.selectionStart, editor.selectionEnd];
		let indentify = indentHandler(editor.value, indices, 'in');
		editor.value = indentify.value;
		editor.setSelectionRange(indentify.range[0], indentify.range[1]);
		editor._marky.update(editor.value, [indentify.range[0], indentify.range[1]], editor._marky.state, editor._marky.index);
		let html = editor._marky.state[editor._marky.index].html;
		editor.nextSibling.value = html;
		editor.dispatchEvent(update);
		return [indentify.range[0], indentify.range[1]];
	}

	/**
	 * implements an outdent on a selection
	 * @requires handlers/indentHandler
	 * @param   {Array}       indices starting and ending positions for the selection
	 * @param   {HTMLElement} editor  the marky marked editor
	 * @returns {Array}       the new selection after the outdent is implemented
	 */
	outdent (indices, editor = this.editor) {
		indices = indices || [editor.selectionStart, editor.selectionEnd];
		let indentify = indentHandler(editor.value, indices, 'out');
		editor.value = indentify.value;
		editor.setSelectionRange(indentify.range[0], indentify.range[1]);
		editor._marky.update(editor.value, [indentify.range[0], indentify.range[1]], editor._marky.state, editor._marky.index);
		let html = editor._marky.state[editor._marky.index].html;
		editor.nextSibling.value = html;
		editor.dispatchEvent(update);
		return [indentify.range[0], indentify.range[1]];
	}

}
