'use strict';

/**
 * Marky Mark
 * Author: Patrick Fricano
 * https://www.github.com/patrickfatrick/marky-mark
 */

import {Map} from 'immutable';
import prototypes from './modules/prototypes';
import polyfills from './modules/polyfills';
import mark from './modules/mark';
import * as dispatcher from './modules/dispatcher';

prototypes();
polyfills();

export class Marky {
	constructor () {
		this.mark = mark;
		this.state = [Map({markdown: '', html: ''})],
		this.index = 0;
	}

	update(markdown, state, index) {
		const action = dispatcher.update(markdown, state, index);
		this.state = action.state;
		this.index = action.index;
	}

	undo(state, index) {
		if (this.index < 5) return this.state;

		const action = dispatcher.undo(state, index);
		this.state = action.state;
		this.index = this.index - 5;
	}

	redo(state, index) {
		if (this.index > this.state.length - 6) return this.state;

		const action = dispatcher.undo(state, index);
		this.state = action.state;
		this.index = this.index + 5;
	}
}
