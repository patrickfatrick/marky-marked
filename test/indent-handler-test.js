/* global describe it */

import { assert } from 'chai'
import { indentHandler } from '../src/modules/handlers'

describe('indent handling', () => {
  it('adds four spaces to the beginning of a line', () => {
    let string = 'Some text'
    let indices = [0, 9]

    let indentify = indentHandler(string, indices, 'in')

    assert.strictEqual(indentify.value, '    Some text')
    assert.includeMembers(indentify.range, [0, 13])
  })

  it('does not matter where the selection is on that line', () => {
    let string = 'Some text'
    let indices = [9, 9]

    let indentify = indentHandler(string, indices, 'in')

    assert.strictEqual(indentify.value, '    Some text')
    assert.includeMembers(indentify.range, [0, 13])
  })

  it('works with multi-line selections', () => {
    let string = 'Some text\r\nSome other text'
    let indices = [0, 26]

    let indentify = indentHandler(string, indices, 'in')

    assert.strictEqual(indentify.value, '    Some text\r\n    Some other text')
    assert.includeMembers(indentify.range, [0, 33])
  })

  it('ignores other lines around the selection', () => {
    let string = 'Some text\r\nSome other text'
    let indices = [11, 26]
    let indentify = indentHandler(string, indices, 'in')

    assert.strictEqual(indentify.value, 'Some text\r\n    Some other text')
    assert.includeMembers(indentify.range, [11, 30])
  })

  it('does not remove block or list formatting', () => {
    let string = '- Some text'
    let indices = [0, 11]

    let indentify = indentHandler(string, indices, 'in')

    assert.strictEqual(indentify.value, '    - Some text')
    assert.includeMembers(indentify.range, [0, 15])
  })

  it('does not remove block or list formatting on outdent', () => {
    let string = '    - Some text'
    let indices = [0, 15]

    let indentify = indentHandler(string, indices, 'out')

    assert.strictEqual(indentify.value, '- Some text')
    assert.includeMembers(indentify.range, [0, 11])
  })

  it('considers inline formats to be text', () => {
    let string = '**Some text**'
    let indices = [0, 13]

    let indentify = indentHandler(string, indices, 'in')

    assert.strictEqual(indentify.value, '    **Some text**')
    assert.includeMembers(indentify.range, [0, 17])
  })

  it('also considers inline formats to be text on outdent', () => {
    let string = '    **Some text**'
    let indices = [0, 17]

    let indentify = indentHandler(string, indices, 'out')

    assert.strictEqual(indentify.value, '**Some text**')
    assert.includeMembers(indentify.range, [0, 13])
  })

  it('works on a blank line', () => {
    let string = ''
    let indices = [0, 0]

    let indentify = indentHandler(string, indices, 'in')

    assert.strictEqual(indentify.value, '    ')
    assert.includeMembers(indentify.range, [0, 4])
  })

  it('outdents on lines with multiple indents', () => {
    let string = '        Some text'
    let indices = [0, 17]

    let indentify = indentHandler(string, indices, 'out')

    assert.strictEqual(indentify.value, '    Some text')
    assert.includeMembers(indentify.range, [0, 13])
  })

  it('outdents on lines with less than a full indent', () => {
    let string = ' Some text'
    let indices = [0, 10]

    let indentify = indentHandler(string, indices, 'out')

    assert.strictEqual(indentify.value, 'Some text')
    assert.includeMembers(indentify.range, [0, 9])
  })

  it('outdents on lines with less than a full indent and an unordered list format string', () => {
    let string = ' - Some text'
    let indices = [0, 12]

    let indentify = indentHandler(string, indices, 'out')

    assert.strictEqual(indentify.value, '- Some text')
    assert.includeMembers(indentify.range, [0, 11])
  })

  it('outdents on lines with less than a full indent and an ordered list format string', () => {
    let string = ' 1. Some text'
    let indices = [0, 13]

    let indentify = indentHandler(string, indices, 'out')

    assert.strictEqual(indentify.value, '1. Some text')
    assert.includeMembers(indentify.range, [0, 12])
  })

  it('indents several lines', () => {
    let string = '- Some text\r\n- Some other text\r\n- Even more text'
    let indices = [0, 48]

    let indentify = indentHandler(string, indices, 'in')

    assert.strictEqual(indentify.value, '    - Some text\r\n    - Some other text\r\n    - Even more text')
    assert.includeMembers(indentify.range, [0, 58])
  })

  it('outdents several lines', () => {
    let string = '    1. Some text\r\n    2. Some other text\r\n    3. Even more text'
    let indices = [0, 63]

    let indentify = indentHandler(string, indices, 'out')

    assert.strictEqual(indentify.value, '1. Some text\r\n2. Some other text\r\n3. Even more text')
    assert.includeMembers(indentify.range, [0, 49])
  })

  it('outdents several lines with less than a full indent on each line', () => {
    let string = '  1. Some text\r\n  2. Some other text\r\n  3. Even more text'
    let indices = [0, 57]

    let indentify = indentHandler(string, indices, 'out')

    assert.strictEqual(indentify.value, '1. Some text\r\n2. Some other text\r\n3. Even more text')
    assert.includeMembers(indentify.range, [0, 49])
  })

  it('outdents several lines with a mix of indents', () => {
    let string = '    1. Some text\r\n  2. Some other text\r\n   3. Even more text'
    let indices = [0, 60]

    let indentify = indentHandler(string, indices, 'out')

    assert.strictEqual(indentify.value, '1. Some text\r\n2. Some other text\r\n3. Even more text')
    assert.includeMembers(indentify.range, [0, 49])
  })
})
