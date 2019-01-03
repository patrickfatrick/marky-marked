import Store from './Store';
import {
  inlineHandler, blockHandler, insertHandler, listHandler, indentHandler,
} from './utils/markdownHandlers';

export default class Marky {
  constructor(id, container, editor) {
    this.id = id;
    this.editor = editor.element;
    this.container = container;
    this.store = new Store([
      {
        markdown: '',
        html: '',
        selection: [0, 0],
      },
    ]);
    this.elements = {
      dialogs: {},
      buttons: {},
      editor,
    };

    return this;
  }

  get state() {
    return this.store.state;
  }

  get html() {
    return this.state.html;
  }

  get markdown() {
    return this.state.markdown;
  }

  get selection() {
    return this.state.selection;
  }

  /**
   * Removes the container and all descendants from the DOM
   * @param  {container} container the container used to invoke `mark()`
   */
  destroy(container = this.container) {
    // Remove all listeners from all elements
    this.removeListeners(this.elements);

    // Reset elements contained in this instance to remove from memory
    this.elements = {
      dialogs: {},
      buttons: {},
      editor: null,
    };
    this.editor = null;
    this.container = null;

    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }

  /**
   * Handles the `markyupdate` event
   * @param {String}    markdown  the new markdown blob
   * @param {Number[]}  selection selectionStart and selectionEnd indices
   */
  update(markdown, selection = [0, 0]) {
    this.store.update(markdown, selection);
    this.emit('markychange');
    return this.store.index;
  }

  /**
   * Handles moving backward in state
   * @param   {Number}      num    number of states to move back
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Number}      the new index
   */
  undo(num = 1, editor = this.editor) {
    this.store.undo(num);
    this.updateEditor(this.store.state.markdown, this.store.state.selection, editor);
    this.emit('markychange');
    return this.store.index;
  }

  /**
   * Handles moving forward in state
   * @param   {Number}      num    number of states to move forward
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Number}      the new index
   */
  redo(num = 1, editor = this.editor) {
    this.store.redo(num);
    this.updateEditor(this.store.state.markdown, this.store.state.selection, editor);
    this.emit('markychange');
    return this.store.index;
  }

  /**
   * Sets the selection indices in the editor
   * @param   {Number[]}    arr    starting and ending indices
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Number[]}    the array that was passed in
   */
  setSelection(arr = [0, 0], editor = this.editor) {
    editor.setSelectionRange(arr[0], arr[1]);
    return arr;
  }

  /**
   * expands the selection to the right
   * @param   {Number}      num    number of characters to expand by
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Number[]}    the new selection indices
   */
  expandSelectionForward(num = 0, editor = this.editor) {
    const start = editor.selectionStart;
    const end = editor.selectionEnd + num;

    editor.setSelectionRange(start, end);
    return [start, end];
  }

  /**
   * expands the selection to the left
   * @param   {Number}      num    number of characters to expand by
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Number[]}    the new selection indices
   */
  expandSelectionBackward(num = 0, editor = this.editor) {
    const start = editor.selectionStart - num;
    const end = editor.selectionEnd;

    editor.setSelectionRange(start, end);
    return [start, end];
  }

  /**
   * expands the cursor to the right
   * @param   {Number}      num    number of characters to move by
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Number}      the new cursor position
   */
  moveCursorBackward(num = 0, editor = this.editor) {
    const start = editor.selectionStart - num;

    editor.setSelectionRange(start, start);
    return start;
  }

  /**
   * expands the cursor to the left
   * @param   {Number}      num    number of characters to move by
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Number}      the new cursor position
   */
  moveCursorForward(num = 0, editor = this.editor) {
    const start = editor.selectionStart + num;

    editor.setSelectionRange(start, start);
    return start;
  }

  /**
   * implements a bold on a selection
   * @requires handlers/inlineHandler
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the bold
   */
  bold(indices = [this.editor.selectionStart, this.editor.selectionEnd], editor = this.editor) {
    const boldify = inlineHandler(editor.value, indices, '**');
    this.updateEditor(boldify.value, boldify.range, editor);
    this.emit('markyupdate');
    return [boldify.range[0], boldify.range[1]];
  }

  /**
   * implements an italic on a selection
   * @requires handlers/inlineHandler
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the italic
   */
  italic(indices = [this.editor.selectionStart, this.editor.selectionEnd], editor = this.editor) {
    const italicize = inlineHandler(editor.value, indices, '_');
    this.updateEditor(italicize.value, italicize.range, editor);
    this.emit('markyupdate');
    return [italicize.range[0], italicize.range[1]];
  }

  /**
   * implements a strikethrough on a selection
   * @requires handlers/inlineHandler
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the strikethrough
   */
  strikethrough(
    indices = [this.editor.selectionStart, this.editor.selectionEnd],
    editor = this.editor,
  ) {
    const strikitize = inlineHandler(editor.value, indices, '~~');
    this.updateEditor(strikitize.value, strikitize.range, editor);
    this.emit('markyupdate');
    return [strikitize.range[0], strikitize.range[1]];
  }

  /**
   * implements a code on a selection
   * @requires handlers/inlineHandler
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the code
   */
  code(indices = [this.editor.selectionStart, this.editor.selectionEnd], editor = this.editor) {
    const codify = inlineHandler(editor.value, indices, '`');
    this.updateEditor(codify.value, codify.range, editor);
    this.emit('markyupdate');
    return [codify.range[0], codify.range[1]];
  }

  /**
   * implements a blockquote on a selection
   * @requires handlers/blockHandler
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the bold
   */
  blockquote(
    indices = [this.editor.selectionStart, this.editor.selectionEnd],
    editor = this.editor,
  ) {
    const quotify = blockHandler(editor.value, indices, '> ');
    this.updateEditor(quotify.value, quotify.range, editor);
    this.emit('markyupdate');
    return [quotify.range[0], quotify.range[1]];
  }

  /**
   * implements a heading on a selection
   * @requires handlers/blockHandler
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the heading
   */
  heading(
    value = 0,
    indices = [this.editor.selectionStart, this.editor.selectionEnd],
    editor = this.editor,
  ) {
    const markArr = [];

    for (let i = 1; i <= value; i += 1) {
      markArr.push('#');
    }
    const mark = markArr.join('');
    const space = mark ? ' ' : '';
    const headingify = blockHandler(editor.value, indices, mark + space);
    this.updateEditor(headingify.value, headingify.range, editor);
    this.emit('markyupdate');
    return [headingify.range[0], headingify.range[1]];
  }

  /**
   * inserts a link snippet at the end of a selection
   * @requires handlers/insertHandler
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the snippet is inserted
   */
  link(
    indices = [this.editor.selectionStart, this.editor.selectionEnd],
    url = 'http://url.com',
    display = 'http://url.com',
    editor = this.editor,
  ) {
    const mark = `[${display}](${url})`;
    const linkify = insertHandler(editor.value, indices, mark);
    this.updateEditor(linkify.value, linkify.range, editor);
    this.emit('markyupdate');
    return [linkify.range[0], linkify.range[1]];
  }

  /**
   * inserts an image snippet at the end of a selection
   * @requires handlers/insertHandler
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the snippet is inserted
   */
  image(
    indices = [this.editor.selectionStart, this.editor.selectionEnd],
    source = 'http://imagesource.com/image.jpg',
    alt = 'http://imagesource.com/image.jpg',
    editor = this.editor,
  ) {
    const mark = `![${alt}](${source})`;
    const imageify = insertHandler(editor.value, indices, mark);
    this.updateEditor(imageify.value, imageify.range, editor);
    this.emit('markyupdate');
    return [imageify.range[0], imageify.range[1]];
  }

  /**
   * implements an unordered list on a selection
   * @requires handlers/listHandler
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the list is implemented
   */
  unorderedList(
    indices = [this.editor.selectionStart, this.editor.selectionEnd],
    editor = this.editor,
  ) {
    const listify = listHandler(editor.value, indices, 'ul');
    this.updateEditor(listify.value, listify.range, editor);
    this.emit('markyupdate');
    return [listify.range[0], listify.range[1]];
  }

  /**
   * implements an ordered list on a selection
   * @requires handlers/listHandler
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the list is implemented
   */
  orderedList(
    indices = [this.editor.selectionStart, this.editor.selectionEnd],
    editor = this.editor,
  ) {
    const listify = listHandler(editor.value, indices, 'ol');
    this.updateEditor(listify.value, listify.range, editor);
    this.emit('markyupdate');
    return [listify.range[0], listify.range[1]];
  }

  /**
   * implements an indent on a selection
   * @requires handlers/indentHandler
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the indent is implemented
   */
  indent(indices = [this.editor.selectionStart, this.editor.selectionEnd], editor = this.editor) {
    const indentify = indentHandler(editor.value, indices, 'in');
    this.updateEditor(indentify.value, indentify.range, editor);
    this.emit('markyupdate');
    return [indentify.range[0], indentify.range[1]];
  }

  /**
   * implements an outdent on a selection
   * @requires handlers/indentHandler
   * @param   {Number[]}    indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Number[]}    the new selection after the outdent is implemented
   */
  outdent(indices = [this.editor.selectionStart, this.editor.selectionEnd], editor = this.editor) {
    const indentify = indentHandler(editor.value, indices, 'out');
    this.updateEditor(indentify.value, indentify.range, editor);
    this.emit('markyupdate');
    return [indentify.range[0], indentify.range[1]];
  }

  /**
   * @private
   * Handles updating the editor's value and selection range
   * @param  {Object} handled value = string; range = start and end of selection
   * @param  {HTMLElement} editor  the marky marked editor
   */
  updateEditor(markdown, range, editor = this.editor) {
    editor.value = markdown; // eslint-disable-line no-param-reassign
    editor.setSelectionRange(range[0], range[1]);
  }

  /**
   * @private
   * Rescursively searches an object for elements and removes their listeners
   * @param  {Object} obj plain object (used only with the `elements` object in Marky)
   */
  removeListeners(obj) {
    Object.values(obj).forEach((value) => {
      if (value.removeListeners) {
        value.removeListeners();
      } else {
        this.removeListeners(value);
      }
    });
  }
}
