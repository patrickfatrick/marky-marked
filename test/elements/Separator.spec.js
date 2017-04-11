/* global HTMLElement */

import test from 'tape'
import Separator from '../../src/modules/elements/Separator'

test('Separator > creates a separator', (t) => {
  const separator = Object.create(Separator)
  .init()

  t.true(separator.element instanceof HTMLElement)
  t.true(separator.element.classList.contains('separator'))
  t.equal(separator.element.tagName.toLowerCase(), 'span')
  t.end()
})
