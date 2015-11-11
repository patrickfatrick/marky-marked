'use strict';

/**
 * Marky Mark
 * Author: Patrick Fricano
 * https://www.github.com/patrickfatrick/marky-mark
 */

import prototypes from './prototypes';
import mark from './mark';
import * as dispatcher from './dispatcher';
import {update, markychange} from './custom-events';
import {inlineHandler, blockHandler, insertHandler, listHandler} from './handlers';

prototypes();

export class Marky {
	constructor (editor) {
		this.mark = mark;
		this.state = [{markdown: '', html: ''}];
		this.index = 0;
		this.editor = editor;
	}

	update (markdown, state = this.state, index = this.index) {
		const action = dispatcher.update(markdown, state, index);
		this.state = action.state;
		this.index = action.index;
	}

	undo (num = 5, state = this.state, index = this.index, editor = this.editor) {
		if (index === 0) return state[0];

		const action = dispatcher.undo(num, state, index);
		this.index = action.index;
		editor.value = action.state.markdown;
		editor.nextSibling.value = action.state.html;
		editor.dispatchEvent(markychange);
		return this.index;
	}

	redo (num = 5, state = this.state, index = this.index, editor = this.editor) {
		if (index === state.length - 1) return state[state.length - 1];

		const action = dispatcher.redo(num, state, index);
		this.index = action.index;
		editor.value = action.state.markdown;
		editor.nextSibling.value = action.state.html;
		editor.dispatchEvent(markychange);
		return this.index;
	}

	setSelection (arr = [0, 0], editor = this.editor) {
		editor.setSelectionRange(arr[0], arr[1]);
		return arr;
	}

	expandSelectionForward (num = 0, editor = this.editor) {
		const start = editor.selectionStart;
		const end = editor.selectionEnd + num;

		editor.setSelectionRange(start, end);
		return [start, end];
	}

	expandSelectionBackward (num = 0, editor = this.editor) {
		const start = editor.selectionStart - num;
		const end = editor.selectionEnd;

		editor.setSelectionRange(start, end);
		return [start, end];
	}

	moveCursorBackward (num = 0, editor = this.editor) {
		const start = editor.selectionStart - num;

		editor.setSelectionRange(start, start);
		return start;
	}

	moveCursorForward (num = 0, editor = this.editor) {
		const start = editor.selectionStart + num;

		editor.setSelectionRange(start, start);
		return start;
	}

	bold (indices, editor = this.editor) {
		indices = indices || [editor.selectionStart, editor.selectionEnd];
		let boldify = inlineHandler(editor.value, indices, '**');
		editor.value = boldify.value;
		editor.setSelectionRange(boldify.range[0], boldify.range[1]);
		editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
		let html = editor._marky.state[editor._marky.index].html;
		editor.nextSibling.value = html;
		editor.dispatchEvent(update);
		return [boldify.range[0], boldify.range[1]];
	}

	italic (indices, editor = this.editor) {
		indices = indices || [editor.selectionStart, editor.selectionEnd];
		let italicize = inlineHandler(editor.value, indices, '_');
		editor.value = italicize.value;
		editor.setSelectionRange(italicize.range[0], italicize.range[1]);
		editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
		let html = editor._marky.state[editor._marky.index].html;
		editor.nextSibling.value = html;
		editor.dispatchEvent(update);
		return [italicize.range[0], italicize.range[1]];
	}

	strikethrough (indices, editor = this.editor) {
		indices = indices || [editor.selectionStart, editor.selectionEnd];
		let strikitize = inlineHandler(editor.value, indices, '~~');
		editor.value = strikitize.value;
		editor.setSelectionRange(strikitize.range[0], strikitize.range[1]);
		editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
		let html = editor._marky.state[editor._marky.index].html;
		editor.nextSibling.value = html;
		editor.dispatchEvent(update);
		return [strikitize.range[0], strikitize.range[1]];
	}

	code (indices, editor = this.editor) {
		indices = indices || [editor.selectionStart, editor.selectionEnd];
		let codify = inlineHandler(editor.value, indices, '`');
		editor.value = codify.value;
		editor.setSelectionRange(codify.range[0], codify.range[1]);
		editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
		let html = editor._marky.state[editor._marky.index].html;
		editor.nextSibling.value = html;
		editor.dispatchEvent(update);
		return [codify.range[0], codify.range[1]];
	}

	blockquote (indices, editor = this.editor) {
		indices = indices || [editor.selectionStart, editor.selectionEnd];
		let quotify = blockHandler(editor.value, indices, '> ');
		editor.value = quotify.value;
		editor.setSelectionRange(quotify.range[0], quotify.range[1]);
		editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
		let html = editor._marky.state[editor._marky.index].html;
		editor.nextSibling.value = html;
		editor.dispatchEvent(update);
		return [quotify.range[0], quotify.range[1]];
	}

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
		editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
		let html = editor._marky.state[editor._marky.index].html;
		editor.nextSibling.value = html;
		editor.dispatchEvent(update);
		return [headingify.range[0], headingify.range[1]];
	}

	link (indices, editor = this.editor) {
		indices = indices || [editor.selectionStart, editor.selectionEnd];
		const mark = '[DISPLAY TEXT](http://url.com)';
		let linkify = insertHandler(editor.value, indices, mark);
		editor.value = linkify.value;
		editor.setSelectionRange(linkify.range[0], linkify.range[1]);
		editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
		let html = editor._marky.state[editor._marky.index].html;
		editor.nextSibling.value = html;
		editor.dispatchEvent(update);
		return [linkify.range[0], linkify.range[1]];
	}

	image (indices, editor = this.editor) {
		indices = indices || [editor.selectionStart, editor.selectionEnd];
		const mark = '![ALT TEXT](http://imagesource.com/image.jpg)';
		let imageify = insertHandler(editor.value, indices, mark);
		editor.value = imageify.value;
		editor.setSelectionRange(imageify.range[0], imageify.range[1]);
		editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
		let html = editor._marky.state[editor._marky.index].html;
		editor.nextSibling.value = html;
		editor.dispatchEvent(update);
		return [imageify.range[0], imageify.range[1]];
	}

	unorderedList (indices, editor = this.editor) {
		indices = indices || [editor.selectionStart, editor.selectionEnd];
		let listify = listHandler(editor.value, indices, 'ul');
		editor.value = listify.value;
		editor.setSelectionRange(listify.range[0], listify.range[1]);
		editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
		let html = editor._marky.state[editor._marky.index].html;
		editor.nextSibling.value = html;
		editor.dispatchEvent(update);
		return [listify.range[0], listify.range[1]];
	}

	orderedList (indices, editor = this.editor) {
		indices = indices || [editor.selectionStart, editor.selectionEnd];
		let listify = listHandler(editor.value, indices, 'ol');
		editor.value = listify.value;
		editor.setSelectionRange(listify.range[0], listify.range[1]);
		editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
		let html = editor._marky.state[editor._marky.index].html;
		editor.nextSibling.value = html;
		editor.dispatchEvent(update);
		return [listify.range[0], listify.range[1]];
	}

}
