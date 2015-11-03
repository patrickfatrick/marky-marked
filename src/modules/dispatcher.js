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
	stateIndex = (stateIndex > 4) ? stateIndex - 5 : 0;
	return {state: state.get(stateIndex), index: stateIndex};
}

export function redo (state, stateIndex) {
	stateIndex = (stateIndex < state.size - 5) ? stateIndex + 5 : state.size - 1;
	return {state: state.get(stateIndex), index: stateIndex};
}
