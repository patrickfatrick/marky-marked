/* global HTMLElement */

import test from 'tape'
import Element from '../../src/modules/elements/Element'

test('Element > creates an element', (t) => {
  const element = Object.create(Element)
  .init('div', 'element', 'element')

  t.true(element.element instanceof HTMLElement)
  t.equal(element.element.title, 'element')
  t.end()
})
