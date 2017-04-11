'use strict'

import Element from './Element'
import Dialog from './Dialog'

/**
 * Creates image dialog modal
 * @type {Dialog}
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */
const ImageDialog = Object.create(Dialog)
ImageDialog.init = function (title, id) {
  Dialog.init.call(this, title, id)
  .addClass(this.title, id, 'dialog')

  ImageDialog.form = Object.create(Element)
  .init('form', 'Image Form')
  .assign('id', this.id + '-image-form')
  .appendTo(this.element)

  this.urlInput = Object.create(Element)
  .init('input', 'Image Source')
  .addClass('image-source-input')
  .assign('type', 'text')
  .assign('name', this.id + '-image-source-input')
  .assign('placeholder', 'http://url.com/image.jpg')
  .appendTo(this.form.element)

  this.nameInput = Object.create(Element)
  .init('input', 'Image Alt')
  .addClass('image-alt-input')
  .assign('type', 'text')
  .assign('name', this.id + '-image-alt-input')
  .assign('placeholder', 'Alt text')
  .appendTo(this.form.element)

  this.insertButton = Object.create(Element)
  .init('button', 'Insert Image')
  .addClass('insert-image')
  .assign('type', 'submit')
  .assign('textContent', 'Insert')
  .appendTo(this.form.element)

  return this
}

export default ImageDialog
