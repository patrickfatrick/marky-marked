export default function (state, stateIndex, fn) {
	state = state.slice(0, stateIndex + 1);
	let newVersion = fn(state.get(stateIndex));
	state = state.push(newVersion);
	stateIndex++;
	if (stateIndex > 499) {
		state = state.shift();
		stateIndex--;
	}
	return {state: state, index: stateIndex};
}
