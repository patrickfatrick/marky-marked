import marked from 'marked';
import pushState from './push-state';

/**
 * updates the state
 * @external marked
 * @requires pushState
 * @param   {String} markdown   markdown blob
 * @param   {Array}  state      the state timeline
 * @param   {Number} stateIndex the current state index
 * @returns {Object} the newly active state
 */
export function update(markdown, selection, state, stateIndex) {
  const markedOptions = {
    sanitize: true,
  };
  const html = marked(markdown, markedOptions).toString() || '';
  const newState = pushState(state, stateIndex, () => ({ markdown, html, selection }));
  return newState;
}

/**
 * moves backward in state
 * @param   {Number} num        the number of states to move back by
 * @param   {Array}  state      the state timeline
 * @param   {Number} stateIndex the current state index
 * @returns {Object} the newly active state
 */
export function undo(num, state, stateIndex) {
  const newStateIndex = (stateIndex > (num - 1))
    ? stateIndex - num
    : 0;
  return { state: state[newStateIndex], index: newStateIndex };
}

/**
 * moves forwardin state
 * @param   {Number} num        the number of states to move back by
 * @param   {Array}  state      the state timeline
 * @param   {Number} stateIndex the current state index
 * @returns {Object} the newly active state
 */
export function redo(num, state, stateIndex) {
  const newStateIndex = (stateIndex < state.length - (num + 1))
    ? stateIndex + num
    : state.length - 1;
  return { state: state[newStateIndex], index: newStateIndex };
}
