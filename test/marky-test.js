/* global describe it */

import { assert } from 'chai'

describe('marky', () => {
  it('is added to the editor on init', () => {
    const container = document.getElementsByTagName('marky-mark')[0]
    const editor = container.children[1]

    assert.isOk(editor._marky)
  })
  it('has a state', () => {
    const container = document.getElementsByTagName('marky-mark')[0]
    const editor = container.children[1]

    assert.isArray(editor._marky.state)
  })
  it('has an index', () => {
    const container = document.getElementsByTagName('marky-mark')[0]
    const editor = container.children[1]

    assert.isNumber(editor._marky.index)
  })
  it('has a destroy method', () => {
    const container = document.getElementsByTagName('marky-mark')[0]
    const editor = container.children[1]

    assert.isFunction(editor._marky.destroy)
  })
  it('has an update method', () => {
    const container = document.getElementsByTagName('marky-mark')[0]
    const editor = container.children[1]

    assert.isFunction(editor._marky.update)
  })
  it('has an undo method', () => {
    const container = document.getElementsByTagName('marky-mark')[0]
    const editor = container.children[1]

    assert.isFunction(editor._marky.undo)
  })
  it('has an undo method that does nothing if state is at 0 index', () => {
    const container = document.getElementsByTagName('marky-mark')[0]
    const editor = container.children[1]
    const state = [{markdown: '', html: ''}]
    const index = 0
    assert.strictEqual(editor._marky.undo(1, state, index), 0)
  })
  it('has a redo method', () => {
    const container = document.getElementsByTagName('marky-mark')[0]
    const editor = container.children[1]

    assert.isFunction(editor._marky.redo)
  })
  it('has a redo method that does nothing if state is at last index', () => {
    const container = document.getElementsByTagName('marky-mark')[0]
    const editor = container.children[1]
    const state = [{markdown: '', html: ''}, {markdown: 'Some text', html: '<p>Some text</p>'}]
    const index = 1
    assert.strictEqual(editor._marky.redo(1, state, index), 1)
  })
  it('has a setSelection method', () => {
    const container = document.getElementsByTagName('marky-mark')[0]
    const editor = container.children[1]

    assert.isFunction(editor._marky.setSelection)
  })
  it('has an expandSelectionForward method', () => {
    const container = document.getElementsByTagName('marky-mark')[0]
    const editor = container.children[1]

    assert.isFunction(editor._marky.expandSelectionForward)
  })
  it('has an expandSelectionBackward method', () => {
    const container = document.getElementsByTagName('marky-mark')[0]
    const editor = container.children[1]

    assert.isFunction(editor._marky.expandSelectionBackward)
  })
  it('has an moveCursorBackward method', () => {
    const container = document.getElementsByTagName('marky-mark')[0]
    const editor = container.children[1]

    assert.isFunction(editor._marky.moveCursorBackward)
  })
  it('has an moveCursorForward method', () => {
    const container = document.getElementsByTagName('marky-mark')[0]
    const editor = container.children[1]

    assert.isFunction(editor._marky.moveCursorForward)
  })
})
