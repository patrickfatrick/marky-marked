/* global HTMLElement */

import test from 'tape'
import Icon from '../../src/modules/elements/Icon'

test('Icon > creates an icon', (t) => {
  const icon = Object.create(Icon)
  .init('fa', 'fa-cog')

  t.true(icon.element instanceof HTMLElement)
  t.true(icon.element.classList.contains('fa'))
  t.true(icon.element.classList.contains('fa-cog'))
  t.equal(icon.element.tagName.toLowerCase(), 'i')
  t.end()
})
