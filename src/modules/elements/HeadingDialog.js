'use strict'

import Element from './Element'
import Dialog from './Dialog'
import HeadingItem from './HeadingItem'

/**
 * Creates heading dialog element
 * @type {Element}
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */
const HeadingDialog = Object.create(Dialog)
HeadingDialog.init = function (title, id) {
  Dialog.init.call(this, title, id)
  .addClass(this.title, id, 'dialog')

  this.headingList = Object.create(Element)
  .init('ul', 'Heading List')
  .assign('id', id + '-heading-list')
  .appendTo(this.element)

  this.options = []

  for (let i = 0; i < 6; i++) {
    let option = Object.create(HeadingItem)
    .init('Heading ' + (i + 1), i + 1)
    this.options.push(option)
  }

  let remove = Object.create(HeadingItem)
  .init('Remove Heading', '0', 'fa', 'fa-remove')
  this.options.push(remove)

  this.options.forEach((option) => {
    option.appendTo(this.headingList.element)
  })

  return this
}

export default HeadingDialog
