import marked from 'marked';
import operation from './operation';

export function update (markdown, state, stateIndex) {
	let html = marked(markdown).toString() || '';
	//console.log(state);
	let newState = operation(state, stateIndex, () => {
		//console.log(data);
		return {markdown: markdown, html: html};
		//return data.set('markdown', markdown).set('html', html);
	});
	return newState;
}

export function undo (state, stateIndex) {
	stateIndex = (stateIndex > 4) ? stateIndex - 5 : 0;
	return {state: state[stateIndex], index: stateIndex};
}

export function redo (state, stateIndex) {
	stateIndex = (stateIndex < state.length - 6) ? stateIndex + 5 : state.length - 1;
	return {state: state[stateIndex], index: stateIndex};
}
