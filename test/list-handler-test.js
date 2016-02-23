/* global describe it */

import chai from 'chai'
import {listHandler} from '../src/modules/handlers'
import {markyupdate} from '../src/modules/custom-events'

chai.should()
describe('list handling', () => {
  it('adds a formatting string to the beginning of a line', () => {
    let string = 'Some text'
    let indices = [0, 9]

    let listify = listHandler(string, indices, 'ul')

    listify.value.should.equal('- Some text')
    listify.range.should.contain.members([0, 11])
  })

  it('does not matter where the selection is on that line', () => {
    let string = 'Some text'
    let indices = [9, 9]

    let listify = listHandler(string, indices, 'ul')

    listify.value.should.equal('- Some text')
    listify.range.should.contain.members([0, 11])
  })

  it('works with multi-line selections', () => {
    let string = 'Some text\r\nSome other text'
    let indices = [0, 26]

    let listify = listHandler(string, indices, 'ul')

    listify.value.should.equal('- Some text\r\n- Some other text')
    listify.range.should.contain.members([0, 29])
  })

  it('ignores other lines around the selection', () => {
    let string = 'Some text\r\nSome other text'
    let indices = [11, 26]
    let listify = listHandler(string, indices, 'ul')

    listify.value.should.equal('Some text\r\n- Some other text')
    listify.range.should.contain.members([11, 28])
  })

  it('removes all other block or list formatting', () => {
    let string = '# Some text'
    let indices = [0, 11]

    let listify = listHandler(string, indices, 'ul')

    listify.value.should.equal('- Some text')
    listify.range.should.contain.members([0, 11])
  })

  it('removes all other list formatting even if format string is directly touching text', () => {
    let string = '>Some text'
    let indices = [0, 10]

    let listify = listHandler(string, indices, 'ul')

    listify.value.should.equal('- Some text')
    listify.range.should.contain.members([0, 11])
  })

  it('considers inline formats to be text', () => {
    let string = '**Some text**'
    let indices = [0, 13]

    let listify = listHandler(string, indices, 'ul')

    listify.value.should.equal('- **Some text**')
    listify.range.should.contain.members([0, 15])
  })

  it('also considers inline formats to be text when removing other list formats', () => {
    let string = '> **Some text**'
    let indices = [0, 15]

    let listify = listHandler(string, indices, 'ul')

    listify.value.should.equal('- **Some text**')
    listify.range.should.contain.members([0, 15])
  })

  it('works on a blank line', () => {
    let string = ''
    let indices = [0, 0]

    let listify = listHandler(string, indices, 'ul')

    listify.value.should.equal('- ')
    listify.range.should.contain.members([0, 2])
  })

  it('removes other formatting on a blank line', () => {
    let string = '>'
    let indices = [0, 1]

    let listify = listHandler(string, indices, 'ul')

    listify.value.should.equal('- ')
    listify.range.should.contain.members([0, 2])
  })

  it('adds formatting to several lines', () => {
    let string = 'Some text\r\nSome other text\r\nEven more text'
    let indices = [0, 42]

    let listify = listHandler(string, indices, 'ul')

    listify.value.should.equal('- Some text\r\n- Some other text\r\n- Even more text')
    listify.range.should.contain.members([0, 46])
  })

  it('exchanges one unordered list for an ordered list', () => {
    let string = '- Some text\r\n- Some other text\r\n- Even more text'
    let indices = [0, 48]

    let listify = listHandler(string, indices, 'ol')

    listify.value.should.equal('1. Some text\r\n2. Some other text\r\n3. Even more text')
    listify.range.should.contain.members([0, 49])
  })

  it('exchanges one ordered list for an unordered list', () => {
    let string = '1. Some text\r\n2. Some other text\r\n3. Even more text'
    let indices = [0, 51]

    let listify = listHandler(string, indices, 'ul')

    listify.value.should.equal('- Some text\r\n- Some other text\r\n- Even more text')
    listify.range.should.contain.members([0, 46])
  })

  it('converts to HTML', () => {
    const editor = document.querySelector('.marky-editor')
    const output = document.querySelector('.marky-output')
    editor.value = '- Some text\r\n- Some other text'
    editor.dispatchEvent(markyupdate)

    output.value.should.contain('<ul>\n<li>Some text</li>\n<li>Some other text</li>\n</ul>')
  })
})
