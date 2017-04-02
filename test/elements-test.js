/* global describe it */

import { assert } from 'chai'
import { Element } from '../src/modules/Element'
import { Button } from '../src/modules/Button'
import { HeadingItem } from '../src/modules/ListItems'

describe('Element', () => {
  it('creates an element', () => {
    let element = Object.create(Element)
    element.init('div', 'element', 'element')

    assert.strictEqual(element.title, 'element')
    assert.strictEqual(element.id, 'element')
  })
  it('creates a bold button', () => {
    let element = Object.create(Button)
    element.init('Bold', 'bold')

    assert.strictEqual(element.title, 'Bold')
    assert.strictEqual(element.id, 'bold')
  })
  it('creates a list item', () => {
    let element = Object.create(HeadingItem)
    element.init('Heading 1', '1')

    assert.strictEqual(element.title, 'Heading 1')
    assert.strictEqual(element.element.textContent, '1')
    assert.strictEqual(element.element.value, 1)
  })
})
