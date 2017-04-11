'use strict'

import Element from './Element'
import Dialog from './Dialog'

/**
 * Creates dialog (modal) elements
 * @type {Dialog}
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */
const LinkDialog = Object.create(Dialog)
LinkDialog.init = function (title, id) {
  Dialog.init.call(this, title, id)
  .addClass(this.title, id, 'dialog')

  LinkDialog.form = Object.create(Element)
  .init('form', 'Link Form')
  .assign('id', this.id + '-link-form')
  .appendTo(this.element)

  this.urlInput = Object.create(Element)
  .init('input', 'Link Url')
  .addClass('link-url-input')
  .assign('type', 'text')
  .assign('name', this.id + '-link-url-input')
  .assign('placeholder', 'http://url.com')
  .appendTo(this.form.element)

  this.nameInput = Object.create(Element)
  .init('input', 'Link Display')
  .addClass('link-display-input')
  .assign('type', 'text')
  .assign('name', this.id + '-link-display-input')
  .assign('placeholder', 'Display text')
  .appendTo(this.form.element)

  this.insertButton = Object.create(Element)
  .init('button', 'Insert Link')
  .addClass('insert-link')
  .assign('type', 'submit')
  .assign('textContent', 'Insert')
  .appendTo(this.form.element)

  return this
}

export default LinkDialog
