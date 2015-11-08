'use strict';

/**
 * Marky Mark
 * Author: Patrick Fricano
 * https://www.github.com/patrickfatrick/marky-mark
 */

import {Map, List} from 'immutable';
import prototypes from './modules/prototypes';
import mark from './modules/mark';
import * as dispatcher from './modules/dispatcher';

prototypes();

export class Marky {
	constructor () {
		this.mark = mark;
		this.state = List([Map({markdown: '', html: ''})]),
		this.index = 0;
	}

	update(markdown, state = this.state, index = this.index) {
		const action = dispatcher.update(markdown, state, index);
		this.state = action.state;
		this.index = action.index;
	}

	undo(state, index) {
		if (index === 0) return state.get(0);

		const action = dispatcher.undo(state, index);
		this.index = action.index;
		return action.state;
	}

	redo(state, index) {
		if (index === state.size - 1) return state.get(state.size - 1);

		const action = dispatcher.redo(state, index);
		this.index = action.index;
		return action.state;
	}

	expandSelectionForward (num = 0, start, end) {
		return [start, end + num];
	}

	expandSelectionBackward (num = 0, start, end) {
		return [start - num, end];
	}

}
