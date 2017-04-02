/* global describe it */

import { assert } from 'chai'
import * as dispatcher from '../src/modules/dispatcher'

describe('redo', () => {
  it('returns a future state', () => {
    const initialState = [
      {markdown: '', html: '', selection: [0, 0]},
      {markdown: 'Some text', html: '<p>Some text</p>', selection: [0, 0]},
      {markdown: 'Some funny text', html: '<p>Some funny text</p>', selection: [0, 0]},
      {markdown: 'Some really funny text', html: '<p>Some really funny text</p>', selection: [0, 0]},
      {markdown: 'Some really funny awesome text', html: '<p>Some really funny awesome text</p>', selection: [0, 0]},
      {markdown: 'Some really funny awesome crazy text', html: '<p>Some really funny awesome crazy text</p>', selection: [36, 36]}
    ]
    const stateIndex = 0
    let newState = dispatcher.redo(5, initialState, stateIndex).state

    assert.strictEqual(newState.markdown, 'Some really funny awesome crazy text')
    assert.strictEqual(newState.html, '<p>Some really funny awesome crazy text</p>')
    assert.includeMembers(newState.selection, [36, 36])
  })

  it('returns a future state from the middle of the stack', () => {
    const initialState = [
      {markdown: '', html: '', selection: [0, 0]},
      {markdown: 'Some text', html: '<p>Some text</p>', selection: [0, 0]},
      {markdown: 'Some funny text', html: '<p>Some funny text</p>', selection: [0, 0]},
      {markdown: 'Some really funny text', html: '<p>Some really funny text</p>', selection: [0, 0]},
      {markdown: 'Some really funny awesome text', html: '<p>Some really funny awesome text</p>', selection: [0, 0]},
      {markdown: 'Some really funny awesome crazy text', html: '<p>Some really funny awesome crazy text</p>', selection: [0, 0]},
      {markdown: 'Some super really funny awesome crazy text', html: '<p>Some super really funny awesome crazy text</p>', selection: [42, 42]}
    ]
    const stateIndex = 1
    let newState = dispatcher.redo(5, initialState, stateIndex).state

    assert.strictEqual(newState.markdown, 'Some super really funny awesome crazy text')
    assert.strictEqual(newState.html, '<p>Some super really funny awesome crazy text</p>')
    assert.includeMembers(newState.selection, [42, 42])
  })

  it('returns the newest if it is less than 5 from the end in the stack', () => {
    const initialState = [
      {markdown: '', html: '', selection: [0, 0]},
      {markdown: 'Some text', html: '<p>Some text</p>', selection: [0, 0]},
      {markdown: 'Some funny text', html: '<p>Some funny text</p>', selection: [0, 0]},
      {markdown: 'Some super funny text', html: '<p>Some super funny text</p>', selection: [21, 21]}
    ]
    const stateIndex = 1
    let newState = dispatcher.redo(5, initialState, stateIndex).state

    assert.strictEqual(newState.markdown, 'Some super funny text')
    assert.strictEqual(newState.html, '<p>Some super funny text</p>')
    assert.includeMembers(newState.selection, [21, 21])
  })
})
