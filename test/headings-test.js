/* global describe it */

import chai from 'chai'

chai.should()
describe('headings', () => {
  it('calls the heading-1 method', () => {
    const editor = document.querySelector('.marky-editor')
    const output = document.querySelector('.marky-output')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    var heading1 = document.querySelector('.heading-1').children[0]
    heading1.click()

    output.value.should.equal('<h1 id="some-text">Some text</h1>\n')
  })
  it('calls the heading-2 method', () => {
    const editor = document.querySelector('.marky-editor')
    const output = document.querySelector('.marky-output')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    var heading2 = document.querySelector('.heading-2').children[0]
    heading2.click()

    output.value.should.equal('<h2 id="some-text">Some text</h2>\n')
  })
  it('calls the heading-6 method', () => {
    const editor = document.querySelector('.marky-editor')
    const output = document.querySelector('.marky-output')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    var heading6 = document.querySelector('.heading-6').children[0]
    heading6.click()

    output.value.should.equal('<h6 id="some-text">Some text</h6>\n')
  })
  it('removes any existing heading', () => {
    const editor = document.querySelector('.marky-editor')
    const output = document.querySelector('.marky-output')
    editor.value = 'Some text'
    editor.setSelectionRange(0, 9)
    var removeHeading = document.querySelector('.remove-heading').children[0]
    removeHeading.click()

    output.value.should.equal('<p>Some text</p>\n')
  })
})
