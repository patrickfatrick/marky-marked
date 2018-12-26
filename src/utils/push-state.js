/**
 * Handles adding and removing state
 * @param   {Array}    state      the state timeline
 * @param   {Number}   stateIndex the current state index
 * @param   {Object}   newState   the new state to push
 * @returns {Object}   the new timeline
 */
export default function (state, stateIndex, newState) {
  state = state.slice(0, stateIndex + 1); // eslint-disable-line no-param-reassign
  state.push(newState);
  stateIndex += 1; // eslint-disable-line no-param-reassign
  if (stateIndex > 999) {
    state.shift();
    stateIndex -= 1; // eslint-disable-line no-param-reassign
  }

  return { state, index: stateIndex };
}
