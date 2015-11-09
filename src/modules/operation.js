export default function (state, stateIndex, fn) {
	state = state.slice(0, stateIndex + 1);
	//console.log(state);
	//let newVersion = fn(state[stateIndex]);
	let newVersion = fn();
	//console.log(state);
	state.push(newVersion);
	//console.log(state);
	stateIndex++;
	if (stateIndex > 499) {
		state.shift();
		stateIndex--;
	}
	return {state: state, index: stateIndex};
}
