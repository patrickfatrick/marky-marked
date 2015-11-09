'use strict';

/**
 * Marky Mark
 * Author: Patrick Fricano
 * https://www.github.com/patrickfatrick/marky-mark
 */

import prototypes from './modules/prototypes';
import mark from './modules/mark';
import * as dispatcher from './modules/dispatcher';
import {markychange} from './modules/custom-events';

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

}
