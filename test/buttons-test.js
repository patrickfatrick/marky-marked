/* global describe it */

import { assert } from 'chai'

describe('toolbar buttons', () => {
  it('controls the heading dialog', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    document.querySelector('.image').click()
    document.querySelector('.link').click()
    document.querySelector('.heading').click()
    assert.strictEqual(document.querySelector('.heading-dialog').style.visibility, 'visible')
    assert.strictEqual(document.querySelector('.link-dialog').style.visibility, 'hidden')
    assert.strictEqual(document.querySelector('.image-dialog').style.visibility, 'hidden')
  })
  it('calls the bold method', () => {
    const editor = document.querySelector('.marky-editor')
    const output = document.querySelector('.marky-output')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    document.querySelector('.bold').click()
    assert.strictEqual(output.value, '<p><strong>Some text</strong></p>\n')
  })
  it('calls the italic method', () => {
    const editor = document.querySelector('.marky-editor')
    const output = document.querySelector('.marky-output')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    document.querySelector('.italic').click()
    assert.strictEqual(output.value, '<p><em>Some text</em></p>\n')
  })
  it('calls the strikethrough method', () => {
    const editor = document.querySelector('.marky-editor')
    const output = document.querySelector('.marky-output')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    document.querySelector('.strikethrough').click()
    assert.strictEqual(output.value, '<p><del>Some text</del></p>\n')
  })
  it('calls the code method', () => {
    const editor = document.querySelector('.marky-editor')
    const output = document.querySelector('.marky-output')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    document.querySelector('.code').click()
    assert.strictEqual(output.value, '<p><code>Some text</code></p>\n')
  })
  it('calls the blockquote method', () => {
    const editor = document.querySelector('.marky-editor')
    const output = document.querySelector('.marky-output')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    document.querySelector('.blockquote').click()
    assert.strictEqual(output.value, '<blockquote>\n<p>Some text</p>\n</blockquote>\n')
  })
  it('controls the link dialog', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    document.querySelector('.image').click()
    document.querySelector('.link').click()
    assert.strictEqual(document.querySelector('.link-dialog').style.visibility, 'visible')
    assert.strictEqual(document.querySelector('.image-dialog').style.visibility, 'hidden')
  })
  it('controls the image dialog', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    document.querySelector('.link').click()
    document.querySelector('.image').click()
    assert.strictEqual(document.querySelector('.image-dialog').style.visibility, 'visible')
    assert.strictEqual(document.querySelector('.link-dialog').style.visibility, 'hidden')
  })
  it('calls the unorderedList method', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text\r\nSome other text'
    editor.setSelectionRange(0, 26)
    document.querySelector('.unordered-list').click()
    assert.strictEqual(editor.value, '- Some text\n- Some other text')
  })
  it('calls the ordered list method', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text\r\nSome other text'
    editor.setSelectionRange(0, 26)
    document.querySelector('.ordered-list').click()
    assert.strictEqual(editor.value, '1. Some text\n2. Some other text')
  })
  it('calls the indent method', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = '- Some text\r\n- Some other text'
    editor.setSelectionRange(0, 30)
    document.querySelector('.indent').click()
    assert.strictEqual(editor.value, '    - Some text\n    - Some other text')
  })
  it('calls the outdent method', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = '    - Some text\r\n    - Some other text'
    editor.setSelectionRange(0, 38)
    document.querySelector('.outdent').click()
    assert.strictEqual(editor.value, '- Some text\n- Some other text')
  })
  it('calls the undo method', () => {
    const editor = document.querySelector('.marky-editor')
    const output = document.querySelector('.marky-output')
    editor.value = 'Some really super funny awesome crazy text'
    output.value = '<p>Some super really funny awesome crazy text</p>'
    editor._marky.state = [
      {markdown: '', html: '', selection: [0, 0]},
      {markdown: 'Some text', html: '<p>Some text</p>', selection: [0, 0]},
      {markdown: 'Some funny text', html: '<p>Some funny text</p>', selection: [0, 0]},
      {markdown: 'Some really funny text', html: '<p>Some really funny text</p>', selection: [0, 0]},
      {markdown: 'Some really funny awesome text', html: '<p>Some really funny awesome text</p>', selection: [0, 0]},
      {markdown: 'Some really funny awesome crazy text', html: '<p>Some really funny awesome crazy text</p>', selection: [0, 0]},
      {markdown: 'Some really super funny awesome crazy text', html: '<p>Some super really funny awesome crazy text</p>', selection: [0, 0]}
    ]
    editor._marky.index = 5
    document.querySelector('.undo').click()
    assert.strictEqual(editor.value, 'Some really funny awesome text')
    assert.strictEqual(output.value, '<p>Some really funny awesome text</p>')
  })
  it('does not call the undo method if disabled', () => {
    const editor = document.querySelector('.marky-editor')
    const output = document.querySelector('.marky-output')
    editor.value = 'Some really super funny awesome crazy text'
    output.value = '<p>Some super really funny awesome crazy text</p>'
    editor._marky.state = [
      {markdown: '', html: '', selection: [0, 0]},
      {markdown: 'Some text', html: '<p>Some text</p>', selection: [0, 0]},
      {markdown: 'Some funny text', html: '<p>Some funny text</p>', selection: [0, 0]},
      {markdown: 'Some really funny text', html: '<p>Some really funny text</p>', selection: [0, 0]},
      {markdown: 'Some really funny awesome text', html: '<p>Some really funny awesome text</p>', selection: [0, 0]},
      {markdown: 'Some really funny awesome crazy text', html: '<p>Some really funny awesome crazy text</p>', selection: [0, 0]},
      {markdown: 'Some really super funny awesome crazy text', html: '<p>Some super really funny awesome crazy text</p>', selection: [0, 0]}
    ]
    editor._marky.index = 6
    document.querySelector('.undo').classList.add('disabled')
    document.querySelector('.undo').click()
    assert.strictEqual(editor.value, 'Some really super funny awesome crazy text')
    assert.strictEqual(output.value, '<p>Some super really funny awesome crazy text</p>')
  })
  it('calls the redo method', () => {
    const editor = document.querySelector('.marky-editor')
    const output = document.querySelector('.marky-output')
    editor.value = ''
    output.value = ''
    editor._marky.state = [
      {markdown: '', html: '', selection: [0, 0]},
      {markdown: 'Some text', html: '<p>Some text</p>', selection: [0, 0]},
      {markdown: 'Some funny text', html: '<p>Some funny text</p>', selection: [0, 0]},
      {markdown: 'Some really funny text', html: '<p>Some really funny text</p>', selection: [0, 0]},
      {markdown: 'Some really funny awesome text', html: '<p>Some really funny awesome text</p>', selection: [0, 0]},
      {markdown: 'Some really funny awesome crazy text', html: '<p>Some really funny awesome crazy text</p>', selection: [0, 0]},
      {markdown: 'Some really super funny awesome crazy text', html: '<p>Some super really funny awesome crazy text</p>', selection: [0, 0]}
    ]
    editor._marky.index = 0
    document.querySelector('.redo').click()
    assert.strictEqual(editor.value, 'Some text')
    assert.strictEqual(output.value, '<p>Some text</p>')
  })
  it('does not call the redo method if disabled', () => {
    const editor = document.querySelector('.marky-editor')
    const output = document.querySelector('.marky-output')
    editor.value = ''
    output.value = ''
    editor._marky.state = [
      {markdown: '', html: '', selection: [0, 0]},
      {markdown: 'Some text', html: '<p>Some text</p>', selection: [0, 0]},
      {markdown: 'Some funny text', html: '<p>Some funny text</p>', selection: [0, 0]},
      {markdown: 'Some really funny text', html: '<p>Some really funny text</p>', selection: [0, 0]},
      {markdown: 'Some really funny awesome text', html: '<p>Some really funny awesome text</p>', selection: [0, 0]},
      {markdown: 'Some really funny awesome crazy text', html: '<p>Some really funny awesome crazy text</p>', selection: [0, 0]},
      {markdown: 'Some really super funny awesome crazy text', html: '<p>Some super really funny awesome crazy text</p>', selection: [0, 0]}
    ]
    editor._marky.index = 0
    document.querySelector('.redo').classList.add('disabled')
    document.querySelector('.redo').click()
    assert.strictEqual(editor.value, '')
    assert.strictEqual(output.value, '')
  })
  it('turns on fullscreen', () => {
    const container = document.querySelector('marky-mark')
    const editor = document.querySelector('.marky-editor')

    document.querySelector('.fullscreen').click()

    assert.isTrue(container.classList.contains('fullscreen-toggled'))
    assert.isTrue(editor.classList.contains('fullscreen-toggled'))
  })
  it('turns off fullscreen', () => {
    const container = document.querySelector('marky-mark')
    const editor = document.querySelector('.marky-editor')

    document.querySelector('.fullscreen').click()

    assert.isFalse(container.classList.contains('fullscreen-toggled'))
    assert.isFalse(editor.classList.contains('fullscreen-toggled'))
  })
})
