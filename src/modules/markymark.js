/* global HTMLCollection HTMLElement NodeList */

'use strict'

import { emitter } from 'contra'
import { hashish } from 'harsh'
import Marky from './Marky'
import Element from './elements/Element'
import Button from './elements/Button'
import LinkDialog from './elements/LinkDialog'
import ImageDialog from './elements/ImageDialog'
import HeadingDialog from './elements/HeadingDialog'
import Separator from './elements/Separator'

/**
 * Register and append the DOM elements needed and set the event listeners
 * @param   {String}  tag name to be used for initialization
 */
export default function markymark (containers = document.getElementsByTagName('marky-mark')) {
  if (
    !(containers instanceof Array) &&
    !(containers instanceof HTMLCollection) &&
    !(containers instanceof NodeList)
  ) {
    throw new TypeError('`containers` argument should be an Array or HTMLCollection')
  }

  // Ultimately this is what is returned
  const markies = []

  Array.prototype.forEach.call(containers, (container, i) => {
    if (!(container instanceof HTMLElement)) {
      throw new TypeError('`containers` argument should only contain HTMLElements')
    }

    /**
     * Ignore container if it's not empty
     */
    if (container.children.length) {
      return
    }

    const id = 'marky-mark-' + hashish()
    container.id = id

    /**
     * Create and register main elements:
     * toolbar, editor, dialog container, hidden input
     */

    const toolbar = Object.create(Element).init('div', 'Toolbar')

    toolbar.addClass('marky-toolbar', id)

    const dialogs = Object.create(Element).init('div', 'Dialogs')
    dialogs.addClass('marky-dialogs', id)

    const markyEditor = Object.create(Element).init('textarea', 'Marky Marked Editor')
    markyEditor.addClass('marky-editor', id)

    const marky = emitter(Object.create(Marky)).init(id, container, markyEditor)

    markyEditor.assign('_marky', marky)
    markies.push(marky)

    /**
     * Create and register dialogs and set listeners
     */

    marky.elements.dialogs = {
      heading: Object.create(HeadingDialog).init('Heading Dialog', id),
      link: Object.create(LinkDialog).init('Link Dialog', id),
      image: Object.create(ImageDialog).init('Image Dialog', id)
    }

    for (const dialogName in marky.elements.dialogs) {
      const dialog = marky.elements.dialogs[dialogName]
      if (dialogName === 'heading') {
        dialog.options.forEach((option) => {
          option.listen('click', (e) => {
            e.preventDefault()
            const value = parseInt(e.target.value)
            markyEditor.element.focus()
            dialog.removeClass('toggled')
            marky.heading(value, [markyEditor.element.selectionStart, markyEditor.element.selectionEnd])
          })
        })
      } else {
        dialog.form.listen('submit', (e) => {
          e.preventDefault()
          markyEditor.element.focus()
          const url = dialog.urlInput.element.value.slice(0) || 'http://url.com'
          const name = dialog.nameInput.element.value.slice(0) || url
          dialog.removeClass('toggled')
          marky[dialogName]([markyEditor.element.selectionStart, markyEditor.element.selectionEnd], url, name)
        })
      }
    }

    /**
     * Create and register toolbar buttons and set listeners
     */

    function buttonMousedown (e) {
      e.preventDefault()
      markyEditor.element.focus()
    }

    function buttonClick (button, name) {
      if (button.classList.contains('disabled')) return
      if (name === 'undo' || name || 'redo') {
        marky[name]()
      } else {
        marky[name]([ markyEditor.element.selectionStart, markyEditor.element.selectionEnd ])
      }
    }

    marky.elements.buttons = {
      heading: Object.create(Button).init('Heading', id, 'fa', 'fa-header'),
      bold: Object.create(Button).init('Bold', id, 'fa', 'fa-bold'),
      italic: Object.create(Button).init('Italic', id, 'fa', 'fa-italic'),
      strikethrough: Object.create(Button).init('Strikethrough', id, 'fa', 'fa-strikethrough'),
      code: Object.create(Button).init('Code', id, 'fa', 'fa-code'),
      blockquote: Object.create(Button).init('Blockquote', id, 'fa', 'fa-quote-right'),
      link: Object.create(Button).init('Link', id, 'fa', 'fa-link'),
      image: Object.create(Button).init('Image', id, 'fa', 'fa-file-image-o'),
      unorderedList: Object.create(Button).init('Unordered List', id, 'fa', 'fa-list-ul'),
      orderedList: Object.create(Button).init('Ordered List', id, 'fa', 'fa-list-ol'),
      outdent: Object.create(Button).init('Outdent', id, 'fa', 'fa-outdent'),
      indent: Object.create(Button).init('Indent', id, 'fa', 'fa-indent'),
      undo: Object.create(Button).init('Undo', id, 'fa', 'fa-backward'),
      redo: Object.create(Button).init('Redo', id, 'fa', 'fa-forward'),
      expand: Object.create(Button).init('Expand', id, 'fa', 'fa-expand')
    }

    for (const buttonName in marky.elements.buttons) {
      const button = marky.elements.buttons[buttonName]
      button.listen('mousedown', buttonMousedown)
      if (Object.keys(marky.elements.dialogs).includes(buttonName)) {
        button.dialog = marky.elements.dialogs[buttonName].element
        button.listen('click', () => {
          for (const dialogName in marky.elements.dialogs) {
            if (dialogName === buttonName) marky.elements.dialogs[buttonName].toggleClass('toggled')
            else marky.elements.dialogs[dialogName].removeClass('toggled')
          }
          if (
            (buttonName === 'link' ||
            buttonName === 'image') &&
            button.dialog.classList.contains('toggled')
          ) {
            button.dialog.children[0].children[1].value = markyEditor.element.value.substring(markyEditor.element.selectionStart, markyEditor.element.selectionEnd)
          }
        })
      } else if (buttonName === 'expand') {
        button.listen('click', (e) => {
          container.classList.toggle('marky-expanded')
          button.toggleClass('marky-expanded')
          markyEditor.toggleClass('marky-expanded')
          button.icon.toggleClass('fa-expand')
          button.icon.toggleClass('fa-compress')
        })
      } else {
        button.listen('click', (e) => buttonClick(e.currentTarget, buttonName))
      }
    }

    /**
     * Insert elements into the DOM one by one to ensure order
     */

    toolbar.appendTo(container)
    markyEditor.appendTo(container)
    marky.elements.buttons.heading.appendTo(toolbar.element)
    Object.create(Separator).init().appendTo(toolbar.element)
    marky.elements.buttons.bold.appendTo(toolbar.element)
    marky.elements.buttons.italic.appendTo(toolbar.element)
    marky.elements.buttons.strikethrough.appendTo(toolbar.element)
    marky.elements.buttons.code.appendTo(toolbar.element)
    marky.elements.buttons.blockquote.appendTo(toolbar.element)
    Object.create(Separator).init().appendTo(toolbar.element)
    marky.elements.buttons.link.appendTo(toolbar.element)
    marky.elements.buttons.image.appendTo(toolbar.element)
    Object.create(Separator).init().appendTo(toolbar.element)
    marky.elements.buttons.unorderedList.appendTo(toolbar.element)
    marky.elements.buttons.orderedList.appendTo(toolbar.element)
    marky.elements.buttons.outdent.appendTo(toolbar.element)
    marky.elements.buttons.indent.appendTo(toolbar.element)
    Object.create(Separator).init().appendTo(toolbar.element)
    marky.elements.buttons.undo.appendTo(toolbar.element)
    marky.elements.buttons.redo.appendTo(toolbar.element)
    Object.create(Separator).init().appendTo(toolbar.element)
    marky.elements.buttons.expand.appendTo(toolbar.element)
    dialogs.appendTo(toolbar.element)
    marky.elements.dialogs.link.appendTo(dialogs.element)
    marky.elements.dialogs.image.appendTo(dialogs.element)
    marky.elements.dialogs.heading.appendTo(dialogs.element)

    /**
     * Listeners for the editor
     */

    let timeoutID // Used input events
    let deleteSelection = 0 // Used for determing how to update state with deletions
    const keyMap = [] // Used for determining whether or not to update state on space keyup
    const punctuations = [
      46, // period
      44, // comma
      63, // question mark
      33, // exclamation point
      58, // colon
      59, // semi-colon
      47, // back slash
      92, // forward slash
      38, // ampersand
      124, // vertical pipe
      32 // space
    ]

    /**
     * Listen for input events, set timeout to update state, clear timeout from previous input
     */
    markyEditor.listen('input', () => {
      window.clearTimeout(timeoutID)
      timeoutID = window.setTimeout(() => {
        marky.emit('markyupdate')
      }, 1000)
    })

    /**
     * Listen for change events (requires loss of focus) and update state
     */
    markyEditor.listen('change', () => {
      marky.emit('markyupdate')
    })

    /**
     * Listen for pasting into the editor and update state
     */
    markyEditor.listen('paste', () => {
      setTimeout(() => {
        marky.emit('markyupdate')
      }, 0)
    })

    /**
     * Listen for cutting from the editor and update state
     */
    markyEditor.listen('cut', () => {
      setTimeout(() => {
        marky.emit('markyupdate')
      }, 0)
    })

    /**
     * Listen for keydown events,
     * if key is delete key,
     * set deleteSelection to length of selection
     */
    markyEditor.listen('keydown', (e) => {
      if (e.which === 8) deleteSelection = e.currentTarget.selectionEnd - e.currentTarget.selectionStart
    })

    /**
     * Listen for keyup events,
     * if key is space or punctuation (but not a space following punctuation or another space),
     * update state and clear input timeout.
     */
    markyEditor.listen('keypress', (e) => {
      keyMap.push(e.which)
      if (keyMap.length > 2) keyMap.shift()
      punctuations.forEach((punctuation) => {
        if (e.which === 32 && keyMap[0] === punctuation) {
          return window.clearTimeout(timeoutID)
        }
        if (e.which === punctuation) {
          window.clearTimeout(timeoutID)
          return marky.emit('markyupdate')
        }
      })
    })

    /**
     * Listen for keyup events,
     * if key is delete and it's a bulk selection,
     * update state and clear input timeout.
     */
    markyEditor.listen('keyup', (e) => {
      if (e.which === 8 && deleteSelection > 0) {
        window.clearTimeout(timeoutID)
        deleteSelection = 0
        marky.emit('markyupdate')
      }
    })

    markyEditor.listen('click', () => {
      marky.elements.dialogs.image.removeClass('toggled')
      marky.elements.dialogs.link.removeClass('toggled')
      marky.elements.dialogs.heading.removeClass('toggled')
    })

    /**
     * The following just emit a marky event.
     */
    markyEditor.listen('select', () => marky.emit('markyselect'))
    markyEditor.listen('blur', () => marky.emit('markyblur'))
    markyEditor.listen('focus', () => marky.emit('markyfocus'))

    /**
     * Listeners for the marky instance
     */

    marky.on('markyupdate', () => {
      marky.update(
        markyEditor.element.value,
        [ markyEditor.element.selectionStart, markyEditor.element.selectionEnd ],
        marky.state,
        marky.index
      )
    })

    marky.on('markychange', () => {
      if (marky.index === 0) {
        marky.elements.buttons.undo.addClass('disabled')
      } else {
        marky.elements.buttons.undo.removeClass('disabled')
      }
      if (marky.index === marky.state.length - 1) {
        marky.elements.buttons.redo.addClass('disabled')
      } else {
        marky.elements.buttons.redo.removeClass('disabled')
      }

      marky.change(marky.state[marky.index].markdown, marky.state[marky.index].html)
    })
  })

  return markies
}
