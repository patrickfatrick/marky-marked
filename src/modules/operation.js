import {Map} from 'immutable';

export default function (state = [Map({markdown: '', html: ''})], stateIndex = 0, fn) {
	state = state.slice(0, stateIndex + 1);
	var newVersion = fn(state[stateIndex]);
	state.push(newVersion);
	stateIndex++;
	if (stateIndex > 499) {
		state.shift();
		stateIndex--;
	}
	return {state: state, index: stateIndex};
}
