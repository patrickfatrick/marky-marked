'use strict'

import mark from './mark'
import * as dispatcher from './dispatcher'
import {markyupdate, markychange} from './custom-events'
import {inlineHandler, blockHandler, insertHandler, listHandler, indentHandler} from './handlers'

export var Marky = {
  init (container = null, editor = null, output = null) {
    this.mark = mark
    this.state = [{markdown: '', html: '', selection: [0, 0]}]
    this.index = 0
    this.editor = editor
    this.container = container
    this.output = output
  },

  /**
   * Removes the container and all descendants from the DOM
   * @param  {container} container the container used to invoke `mark()`
   */
  destroy (container = this.container) {
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
  },

  /**
   * Handles updating the state on forward-progress changes
   * @requires dispatcher/update
   * @param {String} markdown the new markdown blob
   * @param {Array}  state    the state timeline
   * @param {Number} index    current state index
   */
  update (markdown, selection = [0, 0], state = this.state, index = this.index, editor = this.editor) {
    const action = dispatcher.update(markdown, selection, state, index)
    this.state = action.state
    this.index = action.index
    editor.dispatchEvent(markychange)
    return this.index
  },

  /**
   * Handles updating the editor's value and selection range
   * @param  {Object} handled value = string; range = start and end of selection
   * @param  {HTMLElement} editor  the marky marked editor
   */
  updateEditor (markdown, range, editor = this.editor) {
    editor.value = markdown
    editor.setSelectionRange(range[0], range[1])
  },

  /**
   * Handles updating the hidden input's value
   * @param  {String} html   an HTML string
   * @param  {HTMLElement} output the hidden input storing the HTML string
   */
  updateOutput (html, output = this.output) {
    output.value = html
  },

  /**
   * Handles moving backward in state
   * @requires dispatcher/undo
   * @param   {Number}      num    number of states to move back
   * @param   {Array}       state  the state timeline
   * @param   {Number}      index  current state index
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Number}      the new index
   */
  undo (num = 1, state = this.state, index = this.index, editor = this.editor) {
    if (index === 0) return index

    const action = dispatcher.undo(num, state, index)
    this.index = action.index
    this.updateEditor(action.state.markdown, action.state.selection, editor)
    editor.dispatchEvent(markychange)
    return this.index
  },

  /**
   * Handles moving forward in state
   * @requires dispatcher/redo
   * @param   {Number}      num    number of states to move back
   * @param   {Array}       state  the state timeline
   * @param   {Number}      index  current state index
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Number}      the new index
   */
  redo (num = 1, state = this.state, index = this.index, editor = this.editor) {
    if (index === state.length - 1) return index

    const action = dispatcher.redo(num, state, index)
    this.index = action.index
    this.updateEditor(action.state.markdown, action.state.selection, editor)
    editor.dispatchEvent(markychange)
    return this.index
  },

  /**
   * Setsa the selection indices in the editor
   * @param   {Array}       arr    starting and ending indices
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Array}       the array that was passed in
   */
  setSelection (arr = [0, 0], editor = this.editor) {
    editor.setSelectionRange(arr[0], arr[1])
    return arr
  },

  /**
   * expands the selection to the right
   * @param   {Number}      num    number of characters to expand by
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Array}       the new selection indices
   */
  expandSelectionForward (num = 0, editor = this.editor) {
    const start = editor.selectionStart
    const end = editor.selectionEnd + num

    editor.setSelectionRange(start, end)
    return [start, end]
  },

  /**
   * expands the selection to the left
   * @param   {Number}      num    number of characters to expand by
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Array}       the new selection indices
   */
  expandSelectionBackward (num = 0, editor = this.editor) {
    const start = editor.selectionStart - num
    const end = editor.selectionEnd

    editor.setSelectionRange(start, end)
    return [start, end]
  },

  /**
   * expands the cursor to the right
   * @param   {Number}      num    number of characters to move by
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Array}       the new cursor position
   */
  moveCursorBackward (num = 0, editor = this.editor) {
    const start = editor.selectionStart - num

    editor.setSelectionRange(start, start)
    return start
  },

  /**
   * expands the cursor to the left
   * @param   {Number}      num    number of characters to move by
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Array}       the new cursor position
   */
  moveCursorForward (num = 0, editor = this.editor) {
    const start = editor.selectionStart + num

    editor.setSelectionRange(start, start)
    return start
  },

  /**
   * implements a bold on a selection
   * @requires handlers/inlineHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the bold
   */
  bold (indices, editor = this.editor) {
    indices = indices || [editor.selectionStart, editor.selectionEnd]
    let boldify = inlineHandler(editor.value, indices, '**')
    this.updateEditor(boldify.value, boldify.range, editor)
    editor.dispatchEvent(markyupdate)
    return [boldify.range[0], boldify.range[1]]
  },

  /**
   * implements an italic on a selection
   * @requires handlers/inlineHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the italic
   */
  italic (indices, editor = this.editor) {
    indices = indices || [editor.selectionStart, editor.selectionEnd]
    let italicize = inlineHandler(editor.value, indices, '_')
    this.updateEditor(italicize.value, italicize.range, editor)
    editor.dispatchEvent(markyupdate)
    return [italicize.range[0], italicize.range[1]]
  },

  /**
   * implements a strikethrough on a selection
   * @requires handlers/inlineHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the strikethrough
   */
  strikethrough (indices, editor = this.editor) {
    indices = indices || [editor.selectionStart, editor.selectionEnd]
    let strikitize = inlineHandler(editor.value, indices, '~~')
    this.updateEditor(strikitize.value, strikitize.range, editor)
    editor.dispatchEvent(markyupdate)
    return [strikitize.range[0], strikitize.range[1]]
  },

  /**
   * implements a code on a selection
   * @requires handlers/inlineHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the code
   */
  code (indices, editor = this.editor) {
    indices = indices || [editor.selectionStart, editor.selectionEnd]
    let codify = inlineHandler(editor.value, indices, '`')
    this.updateEditor(codify.value, codify.range, editor)
    editor.dispatchEvent(markyupdate)
    return [codify.range[0], codify.range[1]]
  },

  /**
   * implements a blockquote on a selection
   * @requires handlers/blockHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the bold
   */
  blockquote (indices, editor = this.editor) {
    indices = indices || [editor.selectionStart, editor.selectionEnd]
    let quotify = blockHandler(editor.value, indices, '> ')
    this.updateEditor(quotify.value, quotify.range, editor)
    editor.dispatchEvent(markyupdate)
    return [quotify.range[0], quotify.range[1]]
  },

  /**
   * implements a heading on a selection
   * @requires handlers/blockHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the heading
   */
  heading (value = 0, indices, editor = this.editor) {
    indices = indices || [editor.selectionStart, editor.selectionEnd]
    let markArr = []
    let mark
    for (let i = 1; i <= value; i++) {
      markArr.push('#')
    }
    mark = markArr.join('')
    let space = mark ? ' ' : ''
    let headingify = blockHandler(editor.value, indices, mark + space)
    this.updateEditor(headingify.value, headingify.range, editor)
    editor.dispatchEvent(markyupdate)
    return [headingify.range[0], headingify.range[1]]
  },

  /**
   * inserts a link snippet at the end of a selection
   * @requires handlers/insertHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the snippet is inserted
   */
  link (indices, url = 'http://url.com', display = 'http://url.com', editor = this.editor) {
    indices = indices || [editor.selectionStart, editor.selectionEnd]
    const mark = '[' + display + '](' + url + ')'
    let linkify = insertHandler(editor.value, indices, mark)
    this.updateEditor(linkify.value, linkify.range, editor)
    editor.dispatchEvent(markyupdate)
    return [linkify.range[0], linkify.range[1]]
  },

  /**
   * inserts an image snippet at the end of a selection
   * @requires handlers/insertHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the snippet is inserted
   */
  image (indices, source = 'http://imagesource.com/image.jpg', alt = 'http://imagesource.com/image.jpg', editor = this.editor) {
    indices = indices || [editor.selectionStart, editor.selectionEnd]
    const mark = '![' + alt + '](' + source + ')'
    let imageify = insertHandler(editor.value, indices, mark)
    this.updateEditor(imageify.value, imageify.range, editor)
    editor.dispatchEvent(markyupdate)
    return [imageify.range[0], imageify.range[1]]
  },

  /**
   * implements an unordered list on a selection
   * @requires handlers/listHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the list is implemented
   */
  unorderedList (indices, editor = this.editor) {
    indices = indices || [editor.selectionStart, editor.selectionEnd]
    let listify = listHandler(editor.value, indices, 'ul')
    this.updateEditor(listify.value, listify.range, editor)
    editor.dispatchEvent(markyupdate)
    return [listify.range[0], listify.range[1]]
  },

  /**
   * implements an ordered list on a selection
   * @requires handlers/listHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the list is implemented
   */
  orderedList (indices, editor = this.editor) {
    indices = indices || [editor.selectionStart, editor.selectionEnd]
    let listify = listHandler(editor.value, indices, 'ol')
    this.updateEditor(listify.value, listify.range, editor)
    editor.dispatchEvent(markyupdate)
    return [listify.range[0], listify.range[1]]
  },

  /**
   * implements an indent on a selection
   * @requires handlers/indentHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the indent is implemented
   */
  indent (indices, editor = this.editor) {
    indices = indices || [editor.selectionStart, editor.selectionEnd]
    let indentify = indentHandler(editor.value, indices, 'in')
    this.updateEditor(indentify.value, indentify.range, editor)
    editor.dispatchEvent(markyupdate)
    return [indentify.range[0], indentify.range[1]]
  },

  /**
   * implements an outdent on a selection
   * @requires handlers/indentHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the outdent is implemented
   */
  outdent (indices, editor = this.editor) {
    indices = indices || [editor.selectionStart, editor.selectionEnd]
    let indentify = indentHandler(editor.value, indices, 'out')
    this.updateEditor(indentify.value, indentify.range, editor)
    editor.dispatchEvent(markyupdate)
    return [indentify.range[0], indentify.range[1]]
  }
}
