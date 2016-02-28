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
export default function (tag = 'marky-mark') {
  let containers = document.getElementsByTagName(tag)
  let idArr = []
  return Array.prototype.forEach.call(containers, (container, i) => {
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
    marky.init(markyEditor.element, container)

    markyEditor.assign('_marky', marky)

    let markyOutput = Object.create(Element)
    markyOutput.init('input', 'Marky Marked Output')
    markyOutput.assign('type', 'hidden')
    markyOutput.addClass('marky-output', id)

    /**
     * Create and register dialogs and set listeners
     */

    let headingDialog = Object.create(HeadingDialog)
    headingDialog.init('Heading Dialog', id)
    headingDialog.element.style.visibility = 'hidden'
    headingDialog.editor = markyEditor.element
    headingDialog.options.forEach((option) => {
      option.listen('click', (e) => {
        e.preventDefault()
        let value = parseInt(e.target.value)
        headingDialog.editor.focus()
        headingDialog.removeClass('toggled')
        headingDialog.element.style.visibility = 'hidden'
        headingDialog.editor._marky.heading(value, [headingDialog.editor.selectionStart, headingDialog.editor.selectionEnd])
      })
    })

    let linkDialog = Object.create(LinkDialog)
    linkDialog.init('Link Dialog', id)
    linkDialog.element.style.visibility = 'hidden'
    linkDialog.editor = markyEditor.element
    linkDialog.linkForm.listen('submit', (e) => {
      e.preventDefault()
      linkDialog.editor.focus()
    })
    linkDialog.insertButton.listen('click', (e) => {
      e.preventDefault
      linkDialog.editor.focus()
      let url = linkDialog.linkUrlInput.element.value ? linkDialog.linkUrlInput.element.value : 'http://url.com'
      let display = linkDialog.linkDisplayInput.element.value ? linkDialog.linkDisplayInput.element.value : url
      linkDialog.linkUrlInput.element.value = ''
      linkDialog.linkDisplayInput.element.value = ''
      linkDialog.element.style.visibility = 'hidden'
      linkDialog.removeClass('toggled')
      linkDialog.editor._marky.link([linkDialog.editor.selectionStart, linkDialog.editor.selectionEnd], url, display)
    })

    let imageDialog = Object.create(ImageDialog)
    imageDialog.init('Image Dialog', id)
    imageDialog.element.style.visibility = 'hidden'
    imageDialog.editor = markyEditor.element
    imageDialog.imageForm.listen('submit', (e) => {
      e.preventDefault()
      imageDialog.editor.focus()
    })
    imageDialog.insertButton.listen('click', (e) => {
      e.preventDefault
      imageDialog.editor.focus()
      let source = imageDialog.imageSourceInput.element.value ? imageDialog.imageSourceInput.element.value : 'http://imagesource.com/image.jpg'
      let alt = imageDialog.imageAltInput.element.value ? imageDialog.imageAltInput.element.value : source
      imageDialog.imageSourceInput.element.value = ''
      imageDialog.imageAltInput.element.value = ''
      imageDialog.element.style.visibility = 'hidden'
      imageDialog.removeClass('toggled')
      imageDialog.editor._marky.image([imageDialog.editor.selectionStart, imageDialog.editor.selectionEnd], source, alt)
    })

    /**
     * Create and register toolbar buttons and set listeners
     */

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
    boldButton.editor = markyEditor.element
    boldButton.listen('mousedown', (e) => {
      e.preventDefault()
      e.currentTarget.classList.add('active')
      boldButton.editor.focus()
    })
    boldButton.listen('mouseup', (e) => {
      e.currentTarget.classList.remove('active')
    })
    boldButton.listen('click', (e) => {
      e.preventDefault()
      boldButton.editor.focus()
      boldButton.editor._marky.bold([boldButton.editor.selectionStart, boldButton.editor.selectionEnd])
    })

    let italicButton = Object.create(Button)
    italicButton.init('Italic', id, 'fa', 'fa-italic')
    italicButton.editor = markyEditor.element
    italicButton.listen('mousedown', (e) => {
      e.preventDefault()
      e.currentTarget.classList.add('active')
      italicButton.editor.focus()
    })
    italicButton.listen('mouseup', (e) => {
      e.currentTarget.classList.remove('active')
    })
    italicButton.listen('click', (e) => {
      e.preventDefault()
      italicButton.editor.focus()
      italicButton.editor._marky.italic([italicButton.editor.selectionStart, italicButton.editor.selectionEnd])
    })

    let strikethroughButton = Object.create(Button)
    strikethroughButton.init('Strikethrough', id, 'fa', 'fa-strikethrough')
    strikethroughButton.editor = markyEditor.element
    strikethroughButton.listen('mousedown', (e) => {
      e.preventDefault()
      e.currentTarget.classList.add('active')
      strikethroughButton.editor.focus()
    })
    strikethroughButton.listen('mouseup', (e) => {
      e.currentTarget.classList.remove('active')
    })
    strikethroughButton.listen('click', (e) => {
      e.preventDefault()
      strikethroughButton.editor.focus()
      strikethroughButton.editor._marky.strikethrough([strikethroughButton.editor.selectionStart, strikethroughButton.editor.selectionEnd])
    })

    let codeButton = Object.create(Button)
    codeButton.init('Code', id, 'fa', 'fa-code')
    codeButton.editor = markyEditor.element
    codeButton.listen('mousedown', (e) => {
      e.preventDefault()
      e.currentTarget.classList.add('active')
      codeButton.editor.focus()
    })
    codeButton.listen('mouseup', (e) => {
      e.currentTarget.classList.remove('active')
    })
    codeButton.listen('click', (e) => {
      e.preventDefault()
      codeButton.editor.focus()
      codeButton.editor._marky.code([codeButton.editor.selectionStart, codeButton.editor.selectionEnd])
    })

    let blockquoteButton = Object.create(Button)
    blockquoteButton.init('Blockquote', id, 'fa', 'fa-quote-right')
    blockquoteButton.editor = markyEditor.element
    blockquoteButton.listen('mousedown', (e) => {
      e.preventDefault()
      e.currentTarget.classList.add('active')
      blockquoteButton.editor.focus()
    })
    blockquoteButton.listen('mouseup', (e) => {
      e.currentTarget.classList.remove('active')
    })
    blockquoteButton.listen('click', (e) => {
      e.preventDefault()
      blockquoteButton.editor.focus()
      blockquoteButton.editor._marky.blockquote([blockquoteButton.editor.selectionStart, blockquoteButton.editor.selectionEnd])
    })

    let linkButton = Object.create(Button)
    linkButton.init('Link', id, 'fa', 'fa-link')
    linkButton.editor = markyEditor.element
    linkButton.dialog = linkDialog.element
    linkButton.listen('mousedown', (e) => {
      e.preventDefault()
      e.currentTarget.classList.add('active')
      linkButton.editor.focus()
    })
    linkButton.listen('mouseup', (e) => {
      e.currentTarget.classList.remove('active')
    })
    linkButton.listen('click', (e) => {
      e.preventDefault()
      linkButton.editor.focus()
      linkButton.dialog.classList.toggle('toggled')
      imageDialog.element.style.visibility = 'hidden'
      imageDialog.removeClass('toggled')
      headingDialog.element.style.visibility = 'hidden'
      headingDialog.removeClass('toggled')
      if (linkButton.dialog.style.visibility === 'hidden') {
        linkButton.dialog.children[0].children[1].value = linkButton.editor.value.substring(linkButton.editor.selectionStart, linkButton.editor.selectionEnd)
        linkButton.dialog.style.visibility = 'visible'
        return
      }
      linkButton.dialog.style.visibility = 'hidden'
    })

    let imageButton = Object.create(Button)
    imageButton.init('Image', id, 'fa', 'fa-file-image-o')
    imageButton.editor = markyEditor.element
    imageButton.dialog = imageDialog.element
    imageButton.listen('mousedown', (e) => {
      e.preventDefault()
      e.currentTarget.classList.add('active')
      imageButton.editor.focus()
    })
    imageButton.listen('mouseup', (e) => {
      e.currentTarget.classList.remove('active')
    })
    imageButton.listen('click', (e) => {
      e.preventDefault()
      imageButton.editor.focus()
      imageButton.dialog.classList.toggle('toggled')
      linkDialog.element.style.visibility = 'hidden'
      linkDialog.removeClass('toggled')
      headingDialog.element.style.visibility = 'hidden'
      headingDialog.removeClass('toggled')
      if (imageButton.dialog.style.visibility === 'hidden') {
        imageButton.dialog.children[0].children[1].value = imageButton.editor.value.substring(imageButton.editor.selectionStart, imageButton.editor.selectionEnd)
        imageButton.dialog.style.visibility = 'visible'
        return
      }
      imageButton.dialog.style.visibility = 'hidden'
    })

    let unorderedListButton = Object.create(Button)
    unorderedListButton.init('Unordered List', id, 'fa', 'fa-list-ul')
    unorderedListButton.editor = markyEditor.element
    unorderedListButton.listen('mousedown', (e) => {
      e.preventDefault()
      e.currentTarget.classList.add('active')
      unorderedListButton.editor.focus()
    })
    unorderedListButton.listen('mouseup', (e) => {
      e.currentTarget.classList.remove('active')
    })
    unorderedListButton.listen('click', (e) => {
      e.preventDefault()
      unorderedListButton.editor.focus()
      unorderedListButton.editor._marky.unorderedList([unorderedListButton.editor.selectionStart, unorderedListButton.editor.selectionEnd])
    })

    let orderedListButton = Object.create(Button)
    orderedListButton.init('Ordered List', id, 'fa', 'fa-list-ol')
    orderedListButton.editor = markyEditor.element
    orderedListButton.listen('mousedown', (e) => {
      e.preventDefault()
      e.currentTarget.classList.add('active')
      orderedListButton.editor.focus()
    })
    orderedListButton.listen('mouseup', (e) => {
      e.currentTarget.classList.remove('active')
    })
    orderedListButton.listen('click', (e) => {
      e.preventDefault()
      orderedListButton.editor.focus()
      orderedListButton.editor._marky.orderedList([orderedListButton.editor.selectionStart, orderedListButton.editor.selectionEnd])
    })

    let outdentButton = Object.create(Button)
    outdentButton.init('Outdent', id, 'fa', 'fa-outdent')
    outdentButton.editor = markyEditor.element
    outdentButton.listen('mousedown', (e) => {
      e.preventDefault()
      e.currentTarget.classList.add('active')
      outdentButton.editor.focus()
    })
    outdentButton.listen('mouseup', (e) => {
      e.currentTarget.classList.remove('active')
    })
    outdentButton.listen('click', (e) => {
      e.preventDefault()
      outdentButton.editor.focus()
      outdentButton.editor._marky.outdent([outdentButton.editor.selectionStart, outdentButton.editor.selectionEnd])
    })

    let indentButton = Object.create(Button)
    indentButton.init('Indent', id, 'fa', 'fa-indent')
    indentButton.editor = markyEditor.element
    indentButton.listen('mousedown', (e) => {
      e.preventDefault()
      e.currentTarget.classList.add('active')
      indentButton.editor.focus()
    })
    indentButton.listen('mouseup', (e) => {
      e.currentTarget.classList.remove('active')
    })
    indentButton.listen('click', (e) => {
      e.preventDefault()
      indentButton.editor.focus()
      indentButton.editor._marky.indent([indentButton.editor.selectionStart, indentButton.editor.selectionEnd])
    })

    let undoButton = Object.create(Button)
    undoButton.init('Undo', id, 'fa', 'fa-backward')
    undoButton.editor = markyEditor.element
    undoButton.listen('mousedown', (e) => {
      e.preventDefault()
      e.currentTarget.classList.add('active')
      undoButton.editor.focus()
    })
    undoButton.listen('mouseup', (e) => {
      e.currentTarget.classList.remove('active')
    })
    undoButton.listen('click', (e) => {
      e.preventDefault()
      if (undoButton.element.classList.contains('disabled')) return
      undoButton.editor.focus()
      undoButton.editor._marky.undo(1, undoButton.editor._marky.state, undoButton.editor._marky.index)
    })

    let redoButton = Object.create(Button)
    redoButton.init('Redo', id, 'fa', 'fa-forward')
    redoButton.editor = markyEditor.element
    redoButton.listen('mousedown', (e) => {
      e.preventDefault()
      e.currentTarget.classList.add('active')
      redoButton.editor.focus()
    })
    redoButton.listen('mouseup', (e) => {
      e.currentTarget.classList.remove('active')
    })
    redoButton.listen('click', (e) => {
      e.preventDefault()
      if (redoButton.element.classList.contains('disabled')) return
      redoButton.editor.focus()
      redoButton.editor._marky.redo(1, redoButton.editor._marky.state, redoButton.editor._marky.index)
    })

    let fullscreenButton = Object.create(Button)
    fullscreenButton.init('Fullscreen', id, 'fa', 'fa-expand')
    fullscreenButton.editor = markyEditor.element
    fullscreenButton.listen('click', (e) => {
      e.preventDefault()
      e.currentTarget.blur()
      e.currentTarget.classList.toggle('fullscreen-toggled')
      container.classList.toggle('fullscreen-toggled')
      fullscreenButton.editor.classList.toggle('fullscreen-toggled')
      fullscreenButton.icon.element.classList.toggle('fa-expand')
      fullscreenButton.icon.element.classList.toggle('fa-compress')
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
    markyOutput.appendTo(container)
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
    fullscreenButton.appendTo(toolbar.element)
    dialogs.appendTo(toolbar.element)
    linkDialog.appendTo(dialogs.element)
    imageDialog.appendTo(dialogs.element)
    headingDialog.appendTo(dialogs.element)

    /**
     * Listeners for the editor
     */

    markyEditor.listen('markyupdate', (e) => {
      e.currentTarget._marky.update(e.currentTarget.value, [e.currentTarget.selectionStart, e.currentTarget.selectionEnd], e.currentTarget._marky.state, e.currentTarget._marky.index)
    }, false)

    markyEditor.listen('markychange', (e) => {
      let html = e.currentTarget._marky.state[e.currentTarget._marky.index].html
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
      e.currentTarget.nextSibling.value = html
    }, false)

    /**
     * Listen for input events, set timeout to update state, clear timeout from previous input
     */
    markyEditor.listen('input', (e) => {
      window.clearTimeout(timeoutID)
      timeoutID = window.setTimeout(() => {
        e.currentTarget.dispatchEvent(markyupdate)
      }, 1000)
    }, false)

    /**
     * Listen for change events (requires loss of focus) and update state
     */
    markyEditor.listen('change', (e) => {
      e.currentTarget.dispatchEvent(markyupdate)
    }, false)

    /**
     * Listen for pasting into the editor and update state
     */
    markyEditor.listen('paste', (e) => {
      setTimeout(() => {
        e.currentTarget.dispatchEvent(markyupdate)
      }, 0)
    }, false)

    /**
     * Listen for cutting from the editor and update state
     */
    markyEditor.listen('cut', (e) => {
      setTimeout(() => {
        e.currentTarget.dispatchEvent(markyupdate)
      }, 0)
    }, false)

    let deleteSelection = 0

    /**
     * Listen for keydown events,
     * if key is delete key,
     * set deleteSelection to length of selection
     */
    markyEditor.listen('keydown', (e) => {
      if (e.which === 8) deleteSelection = e.currentTarget.selectionEnd - e.currentTarget.selectionStart
    })

    let keyMap = [] // Used for determining whether or not to update state on space keyup
    let punctuations = [
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
          return e.currentTarget.dispatchEvent(markyupdate)
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
        e.currentTarget.dispatchEvent(markyupdate)
      }
    })

    markyEditor.listen('select', (e) => {
      e.currentTarget.dispatchEvent(markyselect)
    })

    markyEditor.listen('blur', (e) => {
      e.currentTarget.dispatchEvent(markyblur)
    })

    markyEditor.listen('focus', (e) => {
      e.currentTarget.dispatchEvent(markyfocus)
    })

    markyEditor.listen('click', () => {
      imageDialog.element.style.visibility = 'hidden'
      imageDialog.removeClass('toggled')
      linkDialog.element.style.visibility = 'hidden'
      linkDialog.removeClass('toggled')
      headingDialog.element.style.visibility = 'hidden'
      headingDialog.removeClass('toggled')
    })
  })
}
