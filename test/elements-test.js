/* global describe it */

import chai from 'chai'
import {Element} from '../src/modules/Element'
import {Button} from '../src/modules/Button'
import {HeadingItem} from '../src/modules/ListItems'

chai.should()

describe('Element', () => {
  it('creates an element', () => {
    let element = Object.create(Element)
    element.init('div', 'element', 'element')

    element.title.should.equal('element')
    element.id.should.equal('element')
  })
  it('creates a bold button', () => {
    let element = Object.create(Button)
    element.init('Bold', 'bold')

    element.title.should.equal('Bold')
    element.id.should.equal('bold')
  })
  it('creates a list item', () => {
    let element = Object.create(HeadingItem)
    element.init('Heading 1', '1')

    element.title.should.equal('Heading 1')
    element.element.textContent.should.equal('1')
    element.element.value.should.equal(1)
  })
})
