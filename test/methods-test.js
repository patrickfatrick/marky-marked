/* global describe it assert */

import chai from 'chai'
import mark from '../src/modules/mark'

chai.should()
describe('marky methods', () => {
  it('destroys everything', () => {
    const editor = document.querySelector('.marky-editor')
    editor._marky.destroy()
    assert.isNull(document.getElementById('marky-mark-0'))

    const newContainer = document.createElement('marky-mark')
    document.body.appendChild(newContainer)
    mark()

    assert.strictEqual(document.getElementsByTagName('marky-mark')[2].getAttribute('id'), 'marky-mark-3')
  })
  it('updates the state', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text'
    let length = editor._marky.state.length
    editor._marky.update(editor.value)

    assert.strictEqual(editor._marky.state.length, length + 1)
  })
  it('undoes the state', () => {
    const editor = document.querySelector('.marky-editor')
    editor._marky.index = 1
    editor._marky.undo(1)

    assert.strictEqual(editor._marky.index, 0)
  })
  it('redoes the state', () => {
    const editor = document.querySelector('.marky-editor')
    editor._marky.index = 0
    editor._marky.redo(1)

    assert.strictEqual(editor._marky.index, 1)
  })
  it('sets the selection', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 0)
    editor._marky.setSelection([0, 9])

    assert.strictEqual(editor.selectionStart, 0)
    assert.strictEqual(editor.selectionEnd, 9)
  })
  it('expands the selection forward', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 0)
    editor._marky.expandSelectionForward(1)

    assert.strictEqual(editor.selectionStart, 0)
    assert.strictEqual(editor.selectionEnd, 1)
  })
  it('expands the selection backward', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text'
    editor.setSelectionRange(9, 9)
    editor._marky.expandSelectionBackward(1)

    assert.strictEqual(editor.selectionStart, 8)
    assert.strictEqual(editor.selectionEnd, 9)
  })
  it('moves the cursor forward', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 0)
    editor._marky.moveCursorForward(1)

    assert.strictEqual(editor.selectionStart, 1)
    assert.strictEqual(editor.selectionEnd, 1)
  })
  it('moves the cursor backward', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text'
    editor.setSelectionRange(9, 9)
    editor._marky.moveCursorBackward(1)

    assert.strictEqual(editor.selectionStart, 8)
    assert.strictEqual(editor.selectionEnd, 8)
  })
  it('implements a bold', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    editor._marky.bold()

    assert.strictEqual(editor._marky.html, '<p><strong>Some text</strong></p>\n')
  })
  it('implements an italic', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    editor._marky.italic()

    assert.strictEqual(editor._marky.html, '<p><em>Some text</em></p>\n')
  })
  it('implements a strikethrough', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    editor._marky.strikethrough()

    assert.strictEqual(editor._marky.html, '<p><del>Some text</del></p>\n')
  })
  it('implements a code block', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    editor._marky.code()

    assert.strictEqual(editor._marky.html, '<p><code>Some text</code></p>\n')
  })
  it('implements a blockquote', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    editor._marky.blockquote()

    assert.strictEqual(editor._marky.html, '<blockquote>\n<p>Some text</p>\n</blockquote>\n')
  })
  it('implements a heading', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    editor._marky.heading(1)

    assert.strictEqual(editor._marky.html, '<h1 id="some-text">Some text</h1>\n')
  })
  it('implements a heading with a default of 0', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = '# Some text'
    editor.setSelectionRange(2, 9)
    editor._marky.heading()

    assert.strictEqual(editor._marky.html, '<p>Some text</p>\n')
  })
  it('inserts a link snippet', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    editor._marky.link([0, 9], 'http://google.com', 'Some text')

    assert.strictEqual(editor.value, '[Some text](http://google.com)')
    assert.strictEqual(editor.selectionStart, 0)
    assert.strictEqual(editor.selectionEnd, editor.value.length)
  })
  it('inserts a default link snippet', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    editor._marky.link()

    assert.strictEqual(editor.value, '[http://url.com](http://url.com)')
    assert.strictEqual(editor.selectionStart, 0)
    assert.strictEqual(editor.selectionEnd, editor.value.length)
  })
  it('inserts an image snippet', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    editor._marky.image([0, 9], 'http://i.imgur.com/VlVsP.gif', 'Chuck Chardonnay')

    assert.strictEqual(editor.value, '![Chuck Chardonnay](http://i.imgur.com/VlVsP.gif)')
    assert.strictEqual(editor.selectionStart, 0)
    assert.strictEqual(editor.selectionEnd, editor.value.length)
  })
  it('inserts aa default image snippet', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    editor._marky.image()

    assert.strictEqual(editor.value, '![http://imagesource.com/image.jpg](http://imagesource.com/image.jpg)')
    assert.strictEqual(editor.selectionStart, 0)
    assert.strictEqual(editor.selectionEnd, editor.value.length)
  })
  it('implements an unordered list', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text\r\nSome other text'
    editor.setSelectionRange(0, 26)
    editor._marky.unorderedList()

    assert.strictEqual(editor.value, '- Some text\n- Some other text')
  })
  it('implements an ordered list', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text\r\nSome other text'
    editor.setSelectionRange(0, 26)
    editor._marky.orderedList()

    assert.strictEqual(editor.value, '1. Some text\n2. Some other text')
  })
  it('implements an indent', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = '- Some text\r\n- Some other text'
    editor.setSelectionRange(0, 30)
    editor._marky.indent()

    assert.strictEqual(editor.value, '    - Some text\n    - Some other text')
  })
  it('implements an outdent', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = '    - Some text\r\n    - Some other text'
    editor.setSelectionRange(0, 38)
    editor._marky.outdent()

    assert.strictEqual(editor.value, '- Some text\n- Some other text')
  })
  it('undoes state', () => {
    const container = document.getElementsByTagName('marky-mark')[0]
    const editor = container.children[1]
    const state = [{markdown: '', html: '', selection: [0, 0]}, {markdown: 'Some text', html: '<p>Some text</p>', selection: [0, 0]}]
    const index = 1

    assert.strictEqual(editor._marky.undo(1, state, index), 0)
  })
  it('does not undo state if state is at 0 index', () => {
    const container = document.getElementsByTagName('marky-mark')[0]
    const editor = container.children[1]
    const state = [{markdown: '', html: '', selection: [0, 0]}, {markdown: 'Some text', html: '<p>Some text</p>', selection: [0, 0]}]
    const index = 0

    assert.strictEqual(editor._marky.undo(1, state, index), 0)
  })
  it('redoes state', () => {
    const container = document.getElementsByTagName('marky-mark')[0]
    const editor = container.children[1]
    const state = [{markdown: '', html: '', selection: [0, 0]}, {markdown: 'Some text', html: '<p>Some text</p>', selection: [0, 0]}]
    const index = 0

    assert.strictEqual(editor._marky.redo(1, state, index), 1)
  })
  it('does not redo state if state is at last index', () => {
    const container = document.getElementsByTagName('marky-mark')[0]
    const editor = container.children[1]
    const state = [{markdown: '', html: '', selection: [0, 0]}, {markdown: 'Some text', html: '<p>Some text</p>', selection: [0, 0]}]
    const index = 1

    assert.strictEqual(editor._marky.redo(1, state, index), 1)
  })
})
