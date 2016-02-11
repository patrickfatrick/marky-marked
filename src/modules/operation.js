'use strict';

/**
 * Handles adding and removing state
 * @param   {Array}    state      the state timeline
 * @param   {Number}   stateIndex the current state index
 * @param   {Function} fn         a function to call
 * @returns {Object}   the new timeline
 */
export default function (state, stateIndex, fn) {
	state = state.slice(0, stateIndex + 1);
	let newVersion = fn();
	state.push(newVersion);
	stateIndex++;
	if (stateIndex > 999) {
		state.shift();
		stateIndex--;
	}
	return {state: state, index: stateIndex};
}
