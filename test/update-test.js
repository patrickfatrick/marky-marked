/* global describe it */

import { assert } from 'chai'
import {markyupdate} from '../src/modules/custom-events'
import * as dispatcher from '../src/modules/dispatcher'

describe('update', () => {
  it('handles updating state', () => {
    const initialState = [{markdown: '', html: '', selection: [0, 0]}]
    const stateIndex = 0
    let newState = dispatcher.update('Some text', [9, 9], initialState, stateIndex)

    assert.lengthOf(newState.state, 2)
    assert.strictEqual(newState.state[1].markdown, 'Some text')
    assert.include(newState.state[1].html, '<p>Some text</p>')
    assert.includeMembers(newState.state[1].selection, [9, 9])
    assert.strictEqual(newState.state[0].markdown, '')
    assert.includeMembers(newState.state[0].selection, [0, 0])
    assert.strictEqual(newState.index, 1)
  })

  it('adds to existing state', () => {
    const initialState = [
      {markdown: '', html: '', selection: [0, 0]},
      {markdown: 'Some text', html: '<p>Some text</p>', selection: [9, 9]}
    ]
    const stateIndex = 1
    let newState = dispatcher.update('', [0, 0], initialState, stateIndex)

    assert.lengthOf(newState.state, 3)
    assert.strictEqual(newState.state[2].markdown, '')
    assert.strictEqual(newState.state[2].html, '')
    assert.includeMembers(newState.state[2].selection, [0, 0])
    assert.strictEqual(newState.state[1].markdown, 'Some text')
    assert.includeMembers(newState.state[1].selection, [9, 9])
    assert.strictEqual(newState.index, 2)
  })

  it('removes old states when there are 1000 of them', () => {
    const initialState = [
      {markdown: '', html: '', selection: [0, 0]},
      {markdown: 'Some text', html: '<p>Some text</p>', selection: [9, 9]}
    ]
    const stateIndex = 999
    let newState = dispatcher.update('', [0, 0], initialState, stateIndex)

    assert.lengthOf(newState.state, 2)
    assert.strictEqual(newState.state[1].markdown, '')
    assert.strictEqual(newState.state[1].html, '')
    assert.strictEqual(newState.state[0].markdown, 'Some text')
    assert.strictEqual(newState.index, 999)
  })

  it('is triggered by an update event', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text'
    editor.dispatchEvent(markyupdate)

    assert.include(editor._marky.html, '<p>Some text</p>')
  })
})
