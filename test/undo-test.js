/* global describe it */

import { assert } from 'chai'
import * as dispatcher from '../src/modules/dispatcher'

describe('undo', () => {
  it('returns a previous state', () => {
    const initialState = [
      {markdown: '', html: '', selection: [0, 0]},
      {markdown: 'Some text', html: '<p>Some text</p>', selection: [0, 0]},
      {markdown: 'Some funny text', html: '<p>Some funny text</p>', selection: [0, 0]},
      {markdown: 'Some really funny text', html: '<p>Some really funny text</p>', selection: [0, 0]},
      {markdown: 'Some really funny awesome text', html: '<p>Some really funny awesome text</p>', selection: [0, 0]},
      {markdown: 'Some really funny awesome crazy text', html: '<p>Some really funny awesome crazy text</p>', selection: [36, 36]}
    ]
    const stateIndex = 5
    let newState = dispatcher.undo(1, initialState, stateIndex).state

    assert.strictEqual(newState.markdown, 'Some really funny awesome text')
    assert.strictEqual(newState.html, '<p>Some really funny awesome text</p>')
    assert.includeMembers(newState.selection, [0, 0])
  })

  it('returns a previous state from the middle of the stack', () => {
    const initialState = [
      {markdown: '', html: '', selection: [0, 0]},
      {markdown: 'Some text', html: '<p>Some text</p>', selection: [0, 0]},
      {markdown: 'Some funny text', html: '<p>Some funny text</p>', selection: [0, 0]},
      {markdown: 'Some really funny text', html: '<p>Some really funny text</p>', selection: [0, 0]},
      {markdown: 'Some really funny awesome text', html: '<p>Some really funny awesome text</p>', selection: [0, 0]},
      {markdown: 'Some really funny awesome crazy text', html: '<p>Some really funny awesome crazy text</p>', selection: [36, 36]},
      {markdown: 'Some really super funny awesome crazy text', html: '<p>Some super really funny awesome crazy text</p>', selection: [0, 0]}
    ]
    const stateIndex = 5
    let newState = dispatcher.undo(5, initialState, stateIndex).state

    assert.strictEqual(newState.markdown, '')
    assert.strictEqual(newState.html, '')
    assert.includeMembers(newState.selection, [0, 0])
  })

  it('returns oldest state if it is less than specified', () => {
    const initialState = [
      {markdown: '', html: '', selection: [0, 0]},
      {markdown: 'Some text', html: '<p>Some text</p>', selection: [0, 0]},
      {markdown: 'Some funny text', html: '<p>Some funny text</p>', selection: [0, 0]},
      {markdown: 'Some super funny text', html: '<p>Some super funny text</p>', selection: [21, 21]}
    ]
    const stateIndex = 3
    let newState = dispatcher.undo(5, initialState, stateIndex).state

    assert.strictEqual(newState.markdown, '')
    assert.strictEqual(newState.html, '')
    assert.includeMembers(newState.selection, [0, 0])
  })
})
