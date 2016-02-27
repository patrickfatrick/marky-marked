'use strict'

import {Element} from './Element'
import {HeadingItem} from './ListItems'

/**
 * Creates dialog (modal) elements
 * @type {Element}
 * @requires  HeadingItem
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */
export var LinkDialog = Object.create(Element)
LinkDialog.init = function (title, id) {
  Element.init.call(this, 'div', title, id)
  this.addClass(this.title, id, 'dialog')

  LinkDialog.linkForm = Object.create(Element)
  this.linkForm.init('form', 'Link Form')
  this.linkForm.assign('id', this.id + '-link-form')

  this.linkUrlInput = Object.create(Element)
  this.linkUrlInput.init('input', 'Link Url')
  this.linkUrlInput.addClass('link-url-input')
  this.linkUrlInput.assign('type', 'text')
  this.linkUrlInput.assign('name', this.id + '-link-url-input')
  this.linkUrlInput.assign('placeholder', 'http://url.com')

  this.linkDisplayInput = Object.create(Element)
  this.linkDisplayInput.init('input', 'Link Display')
  this.linkDisplayInput.addClass('link-display-input')
  this.linkDisplayInput.assign('type', 'text')
  this.linkDisplayInput.assign('name', this.id + '-link-display-input')
  this.linkDisplayInput.assign('placeholder', 'Display text')

  this.insertButton = Object.create(Element)
  this.insertButton.init('button', 'Insert Link')
  this.insertButton.addClass('insert-link')
  this.insertButton.assign('textContent', 'Insert')

  this.linkUrlInput.appendTo(this.linkForm.element)
  this.linkDisplayInput.appendTo(this.linkForm.element)
  this.insertButton.appendTo(this.linkForm.element)
  this.linkForm.appendTo(this.element)
}

export var ImageDialog = Object.create(Element)
ImageDialog.init = function (title, id) {
  Element.init.call(this, 'div', title, id)
  this.addClass(this.title, id, 'dialog')

  ImageDialog.imageForm = Object.create(Element)
  this.imageForm.init('form', 'Image Form')
  this.imageForm.assign('id', this.id + '-image-form')

  this.imageSourceInput = Object.create(Element)
  this.imageSourceInput.init('input', 'Image Source')
  this.imageSourceInput.addClass('image-source-input')
  this.imageSourceInput.assign('type', 'text')
  this.imageSourceInput.assign('name', this.id + '-image-source-input')
  this.imageSourceInput.assign('placeholder', 'http://url.com/image.jpg')

  this.imageAltInput = Object.create(Element)
  this.imageAltInput.init('input', 'Image Alt')
  this.imageAltInput.addClass('image-alt-input')
  this.imageAltInput.assign('type', 'text')
  this.imageAltInput.assign('name', this.id + '-image-alt-input')
  this.imageAltInput.assign('placeholder', 'Alt text')

  this.insertButton = Object.create(Element)
  this.insertButton.init('button', 'Insert Image')
  this.insertButton.addClass('insert-image')
  this.insertButton.assign('textContent', 'Insert')

  this.imageSourceInput.appendTo(this.imageForm.element)
  this.imageAltInput.appendTo(this.imageForm.element)
  this.insertButton.appendTo(this.imageForm.element)
  this.imageForm.appendTo(this.element)
}

export var HeadingDialog = Object.create(Element)
HeadingDialog.init = function (title, id) {
  Element.init.call(this, 'div', title, id)
  this.addClass(this.title, id, 'dialog')

  this.headingList = Object.create(Element)
  this.headingList.init('ul', 'Heading List')
  this.headingList.assign('id', id + '-heading-list')

  this.options = []

  for (let i = 0; i < 6; i++) {
    let option = Object.create(HeadingItem)
    option.init('Heading ' + (i + 1), i + 1)
    this.options.push(option)
  }

  let remove = Object.create(HeadingItem)
  remove.init('Remove Heading', '0', 'fa', 'fa-remove')
  this.options.push(remove)

  this.options.forEach((option) => {
    option.appendTo(this.headingList.element)
  })

  this.headingList.appendTo(this.element)
}
