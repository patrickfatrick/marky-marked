import test from 'tape'
import { undo } from '../src/modules/dispatcher'

const stateMock = [
  {
    markdown: '',
    html: '',
    selection: [ 0, 0 ]
  },
  {
    markdown: 'Some text',
    html: '<p>Some text</p>',
    selection: [ 0, 0 ]
  },
  {
    markdown: 'Some funny text',
    html: '<p>Some funny text</p>',
    selection: [ 0, 0 ]
  },
  {
    markdown: 'Some really funny text',
    html: '<p>Some really funny text</p>',
    selection: [ 0, 0 ]
  },
  {
    markdown: 'Some really funny awesome text',
    html: '<p>Some really funny awesome text</p>',
    selection: [ 0, 0 ]
  },
  {
    markdown: 'Some really funny awesome crazy text',
    html: '<p>Some really funny awesome crazy text</p>',
    selection: [ 0, 0 ]
  },
  {
    markdown: 'Some really super funny awesome crazy text',
    html: '<p>Some really super funny awesome crazy text</p>',
    selection: [ 0, 0 ]
  }
]

test('undo > returns a previous state', (t) => {
  const initialState = [ ...stateMock ]
  const stateIndex = 5
  let newState = undo(1, initialState, stateIndex).state

  t.equal(newState.markdown, 'Some really funny awesome text')
  t.equal(newState.html, '<p>Some really funny awesome text</p>')
  t.deepEqual(newState.selection, [0, 0])
  t.end()
})

test('undo > returns a previous state from the middle of the stack', (t) => {
  const initialState = [ ...stateMock ]
  const stateIndex = 5
  let newState = undo(5, initialState, stateIndex).state

  t.equal(newState.markdown, '')
  t.equal(newState.html, '')
  t.deepEqual(newState.selection, [0, 0])
  t.end()
})

test('undo > returns oldest state if state index is less than the num specified', (t) => {
  const initialState = [ ...stateMock ]
  const stateIndex = 3
  let newState = undo(5, initialState, stateIndex).state

  t.equal(newState.markdown, '')
  t.equal(newState.html, '')
  t.deepEqual(newState.selection, [0, 0])
  t.end()
})
