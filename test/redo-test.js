/* global describe it */

import chai from 'chai'
import * as dispatcher from '../src/modules/dispatcher'

chai.should()
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

    newState.markdown.should.not.be.empty
    newState.html.should.not.be.empty
    newState.selection.should.include.members([36, 36])
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

    newState.markdown.should.equal('Some super really funny awesome crazy text')
    newState.html.should.contain('<p>Some super really funny awesome crazy text</p>')
    newState.selection.should.include.members([42, 42])
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

    newState.markdown.should.equal('Some super funny text')
    newState.html.should.equal('<p>Some super funny text</p>')
    newState.selection.should.include.members([21, 21])
  })
})
