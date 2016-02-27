'use strict'

import {Marky} from './Marky'
import {Element} from './Element'
import {Button} from './Button'
// import {LinkDialog, ImageDialog, HeadingDialog} from './Dialogs'
// import {markyblur, markyfocus, markyselect, markyupdate, markychange} from './custom-events'

// let timeoutID // Used later for input events

/**
 * Register and append the DOM elements needed and set the event listeners
 * @param   {String}  tag name to be used for initialization
 */
export default function (tag = 'marky-mark') {
  let containers = document.getElementsByTagName(tag)
  let idArr = []
  return Array.prototype.forEach.call(containers, (container, i) => {
    let idIndex = i
    if (container.children.length) {
      if (container.getAttribute('id')) idArr.push(parseInt(container.getAttribute('id').split('-')[2]))
      return
    }
    // let toolbar = new Element('div', 'Toolbar')
    let toolbar = Object.create(Element)
    toolbar.type = 'div'
    toolbar.element = toolbar.register()
    toolbar.element.title = 'Toolbar'

    if (idArr.length) {
      idArr.sort()
      idIndex = idArr[idArr.length - 1] + 1
    }

    let id = 'marky-mark-' + idIndex
    container.id = id
    toolbar.addClass(['marky-toolbar', id])

    // let dialogs = new Element('div', 'Dialogs')
    let dialogs = Object.create(Element)
    dialogs.type = 'div'
    dialogs.element = dialogs.register()
    dialogs.element.title = 'Dialogs'
    dialogs.addClass(['marky-dialogs', id])

    // let markyEditor = new Element('textarea', 'Marky Marked Editor')
    let markyEditor = Object.create(Element)
    markyEditor.type = 'textarea'
    markyEditor.element = markyEditor.register()
    markyEditor.element.title = 'Marky Marked Editor'
    markyEditor.addClass(['marky-editor', id])
    markyEditor.assign('_marky', new Marky(markyEditor.element, container))

    // let markyOutput = new Element('input', 'Marky Marked Output')
    let markyOutput = Object.create(Element)
    markyOutput.type = 'input'
    markyOutput.element = markyOutput.register()
    markyOutput.element.title = 'Marky Marked Output'
    markyOutput.assign('type', 'hidden')
    markyOutput.addClass(['marky-output', id])

    // let headingDialog = new HeadingDialog('div', 'Heading Dialog', id, markyEditor)
    // headingDialog.element.style.visibility = 'hidden'

    // let linkDialog = new LinkDialog('div', 'Link Dialog', id, markyEditor)
    // linkDialog.element.style.visibility = 'hidden'

    // let imageDialog = new ImageDialog('div', 'Image Dialog', id, markyEditor)
    // imageDialog.element.style.visibility = 'hidden'

    // let headingButton = new HeadingButton('button', 'Heading', id, headingDialog)
    let headingButton = Object.create(Button)
    headingButton.init('Headings', id, 'fa', 'fa-header')
    headingButton.listen('click', (e) => {
      e.preventDefault()
      this.element.blur()
      headingButton.dialog.classList.toggle('toggled')
      if (headingButton.dialog.style.visibility === 'hidden') {
        headingButton.dialog.style.visibility = 'visible'
        return
      }
      headingButton.dialog.style.visibility = 'hidden'
    })
    // headingButton.listen('click', function () {
    //   imageDialog.element.style.visibility = 'hidden'
    //   imageDialog.removeClass(['toggled'])
    //   linkDialog.element.style.visibility = 'hidden'
    //   linkDialog.removeClass(['toggled'])
    // })
    // let boldButton = new BoldButton('button', 'Bold', id, markyEditor)
    // let italicButton = new ItalicButton('button', 'Italic', id, markyEditor)
    // let strikethroughButton = new StrikethroughButton('button', 'Strikethrough', id, markyEditor)
    // let codeButton = new CodeButton('button', 'Code', id, markyEditor)
    // let blockquoteButton = new BlockquoteButton('button', 'Blockquote', id, markyEditor)
    let boldButton = Object.create(Button)
    boldButton.init('Bold', id, 'fa', 'fa-bold')
    boldButton.editor = markyEditor.element
    boldButton.listen('mousedown', (e) => {
      e.preventDefault()
      boldButton.editor.focus()
      return boldButton.addClass(['active'])
    })
    boldButton.listen('mouseup', () => {
      return boldButton.removeClass(['active'])
    })
    boldButton.listen('click', (e) => {
      e.preventDefault()
      boldButton.editor.focus()
      return boldButton.editor._marky.bold([boldButton.editor.selectionStart, boldButton.editor.selectionEnd])
    })

    let italicButton = Object.create(Button)
    italicButton.init('Italic', id, 'fa', 'fa-italic')
    italicButton.editor = markyEditor.element
    italicButton.listen('mousedown', (e) => {
      e.preventDefault()
      italicButton.editor.focus()
      return italicButton.addClass(['active'])
    })
    italicButton.listen('mouseup', () => {
      return italicButton.removeClass(['active'])
    })
    italicButton.listen('click', (e) => {
      e.preventDefault()
      italicButton.editor.focus()
      return italicButton.editor._marky.italic([italicButton.editor.selectionStart, italicButton.editor.selectionEnd])
    })

    let strikethroughButton = Object.create(Button)
    strikethroughButton.init('Italic', id, 'fa', 'fa-strikethrough')
    strikethroughButton.editor = markyEditor.element
    strikethroughButton.listen('mousedown', (e) => {
      e.preventDefault()
      strikethroughButton.editor.focus()
      return strikethroughButton.addClass(['active'])
    })
    strikethroughButton.listen('mouseup', () => {
      return strikethroughButton.removeClass(['active'])
    })
    strikethroughButton.listen('click', (e) => {
      e.preventDefault()
      strikethroughButton.editor.focus()
      return strikethroughButton.editor._marky.strikethrough([strikethroughButton.editor.selectionStart, strikethroughButton.editor.selectionEnd])
    })

    let codeButton = Object.create(Button)
    codeButton.init('Code', id, 'fa', 'fa-code')
    codeButton.editor = markyEditor.element
    codeButton.listen('mousedown', (e) => {
      e.preventDefault()
      codeButton.editor.focus()
      return codeButton.addClass(['active'])
    })
    codeButton.listen('mouseup', () => {
      return codeButton.removeClass(['active'])
    })
    codeButton.listen('click', (e) => {
      e.preventDefault()
      codeButton.editor.focus()
      return codeButton.editor._marky.code([codeButton.editor.selectionStart, codeButton.editor.selectionEnd])
    })

    let blockquoteButton = Object.create(Button)
    blockquoteButton.init('Blockquote', id, 'fa', 'fa-quote-right')
    blockquoteButton.editor = markyEditor.element
    blockquoteButton.listen('mousedown', (e) => {
      e.preventDefault()
      blockquoteButton.editor.focus()
      return blockquoteButton.addClass(['active'])
    })
    blockquoteButton.listen('mouseup', () => {
      return blockquoteButton.removeClass(['active'])
    })
    blockquoteButton.listen('click', (e) => {
      e.preventDefault()
      blockquoteButton.editor.focus()
      return blockquoteButton.editor._marky.blockquote([blockquoteButton.editor.selectionStart, blockquoteButton.editor.selectionEnd])
    })

    let linkButton = Object.create(Button)
    linkButton.init('Link', id, 'fa', 'fa-link')
    linkButton.editor = markyEditor.element
    linkButton.listen('mousedown', (e) => {
      e.preventDefault()
      linkButton.editor.focus()
      return linkButton.addClass(['active'])
    })
    linkButton.listen('mouseup', () => {
      return linkButton.removeClass(['active'])
    })
    linkButton.listen('click', (e) => {
      e.preventDefault()
      linkButton.editor.focus()
      // dialog.classList.toggle('toggled')
      // if (dialog.style.visibility === 'hidden') {
      //   dialog.children[0].children[1].value = linkButton.editor.value.substring(linkButton.editor.selectionStart, linkButton.editor.selectionEnd)
      //   dialog.style.visibility = 'visible'
      //   return
      // }
      // dialog.style.visibility = 'hidden'
    })

    let imageButton = Object.create(Button)
    imageButton.init('Image', id, 'fa', 'fa-file-image-o')
    imageButton.editor = markyEditor.element
    imageButton.listen('mousedown', (e) => {
      e.preventDefault()
      imageButton.editor.focus()
      return imageButton.addClass(['active'])
    })
    imageButton.listen('mouseup', () => {
      return imageButton.removeClass(['active'])
    })
    imageButton.listen('click', (e) => {
      e.preventDefault()
      imageButton.editor.focus()
      // dialog.classList.toggle('toggled')
      // if (dialog.style.visibility === 'hidden') {
      //   dialog.children[0].children[1].value = imageButton.editor.value.substring(imageButton.editor.selectionStart, imageButton.editor.selectionEnd)
      //   dialog.style.visibility = 'visible'
      //   return
      // }
      // dialog.style.visibility = 'hidden'
    })

    let unorderedListButton = Object.create(Button)
    unorderedListButton.init('Unordered List', id, 'fa', 'fa-list-ul')
    unorderedListButton.editor = markyEditor.element
    unorderedListButton.listen('mousedown', (e) => {
      e.preventDefault()
      unorderedListButton.editor.focus()
      return unorderedListButton.addClass(['active'])
    })
    unorderedListButton.listen('mouseup', () => {
      return unorderedListButton.removeClass(['active'])
    })
    unorderedListButton.listen('click', (e) => {
      e.preventDefault()
      unorderedListButton.editor.focus()
      return unorderedListButton.editor._marky.unorderedList([unorderedListButton.editor.selectionStart, unorderedListButton.editor.selectionEnd])
    })

    let orderedListButton = Object.create(Button)
    orderedListButton.init('Ordered List', id, 'fa', 'fa-list-ol')
    orderedListButton.editor = markyEditor.element
    orderedListButton.listen('mousedown', (e) => {
      e.preventDefault()
      orderedListButton.editor.focus()
      return orderedListButton.addClass(['active'])
    })
    orderedListButton.listen('mouseup', () => {
      return orderedListButton.removeClass(['active'])
    })
    orderedListButton.listen('click', (e) => {
      e.preventDefault()
      orderedListButton.editor.focus()
      return orderedListButton.editor._marky.orderedList([orderedListButton.editor.selectionStart, orderedListButton.editor.selectionEnd])
    })

    let outdentButton = Object.create(Button)
    outdentButton.init('Outdent', id, 'fa', 'fa-outdent')
    outdentButton.editor = markyEditor.element
    outdentButton.listen('mousedown', (e) => {
      e.preventDefault()
      outdentButton.editor.focus()
      return outdentButton.addClass(['active'])
    })
    outdentButton.listen('mouseup', () => {
      return outdentButton.removeClass(['active'])
    })
    outdentButton.listen('click', (e) => {
      e.preventDefault()
      outdentButton.editor.focus()
      return outdentButton.editor._marky.outdent([outdentButton.editor.selectionStart, outdentButton.editor.selectionEnd])
    })

    let indentButton = Object.create(Button)
    indentButton.init('Indent', id, 'fa', 'fa-indent')
    indentButton.editor = markyEditor.element
    indentButton.listen('mousedown', (e) => {
      e.preventDefault()
      indentButton.editor.focus()
      return indentButton.addClass(['active'])
    })
    indentButton.listen('mouseup', () => {
      return indentButton.removeClass(['active'])
    })
    indentButton.listen('click', (e) => {
      e.preventDefault()
      indentButton.editor.focus()
      return indentButton.editor._marky.indent([indentButton.editor.selectionStart, indentButton.editor.selectionEnd])
    })

    let undoButton = Object.create(Button)
    undoButton.init('Undo', id, 'fa', 'fa-backward')
    undoButton.editor = markyEditor.element
    undoButton.listen('mousedown', (e) => {
      e.preventDefault()
      undoButton.editor.focus()
      return undoButton.addClass(['active'])
    })
    undoButton.listen('mouseup', () => {
      return undoButton.removeClass(['active'])
    })
    undoButton.listen('click', (e) => {
      e.preventDefault()
      if (undoButton.element.classList.contains('disabled')) return
      undoButton.editor.focus()
      return undoButton.editor._marky.undo(1, undoButton.editor._marky.state, undoButton.editor._marky.index)
    })

    let redoButton = Object.create(Button)
    redoButton.init('Redo', id, 'fa', 'fa-forward')
    redoButton.editor = markyEditor.element
    redoButton.listen('mousedown', (e) => {
      e.preventDefault()
      redoButton.editor.focus()
      return redoButton.addClass(['active'])
    })
    redoButton.listen('mouseup', () => {
      return redoButton.removeClass(['active'])
    })
    redoButton.listen('click', (e) => {
      e.preventDefault()
      if (redoButton.element.classList.contains('disabled')) return
      redoButton.editor.focus()
      return redoButton.editor._marky.redo(1, redoButton.editor._marky.state, redoButton.editor._marky.index)
    })

    let fullscreenButton = Object.create(Button)
    fullscreenButton.init('Fullscreen', id, 'fa', 'fa-expand')
    fullscreenButton.editor = markyEditor.element
    fullscreenButton.listen('click', (e) => {
      e.preventDefault()
      fullscreenButton.element.blur()
      container.classList.toggle('fullscreen-toggled')
      fullscreenButton.editor.classList.toggle('fullscreen-toggled')
      fullscreenButton.element.classList.toggle('fullscreen-toggled')
      fullscreenButton.icon.element.classList.toggle('fa-expand')
      fullscreenButton.icon.element.classList.toggle('fa-compress')
      return
    })
    // let linkButton = new LinkButton('button', 'Link', id, [linkDialog, markyEditor])
    // linkButton.listen('click', function () {
    //   imageDialog.element.style.visibility = 'hidden'
    //   imageDialog.removeClass(['toggled'])
    //   headingDialog.element.style.visibility = 'hidden'
    //   headingDialog.removeClass(['toggled'])
    // })
    // let imageButton = new ImageButton('button', 'Image', id, [imageDialog, markyEditor])
    // imageButton.listen('click', function () {
    //   linkDialog.element.style.visibility = 'hidden'
    //   linkDialog.removeClass(['toggled'])
    //   headingDialog.element.style.visibility = 'hidden'
    //   headingDialog.removeClass(['toggled'])
    // })
    // let unorderedListButton = new UnorderedListButton('button', 'Unordered List', id, markyEditor)
    // let orderedListButton = new OrderedListButton('button', 'Ordered List', id, markyEditor)
    // let outdentButton = new OutdentButton('button', 'Outdent', id, markyEditor)
    // let indentButton = new IndentButton('button', 'Indent', id, markyEditor)
    // let undoButton = new UndoButton('button', 'Undo', id, markyEditor)
    // let redoButton = new RedoButton('button', 'Redo', id, markyEditor)
    // let fullscreenButton = new FullscreenButton('button', 'Fullscreen', id, [container, markyEditor])

    // let separatorA = new Element('span')
    // separatorA.addClass(['separator'])

    // let separatorB = new Element('span')
    // separatorB.addClass(['separator'])

    // let separatorC = new Element('span')
    // separatorC.addClass(['separator'])

    // let separatorD = new Element('span')
    // separatorD.addClass(['separator'])

    // let separatorE = new Element('span')
    // separatorE.addClass(['separator'])

    toolbar.appendTo(container)
    markyEditor.appendTo(container)
    markyOutput.appendTo(container)
    headingButton.appendTo(toolbar.element)
    // separatorA.appendTo(toolbar.element)
    boldButton.appendTo(toolbar.element)
    italicButton.appendTo(toolbar.element)
    strikethroughButton.appendTo(toolbar.element)
    codeButton.appendTo(toolbar.element)
    blockquoteButton.appendTo(toolbar.element)
    // separatorB.appendTo(toolbar.element)
    linkButton.appendTo(toolbar.element)
    imageButton.appendTo(toolbar.element)
    // separatorC.appendTo(toolbar.element)
    unorderedListButton.appendTo(toolbar.element)
    orderedListButton.appendTo(toolbar.element)
    outdentButton.appendTo(toolbar.element)
    indentButton.appendTo(toolbar.element)
    // separatorD.appendTo(toolbar.element)
    undoButton.appendTo(toolbar.element)
    redoButton.appendTo(toolbar.element)
    // separatorE.appendTo(toolbar.element)
    fullscreenButton.appendTo(toolbar.element)
    // dialogs.appendTo(toolbar.element)
    // linkDialog.appendTo(dialogs.element)
    // imageDialog.appendTo(dialogs.element)
    // headingDialog.appendTo(dialogs.element)

  //   markyEditor.listen('markyupdate', function (e) {
  //     this._marky.update(e.target.value, [e.target.selectionStart, e.target.selectionEnd], this._marky.state, this._marky.index)
  //     e.target.dispatchEvent(markychange)
  //   }, false)

  //   markyEditor.listen('markychange', function (e) {
  //     let html = this._marky.state[this._marky.index].html
  //     if (this._marky.index === 0) {
  //       undoButton.addClass(['disabled'])
  //     } else {
  //       undoButton.removeClass(['disabled'])
  //     }
  //     if (this._marky.index === this._marky.state.length - 1) {
  //       redoButton.addClass(['disabled'])
  //     } else {
  //       redoButton.removeClass(['disabled'])
  //     }
  //     e.target.nextSibling.value = html
  //   }, false)

  //   /**
  //    * Listen for input events, set timeout to update state, clear timeout from previous input
  //    */
  //   markyEditor.listen('input', function (e) {
  //     window.clearTimeout(timeoutID)
  //     timeoutID = window.setTimeout(() => {
  //       e.target.dispatchEvent(markyupdate)
  //     }, 1000)
  //   }, false)

  //   /**
  //    * Listen for change events (requires loss of focus) and update state
  //    */
  //   markyEditor.listen('change', function (e) {
  //     e.target.dispatchEvent(markyupdate)
  //   }, false)

  //   /**
  //    * Listen for pasting into the editor and update state
  //    */
  //   markyEditor.listen('paste', function (e) {
  //     setTimeout(() => {
  //       e.target.dispatchEvent(markyupdate)
  //     }, 0)
  //   }, false)

  //   /**
  //    * Listen for cutting from the editor and update state
  //    */
  //   markyEditor.listen('cut', function (e) {
  //     setTimeout(() => {
  //       e.target.dispatchEvent(markyupdate)
  //     }, 0)
  //   }, false)

  //   let deleteSelection = 0

  //   /**
  //    * Listen for keydown events, if key is delete key, set deleteSelection to length of selection
  //    */
  //   markyEditor.listen('keydown', function (e) {
  //     if (e.which === 8) deleteSelection = e.target.selectionEnd - e.target.selectionStart
  //   })

  //   let keyMap = [] // Used for determining whether or not to update state on space keyup
  //   let punctuations = [
  //     46, // period
  //     44, // comma
  //     63, // question mark
  //     33, // exclamation point
  //     58, // colon
  //     59, // semi-colon
  //     47, // back slash
  //     92, // forward slash
  //     38, // ampersand
  //     124, // vertical pipe
  //     32 // space
  //   ]

  //   /**
  //    * Listen for keyup events, if key is space or punctuation
  //    * (but not a space following punctuation or another space), update state and clear input timeout.
  //    */
  //   markyEditor.listen('keypress', function (e) {
  //     keyMap.push(e.which)
  //     if (keyMap.length > 2) keyMap.shift()
  //     punctuations.forEach((punctuation) => {
  //       if (e.which === 32 && keyMap[0] === punctuation) {
  //         return window.clearTimeout(timeoutID)
  //       }
  //       if (e.which === punctuation) {
  //         window.clearTimeout(timeoutID)
  //         return e.target.dispatchEvent(markyupdate)
  //       }
  //     })
  //   })

  //   /**
  //    * Listen for keyup events, if key is delete and it's a bulk selection, update state and clear input timeout.
  //    */
  //   markyEditor.listen('keyup', function (e) {
  //     if (e.which === 8 && deleteSelection > 0) {
  //       window.clearTimeout(timeoutID)
  //       deleteSelection = 0
  //       e.target.dispatchEvent(markyupdate)
  //     }
  //   })

  //   markyEditor.listen('select', function (e) {
  //     e.target.dispatchEvent(markyselect)
  //   })

  //   markyEditor.listen('blur', function (e) {
  //     e.target.dispatchEvent(markyblur)
  //   })

  //   markyEditor.listen('focus', function (e) {
  //     e.target.dispatchEvent(markyfocus)
  //   })

  //   markyEditor.listen('click', function () {
  //     imageDialog.element.style.visibility = 'hidden'
  //     imageDialog.removeClass(['toggled'])
  //     linkDialog.element.style.visibility = 'hidden'
  //     linkDialog.removeClass(['toggled'])
  //     headingDialog.element.style.visibility = 'hidden'
  //     headingDialog.removeClass(['toggled'])
  //   })
  })
}
