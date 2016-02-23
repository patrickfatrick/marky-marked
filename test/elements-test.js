/* global describe it */

import chai from 'chai'
import {Element} from '../src/modules/Element'
import {BoldButton, ItalicButton} from '../src/modules/Buttons'
import {HeadingItem} from '../src/modules/ListItems'

chai.should()

describe('Element', () => {
  it('creates an element', () => {
    let element = new Element('div', 'element', 'element')

    element.should.be.an.instanceof(Element)
    element.title.should.equal('element')
    element.id.should.equal('element')
  })
  it('creates a bold button', () => {
    const editor = document.querySelector('.marky-editor')
    let element = new BoldButton('button', 'Bold', 'bold', editor)

    element.should.be.an.instanceof(Element)
    element.should.be.an.instanceof(BoldButton)
    element.title.should.equal('Bold')
    element.id.should.equal('bold')
  })
  it('creates an italic button', () => {
    const editor = document.querySelector('.marky-editor')
    let element = new ItalicButton('button', 'Italic', 'italic', editor)

    element.should.be.an.instanceof(Element)
    element.should.be.an.instanceof(ItalicButton)
    element.title.should.equal('Italic')
    element.id.should.equal('italic')
  })
  it('creates a list item', () => {
    let element = new HeadingItem('li', 'Heading 1', '1')

    element.should.be.an.instanceof(Element)
    element.should.be.an.instanceof(HeadingItem)
    element.title.should.equal('Heading 1')
    element.element.textContent.should.equal('1')
    element.element.value.should.equal(1)
  })
})
