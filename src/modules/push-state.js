/**
 * Handles adding and removing state
 * @param   {Array}    state      the state timeline
 * @param   {Number}   stateIndex the current state index
 * @param   {Function} fn         a function to call
 * @returns {Object}   the new timeline
 */
export default function (state, stateIndex, fn) {
  state = state.slice(0, stateIndex + 1); // eslint-disable-line no-param-reassign
  const newVersion = fn();
  state.push(newVersion);
  stateIndex += 1; // eslint-disable-line no-param-reassign
  if (stateIndex > 999) {
    state.shift();
    stateIndex -= 1; // eslint-disable-line no-param-reassign
  }

  return { state, index: stateIndex };
}
