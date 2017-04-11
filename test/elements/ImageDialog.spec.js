/* global HTMLElement */

import test from 'tape'
import ImageDialog from '../../src/modules/elements/ImageDialog'

test('ImageDialog > creates an image dialog', (t) => {
  const imageDialog = Object.create(ImageDialog)
  .init('Image Dialog', 'image-dialog')

  t.true(imageDialog.element instanceof HTMLElement)
  t.equal(imageDialog.element.title, 'Image Dialog')
  t.ok(imageDialog.element.querySelector('#image-dialog-image-form'))
  t.ok(imageDialog.element.querySelector('.image-source-input'))
  t.ok(imageDialog.element.querySelector('.image-alt-input'))
  t.ok(imageDialog.element.querySelector('.insert-image'))
  t.end()
})
