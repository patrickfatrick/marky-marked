/* global describe it */

import { assert } from 'chai'

describe('toolbar dialogs', () => {
  it('calls the image method', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    var source = document.querySelector('.image-source-input')
    var alt = document.querySelector('.image-alt-input')
    source.value = 'http://i.imgur.com/VlVsP.gif'
    alt.value = 'Chuck Chardonnay'
    document.querySelector('.insert-image').click()

    assert.strictEqual(editor._marky.html, '<p><img src="http://i.imgur.com/VlVsP.gif" alt="Chuck Chardonnay"></p>\n')
  })

  it('calls the link method', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    var source = document.querySelector('.link-url-input')
    var alt = document.querySelector('.link-display-input')
    source.value = 'http://google.com'
    alt.value = 'Google'
    document.querySelector('.insert-link').click()

    assert.strictEqual(editor._marky.html, '<p><a href="http://google.com">Google</a></p>\n')
  })
})
