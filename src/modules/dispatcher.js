import marked from 'marked';
import operation from './operation';

export function update (markdown, state, stateIndex) {
	let html = marked(markdown).toString() || '';
	let newState = operation(state, stateIndex, data => {
		return data.set('markdown', markdown).set('html', html);
	});
	return newState;
}

export function undo (state, stateIndex) {
	if (stateIndex > 4) stateIndex - 5;
	return state[stateIndex];
}

export function redo (state, stateIndex) {
	if (stateIndex < state.length - 6) stateIndex + 5;
	return state[stateIndex];
}
