/* global describe it */

import { assert } from 'chai'
import { blockHandler } from '../src/modules/handlers'
import { markyupdate } from '../src/modules/custom-events'

describe('block handling', () => {
  it('adds a formatting string to the beginning of a line', () => {
    const string = 'Some text'
    const indices = [0, 9]

    const headingify = blockHandler(string, indices, '#' + ' ')

    assert.strictEqual(headingify.value, '# Some text')
    assert.includeMembers(headingify.range, [2, 11])
  })

  it('does not matter where the selection is on that line', () => {
    const string = 'Some text'
    const indices = [9, 9]

    const quotify = blockHandler(string, indices, '>' + ' ')

    assert.strictEqual(quotify.value, '> Some text')
    assert.includeMembers(quotify.range, [11, 11])
  })

  it('works with multi-line selections', () => {
    const string = 'Some text\r\nSome other text'
    const indices = [0, 26]

    const headingify = blockHandler(string, indices, '##' + ' ')

    assert.strictEqual(headingify.value, '## Some text\r\nSome other text')
    assert.includeMembers(headingify.range, [3, 29])
  })

  it('ignores other lines around the selection', () => {
    const string = 'Some text\r\nSome other text'
    const indices = [11, 26]

    const headingify = blockHandler(string, indices, '#' + ' ')

    assert.strictEqual(headingify.value, 'Some text\r\n# Some other text')
    assert.includeMembers(headingify.range, [13, 28])
  })

  it('removes all other block formatting', () => {
    const string = '# Some text'
    const indices = [0, 11]

    const headingify = blockHandler(string, indices, '###' + ' ')

    assert.strictEqual(headingify.value, '### Some text')
    assert.includeMembers(headingify.range, [4, 13])
  })

  it('removes all other block formatting even if format string is directly touching text', () => {
    const string = '> Some text'
    const indices = [0, 10]

    const headingify = blockHandler(string, indices, '##' + ' ')

    assert.strictEqual(headingify.value, '## Some text')
    assert.includeMembers(headingify.range, [3, 11])
  })

  it('considers inline formats to be text', () => {
    const string = '**Some text**'
    const indices = [0, 13]

    const headingify = blockHandler(string, indices, '##' + ' ')

    assert.strictEqual(headingify.value, '## **Some text**')
    assert.includeMembers(headingify.range, [3, 16])
  })

  it('also considers inline formats to be text when removing other block formats', () => {
    const string = '> **Some text**'
    const indices = [0, 15]

    const headingify = blockHandler(string, indices, '##' + ' ')

    assert.strictEqual(headingify.value, '## **Some text**')
    assert.includeMembers(headingify.range, [3, 16])
  })

  it('also considers list formats to be text when removing other block formats', () => {
    const string = '> 1. Some text'
    const indices = [0, 14]

    const headingify = blockHandler(string, indices, '>' + ' ')

    assert.strictEqual(headingify.value, '1. Some text')
    assert.includeMembers(headingify.range, [0, 12])
  })

  it('also considers list formats to be text when exchanging block formats', () => {
    const string = '> 1. Some text'
    const indices = [0, 14]

    const headingify = blockHandler(string, indices, '#' + ' ')

    assert.strictEqual(headingify.value, '# 1. Some text')
    assert.includeMembers(headingify.range, [2, 14])
  })

  it('can deal with a blank mark', () => {
    const string = '# Some text'
    const indices = [0, 11]

    const headingify = blockHandler(string, indices, '')

    assert.strictEqual(headingify.value, 'Some text')
    assert.includeMembers(headingify.range, [0, 9])
  })

  it('works on a blank line', () => {
    const string = ''
    const indices = [0, 0]

    const headingify = blockHandler(string, indices, '#' + ' ')

    assert.strictEqual(headingify.value, '# ')
    assert.includeMembers(headingify.range, [2, 2])
  })

  it('removes other formatting on a blank line', () => {
    const string = '>'
    const indices = [0, 1]

    const headingify = blockHandler(string, indices, '#' + ' ')

    assert.strictEqual(headingify.value, '# ')
    assert.includeMembers(headingify.range, [2, 2])
  })

  it('converts to HTML', () => {
    const editor = document.querySelector('.marky-editor')
    editor.value = '## Some text'
    editor.dispatchEvent(markyupdate)

    assert.include(editor._marky.html, '<h2 id="some-text">Some text</h2>')
  })
})
