import Element from './Element'
import Dialog from './Dialog'
import HeadingItem from './HeadingItem'

/**
 * Creates heading dialog element
 * @type {Element}
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */
export default class HeadingDialog extends Dialog {
  constructor (title, id) {
    super(title, id)
    this.addClass(this.title, id, 'dialog')
    this.headingList = new Element('ul', 'Heading List')
      .assign('id', id + '-heading-list')
      .appendTo(this.element)

    this.options = [...Array(6)]
      .map((_, i) => new HeadingItem('Heading ' + (i + 1), i + 1))
    this.options.push(new HeadingItem('Remove Heading', '0', 'fa', 'fa-remove'))

    this.options.forEach((option) => {
      option.appendTo(this.headingList.element)
    })
  }
}
