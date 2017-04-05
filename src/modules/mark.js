/* global HTMLCollection HTMLElement NodeList */
'use strict'

import {Marky} from './Marky'
import {Element} from './Element'
import {Button} from './Button'
import {LinkDialog, ImageDialog, HeadingDialog} from './Dialogs'
import {Separator} from './Separator'
import {markyblur, markyfocus, markyselect, markyupdate} from './custom-events'

let timeoutID // Used later for input events

/**
 * Register and append the DOM elements needed and set the event listeners
 * @param   {String}  tag name to be used for initialization
 */
export default function (containers = document.getElementsByTagName('marky-mark')) {
  if (
    !(containers instanceof Array) &&
    !(containers instanceof HTMLCollection) &&
    !(containers instanceof NodeList)
  ) {
    throw new TypeError('`containers` argument should be an Array or HTMLCollection')
  }

  const idArr = []

  // Ultimately this is what is returned
  const markies = []

  Array.prototype.forEach.call(containers, (container, i) => {
    if (!(container instanceof HTMLElement)) {
      throw new TypeError('`containers` argument should only contain HTMLElements')
    }

    let idIndex = i

    /**
     * Ignore container if it's not empty
     */
    if (container.children.length) {
      if (container.getAttribute('id')) idArr.push(parseInt(container.getAttribute('id').split('-')[2]))
      return
    }

    /**
     * Create and register main elements:
     * toolbar, editor, dialog container, hidden input
     */

    let toolbar = Object.create(Element)
    toolbar.init('div', 'Toolbar')

    if (idArr.length) {
      idArr.sort()
      idIndex = idArr[idArr.length - 1] + 1
    }

    let id = 'marky-mark-' + idIndex
    container.id = id
    toolbar.addClass('marky-toolbar', id)

    let dialogs = Object.create(Element)
    dialogs.init('div', 'Dialogs')
    dialogs.addClass('marky-dialogs', id)

    let markyEditor = Object.create(Element)
    markyEditor.init('textarea', 'Marky Marked Editor')
    markyEditor.addClass('marky-editor', id)

    let marky = Object.create(Marky)
    marky.init(container, markyEditor.element)

    markyEditor.assign('_marky', marky)
    markies.push(marky)

    /**
     * Create and register dialogs and set listeners
     */

    function formSubmit (e) {
      e.preventDefault()
      markyEditor.element.focus()
    }

    let headingDialog = Object.create(HeadingDialog)
    headingDialog.init('Heading Dialog', id)
    headingDialog.element.style.visibility = 'hidden'
    headingDialog.options.forEach((option) => {
      option.listen('click', (e) => {
        e.preventDefault()
        let value = parseInt(e.target.value)
        markyEditor.element.focus()
        headingDialog.removeClass('toggled')
        headingDialog.element.style.visibility = 'hidden'
        markyEditor.element._marky.heading(value, [markyEditor.element.selectionStart, markyEditor.element.selectionEnd])
      })
    })

    let linkDialog = Object.create(LinkDialog)
    linkDialog.init('Link Dialog', id)
    linkDialog.element.style.visibility = 'hidden'
    linkDialog.linkForm.listen('submit', formSubmit)
    linkDialog.insertButton.listen('click', (e) => {
      e.preventDefault()
      markyEditor.element.focus()
      let url = linkDialog.linkUrlInput.element.value ? linkDialog.linkUrlInput.element.value : 'http://url.com'
      let display = linkDialog.linkDisplayInput.element.value ? linkDialog.linkDisplayInput.element.value : url
      linkDialog.linkUrlInput.element.value = ''
      linkDialog.linkDisplayInput.element.value = ''
      linkDialog.element.style.visibility = 'hidden'
      linkDialog.removeClass('toggled')
      markyEditor.element._marky.link([markyEditor.element.selectionStart, markyEditor.element.selectionEnd], url, display)
    })

    let imageDialog = Object.create(ImageDialog)
    imageDialog.init('Image Dialog', id)
    imageDialog.element.style.visibility = 'hidden'
    imageDialog.imageForm.listen('submit', formSubmit)
    imageDialog.insertButton.listen('click', (e) => {
      e.preventDefault()
      markyEditor.element.focus()
      let source = imageDialog.imageSourceInput.element.value ? imageDialog.imageSourceInput.element.value : 'http://imagesource.com/image.jpg'
      let alt = imageDialog.imageAltInput.element.value ? imageDialog.imageAltInput.element.value : source
      imageDialog.imageSourceInput.element.value = ''
      imageDialog.imageAltInput.element.value = ''
      imageDialog.element.style.visibility = 'hidden'
      imageDialog.removeClass('toggled')
      markyEditor.element._marky.image([markyEditor.element.selectionStart, markyEditor.element.selectionEnd], source, alt)
    })

    /**
     * Create and register toolbar buttons and set listeners
     */

    function buttonMousedown (e) {
      e.preventDefault()
      e.currentTarget.classList.add('active')
      markyEditor.element.focus()
    }

    function buttonMouseup (e) {
      e.currentTarget.classList.remove('active')
    }

    let headingButton = Object.create(Button)
    headingButton.init('Heading', id, 'fa', 'fa-header')
    headingButton.dialog = headingDialog.element
    headingButton.listen('click', (e) => {
      e.preventDefault()
      e.currentTarget.blur()
      headingButton.dialog.classList.toggle('toggled')
      imageDialog.element.style.visibility = 'hidden'
      imageDialog.removeClass('toggled')
      linkDialog.element.style.visibility = 'hidden'
      linkDialog.removeClass('toggled')
      if (headingButton.dialog.style.visibility === 'hidden') {
        headingButton.dialog.style.visibility = 'visible'
        return
      }
      headingButton.dialog.style.visibility = 'hidden'
    })

    let boldButton = Object.create(Button)
    boldButton.init('Bold', id, 'fa', 'fa-bold')
    boldButton.listen('mousedown', buttonMousedown)
    boldButton.listen('mouseup', buttonMouseup)
    boldButton.listen('click', (e) => {
      e.preventDefault()
      markyEditor.element.focus()
      markyEditor.element._marky.bold([markyEditor.element.selectionStart, markyEditor.element.selectionEnd])
    })

    let italicButton = Object.create(Button)
    italicButton.init('Italic', id, 'fa', 'fa-italic')
    italicButton.listen('mousedown', buttonMousedown)
    italicButton.listen('mouseup', buttonMouseup)
    italicButton.listen('click', (e) => {
      e.preventDefault()
      markyEditor.element.focus()
      markyEditor.element._marky.italic([markyEditor.element.selectionStart, markyEditor.element.selectionEnd])
    })

    let strikethroughButton = Object.create(Button)
    strikethroughButton.init('Strikethrough', id, 'fa', 'fa-strikethrough')
    strikethroughButton.listen('mousedown', buttonMousedown)
    strikethroughButton.listen('mouseup', buttonMouseup)
    strikethroughButton.listen('click', (e) => {
      e.preventDefault()
      markyEditor.element.focus()
      markyEditor.element._marky.strikethrough([markyEditor.element.selectionStart, markyEditor.element.selectionEnd])
    })

    let codeButton = Object.create(Button)
    codeButton.init('Code', id, 'fa', 'fa-code')
    codeButton.listen('mousedown', buttonMousedown)
    codeButton.listen('mouseup', buttonMouseup)
    codeButton.listen('click', (e) => {
      e.preventDefault()
      markyEditor.element.focus()
      markyEditor.element._marky.code([markyEditor.element.selectionStart, markyEditor.element.selectionEnd])
    })

    let blockquoteButton = Object.create(Button)
    blockquoteButton.init('Blockquote', id, 'fa', 'fa-quote-right')
    blockquoteButton.listen('mousedown', buttonMousedown)
    blockquoteButton.listen('mouseup', buttonMouseup)
    blockquoteButton.listen('click', (e) => {
      e.preventDefault()
      markyEditor.element.focus()
      markyEditor.element._marky.blockquote([markyEditor.element.selectionStart, markyEditor.element.selectionEnd])
    })

    let linkButton = Object.create(Button)
    linkButton.init('Link', id, 'fa', 'fa-link')
    linkButton.dialog = linkDialog.element
    linkButton.listen('mousedown', buttonMousedown)
    linkButton.listen('mouseup', buttonMouseup)
    linkButton.listen('click', (e) => {
      e.preventDefault()
      markyEditor.element.focus()
      linkButton.dialog.classList.toggle('toggled')
      imageDialog.element.style.visibility = 'hidden'
      imageDialog.removeClass('toggled')
      headingDialog.element.style.visibility = 'hidden'
      headingDialog.removeClass('toggled')
      if (linkButton.dialog.style.visibility === 'hidden') {
        linkButton.dialog.children[0].children[1].value = markyEditor.element.value.substring(markyEditor.element.selectionStart, markyEditor.element.selectionEnd)
        linkButton.dialog.style.visibility = 'visible'
        return
      }
      linkButton.dialog.style.visibility = 'hidden'
    })

    let imageButton = Object.create(Button)
    imageButton.init('Image', id, 'fa', 'fa-file-image-o')
    imageButton.dialog = imageDialog.element
    imageButton.listen('mousedown', buttonMousedown)
    imageButton.listen('mouseup', buttonMouseup)
    imageButton.listen('click', (e) => {
      e.preventDefault()
      markyEditor.element.focus()
      imageButton.dialog.classList.toggle('toggled')
      linkDialog.element.style.visibility = 'hidden'
      linkDialog.removeClass('toggled')
      headingDialog.element.style.visibility = 'hidden'
      headingDialog.removeClass('toggled')
      if (imageButton.dialog.style.visibility === 'hidden') {
        imageButton.dialog.children[0].children[1].value = markyEditor.element.value.substring(markyEditor.element.selectionStart, markyEditor.element.selectionEnd)
        imageButton.dialog.style.visibility = 'visible'
        return
      }
      imageButton.dialog.style.visibility = 'hidden'
    })

    let unorderedListButton = Object.create(Button)
    unorderedListButton.init('Unordered List', id, 'fa', 'fa-list-ul')
    unorderedListButton.listen('mousedown', buttonMousedown)
    unorderedListButton.listen('mouseup', buttonMouseup)
    unorderedListButton.listen('click', (e) => {
      e.preventDefault()
      markyEditor.element.focus()
      markyEditor.element._marky.unorderedList([markyEditor.element.selectionStart, markyEditor.element.selectionEnd])
    })

    let orderedListButton = Object.create(Button)
    orderedListButton.init('Ordered List', id, 'fa', 'fa-list-ol')
    orderedListButton.listen('mousedown', buttonMousedown)
    orderedListButton.listen('mouseup', buttonMouseup)
    orderedListButton.listen('click', (e) => {
      e.preventDefault()
      markyEditor.element.focus()
      markyEditor.element._marky.orderedList([markyEditor.element.selectionStart, markyEditor.element.selectionEnd])
    })

    let outdentButton = Object.create(Button)
    outdentButton.init('Outdent', id, 'fa', 'fa-outdent')
    outdentButton.listen('mousedown', buttonMousedown)
    outdentButton.listen('mouseup', buttonMouseup)
    outdentButton.listen('click', (e) => {
      e.preventDefault()
      markyEditor.element.focus()
      markyEditor.element._marky.outdent([markyEditor.element.selectionStart, markyEditor.element.selectionEnd])
    })

    let indentButton = Object.create(Button)
    indentButton.init('Indent', id, 'fa', 'fa-indent')
    indentButton.listen('mousedown', buttonMousedown)
    indentButton.listen('mouseup', buttonMouseup)
    indentButton.listen('click', (e) => {
      e.preventDefault()
      markyEditor.element.focus()
      markyEditor.element._marky.indent([markyEditor.element.selectionStart, markyEditor.element.selectionEnd])
    })

    let undoButton = Object.create(Button)
    undoButton.init('Undo', id, 'fa', 'fa-backward')
    undoButton.listen('mousedown', buttonMousedown)
    undoButton.listen('mouseup', buttonMouseup)
    undoButton.listen('click', (e) => {
      e.preventDefault()
      if (undoButton.element.classList.contains('disabled')) return
      markyEditor.element.focus()
      markyEditor.element._marky.undo(1, markyEditor.element._marky.state, markyEditor.element._marky.index)
    })

    let redoButton = Object.create(Button)
    redoButton.init('Redo', id, 'fa', 'fa-forward')
    redoButton.listen('mousedown', buttonMousedown)
    redoButton.listen('mouseup', buttonMouseup)
    redoButton.listen('click', (e) => {
      e.preventDefault()
      if (redoButton.element.classList.contains('disabled')) return
      markyEditor.element.focus()
      markyEditor.element._marky.redo(1, markyEditor.element._marky.state, markyEditor.element._marky.index)
    })

    let expandButton = Object.create(Button)
    expandButton.init('Expand', id, 'fa', 'fa-expand')
    expandButton.listen('click', (e) => {
      e.preventDefault()
      e.currentTarget.blur()
      e.currentTarget.classList.toggle('marky-expanded')
      container.classList.toggle('marky-expanded')
      markyEditor.element.classList.toggle('marky-expanded')
      expandButton.icon.element.classList.toggle('fa-expand')
      expandButton.icon.element.classList.toggle('fa-compress')
    })

    /**
     * Create and register separators
     */

    let separatorA = Object.create(Separator)
    separatorA.init()

    let separatorB = Object.create(Separator)
    separatorB.init()

    let separatorC = Object.create(Separator)
    separatorC.init()

    let separatorD = Object.create(Separator)
    separatorD.init()

    let separatorE = Object.create(Separator)
    separatorE.init()

    /**
     * Insert elements into the DOM
     */

    toolbar.appendTo(container)
    markyEditor.appendTo(container)
    headingButton.appendTo(toolbar.element)
    separatorA.appendTo(toolbar.element)
    boldButton.appendTo(toolbar.element)
    italicButton.appendTo(toolbar.element)
    strikethroughButton.appendTo(toolbar.element)
    codeButton.appendTo(toolbar.element)
    blockquoteButton.appendTo(toolbar.element)
    separatorB.appendTo(toolbar.element)
    linkButton.appendTo(toolbar.element)
    imageButton.appendTo(toolbar.element)
    separatorC.appendTo(toolbar.element)
    unorderedListButton.appendTo(toolbar.element)
    orderedListButton.appendTo(toolbar.element)
    outdentButton.appendTo(toolbar.element)
    indentButton.appendTo(toolbar.element)
    separatorD.appendTo(toolbar.element)
    undoButton.appendTo(toolbar.element)
    redoButton.appendTo(toolbar.element)
    separatorE.appendTo(toolbar.element)
    expandButton.appendTo(toolbar.element)
    dialogs.appendTo(toolbar.element)
    linkDialog.appendTo(dialogs.element)
    imageDialog.appendTo(dialogs.element)
    headingDialog.appendTo(dialogs.element)

    /**
     * Listeners for the editor
     */

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

    let deleteSelection = 0

    const listeners = {
      markyupdate (e) {
        e.currentTarget._marky.update(
          e.currentTarget.value,
          [e.currentTarget.selectionStart, e.currentTarget.selectionEnd],
          e.currentTarget._marky.state,
          e.currentTarget._marky.index
        )
      },

      markychange (e) {
        const markdown = e.currentTarget._marky.state[e.currentTarget._marky.index].markdown
        const html = e.currentTarget._marky.state[e.currentTarget._marky.index].html
        if (e.currentTarget._marky.index === 0) {
          undoButton.addClass('disabled')
        } else {
          undoButton.removeClass('disabled')
        }
        if (e.currentTarget._marky.index === e.currentTarget._marky.state.length - 1) {
          redoButton.addClass('disabled')
        } else {
          redoButton.removeClass('disabled')
        }
        e.currentTarget._marky.updateMarkdown(markdown)
        e.currentTarget._marky.updateHTML(html)
      },

      input (e) {
        window.clearTimeout(timeoutID)
        timeoutID = window.setTimeout(() => {
          e.target.dispatchEvent(markyupdate)
        }, 1000)
      },

      change (e) {
        e.currentTarget.dispatchEvent(markyupdate)
      },

      paste (e) {
        setTimeout(() => {
          e.currentTarget.dispatchEvent(markyupdate)
        }, 0)
      },

      cut (e) {
        setTimeout(() => {
          e.currentTarget.dispatchEvent(markyupdate)
        }, 0)
      },

      keydown (e) {
        if (e.which === 8) deleteSelection = e.currentTarget.selectionEnd - e.currentTarget.selectionStart
      },

      keypress (e) {
        keyMap.push(e.which)
        if (keyMap.length > 2) keyMap.shift()
        punctuations.forEach((punctuation) => {
          if (e.which === 32 && keyMap[0] === punctuation) {
            return window.clearTimeout(timeoutID)
          }
          if (e.which === punctuation) {
            window.clearTimeout(timeoutID)
            return e.currentTarget.dispatchEvent(markyupdate)
          }
        })
      },

      keyup (e) {
        if (e.which === 8 && deleteSelection > 0) {
          window.clearTimeout(timeoutID)
          deleteSelection = 0
          e.currentTarget.dispatchEvent(markyupdate)
        }
      },

      click () {
        imageDialog.element.style.visibility = 'hidden'
        imageDialog.removeClass('toggled')
        linkDialog.element.style.visibility = 'hidden'
        linkDialog.removeClass('toggled')
        headingDialog.element.style.visibility = 'hidden'
        headingDialog.removeClass('toggled')
      },

      select (e) {
        e.currentTarget.dispatchEvent(markyselect)
      },

      blur (e) {
        e.currentTarget.dispatchEvent(markyblur)
      },

      focus (e) {
        e.currentTarget.dispatchEvent(markyfocus)
      }
    }

    markyEditor.listen('markyupdate', listeners.markyupdate)
    markyEditor.listen('markychange', listeners.markychange)

    /**
     * Listen for input events, set timeout to update state, clear timeout from previous input
     */
    markyEditor.listen('input', listeners.input)

    /**
     * Listen for change events (requires loss of focus) and update state
     */
    markyEditor.listen('change', listeners.change)

    /**
     * Listen for pasting into the editor and update state
     */
    markyEditor.listen('paste', listeners.paste)

    /**
     * Listen for cutting from the editor and update state
     */
    markyEditor.listen('cut', listeners.cut)

    /**
     * Listen for keydown events,
     * if key is delete key,
     * set deleteSelection to length of selection
     */
    markyEditor.listen('keydown', listeners.keydown)

    /**
     * Listen for keyup events,
     * if key is space or punctuation (but not a space following punctuation or another space),
     * update state and clear input timeout.
     */
    markyEditor.listen('keypress', listeners.keypress)

    /**
     * Listen for keyup events,
     * if key is delete and it's a bulk selection,
     * update state and clear input timeout.
     */
    markyEditor.listen('keyup', listeners.keypress)

    markyEditor.listen('click', listeners.click)

    /**
     * The following just emit a marky event.
     */
    markyEditor.listen('select', listeners.select)
    markyEditor.listen('blur', listeners.blur)
    markyEditor.listen('focus', listeners.focus)

    marky.listeners = listeners
  })

  return markies
}
