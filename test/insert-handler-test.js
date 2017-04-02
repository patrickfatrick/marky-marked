/* global describe it */

import { assert } from 'chai'
import { insertHandler } from '../src/modules/handlers'
import { markyupdate } from '../src/modules/custom-events'

describe('insert handling', () => {
  it('inserts and selects the inserted markdown', () => {
    let string = 'Some text '
    let indices = [10, 10]

    let boldify = insertHandler(string, indices, '[DISPLAY TEXT](https://url.com)')

    assert.strictEqual(boldify.value, 'Some text [DISPLAY TEXT](https://url.com)')
    assert.includeMembers(boldify.range, [10, 41])
  })

  it('inserts and selects the inserted markdown with a current selection', () => {
    let string = 'Some text '
    let indices = [0, 10]

    let boldify = insertHandler(string, indices, '[DISPLAY TEXT](https://url.com)')

    assert.strictEqual(boldify.value, '[DISPLAY TEXT](https://url.com)')
    assert.includeMembers(boldify.range, [0, 31])
  })

  it('converts to HTML', () => {
    const editor = document.querySelector('.marky-editor')
    const output = document.querySelector('.marky-output')
    editor.value = 'Some text ![Image](http://imagesource.com/image.jpg)'
    editor.dispatchEvent(markyupdate)

    assert.include(output.value, '<p>Some text <img src="http://imagesource.com/image.jpg" alt="Image"></p>')
  })
})
