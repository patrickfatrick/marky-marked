'use strict'

import marked from 'marked'
import operation from './operation'

/**
 * updates the state
 * @external marked
 * @requires operation
 * @param   {String} markdown   markdown blob
 * @param   {Array}  state      the state timeline
 * @param   {Number} stateIndex the current state index
 * @returns {Object} the newly active state
 */
export function update (markdown, selection, state, stateIndex) {
  let markedOptions = {
    sanitize: true
  }
  let html = marked(markdown, markedOptions).toString() || ''
  let newState = operation(state, stateIndex, () => {
    return {markdown: markdown, html: html, selection: selection}
  })
  return newState
}

/**
 * moves backward in state
 * @param   {Number} num        the number of states to move back by
 * @param   {Array}  state      the state timeline
 * @param   {Number} stateIndex the current state index
 * @returns {Object} the newly active state
 */
export function undo (num, state, stateIndex) {
  stateIndex = (stateIndex > (num - 1)) ? stateIndex - num : 0
  return {state: state[stateIndex], index: stateIndex}
}

/**
 * moves forwardin state
 * @param   {Number} num        the number of states to move back by
 * @param   {Array}  state      the state timeline
 * @param   {Number} stateIndex the current state index
 * @returns {Object} the newly active state
 */
export function redo (num, state, stateIndex) {
  stateIndex = (stateIndex < state.length - (num + 1)) ? stateIndex + num : state.length - 1
  return {state: state[stateIndex], index: stateIndex}
}
