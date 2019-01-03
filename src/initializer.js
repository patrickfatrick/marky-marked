import { emitter } from 'contra';
import { hashish } from 'harsh';
import Marky from './Marky';
import Element from './elements/Element';
import Button from './elements/Button';
import LinkDialog from './elements/LinkDialog';
import ImageDialog from './elements/ImageDialog';
import HeadingDialog from './elements/HeadingDialog';
import Separator from './elements/Separator';

/**
 * Register and append the DOM elements needed and set the event listeners
 * @param   {HTMLElement}  container empty element to initialize marky marked into
 */
export default (container) => {
  if (!(container instanceof HTMLElement)) {
    throw new TypeError('argument should be an HTMLElement');
  }

  /**
     * Ignore container if it's not empty
     */
  if (container.children.length) {
    return null;
  }

  const id = `marky-mark-${hashish()}`;
  container.id = id; // eslint-disable-line no-param-reassign

  /**
     * Create and register main elements:
     * toolbar, editor, dialog container, hidden input
     */

  const toolbar = new Element('div', { title: 'Toolbar' }).addClass('marky-toolbar', id);
  const dialogs = new Element('div', { title: 'Dialogs' }).addClass('marky-dialogs', id);
  const markyEditor = new Element('textarea', { title: 'Marky Marked Editor' })
    .addClass('marky-editor', id);

  const marky = emitter(new Marky(id, container, markyEditor));
  container.marky = marky; // eslint-disable-line no-param-reassign

  /**
     * Create and register dialogs and set listeners
     */

  marky.elements.dialogs = {
    heading: new HeadingDialog(id),
    link: new LinkDialog(id),
    image: new ImageDialog(id),
  };

  Object.entries(marky.elements.dialogs).forEach(([dialogName, dialog]) => {
    if (dialogName === 'heading') {
      dialog.options.forEach((option) => {
        option.listen('click', (e) => {
          e.preventDefault();
          const value = parseInt(e.target.value, 10);
          markyEditor.element.focus();
          dialog.removeClass('toggled');
          marky.heading(
            value,
            [markyEditor.element.selectionStart, markyEditor.element.selectionEnd],
          );
        });
      });
    } else {
      dialog.form.listen('submit', (e) => {
        e.preventDefault();
        markyEditor.element.focus();
        const url = dialog.urlInput.element.value.slice(0) || 'http://url.com';
        const name = dialog.nameInput.element.value.slice(0) || url;
        dialog.removeClass('toggled');
        marky[dialogName](
          [markyEditor.element.selectionStart, markyEditor.element.selectionEnd],
          url,
          name,
        );
      });
    }
  });

  /**
     * Create and register toolbar buttons and set listeners
     */

  function buttonMousedown(e) {
    e.preventDefault();
    markyEditor.element.focus();
  }

  function buttonClick(button, name) {
    if (button.classList.contains('disabled')) return;
    if (['undo', 'redo'].includes(name)) {
      marky[name]();
    } else {
      marky[name]([markyEditor.element.selectionStart, markyEditor.element.selectionEnd]);
    }
  }

  marky.elements.buttons = {
    heading: new Button(id, 'Heading', 'fa', 'fa-header')
      .addClass('marky-border-left', 'marky-border-right'),
    bold: new Button(id, 'Bold', 'fa', 'fa-bold').addClass('marky-border-left'),
    italic: new Button(id, 'Italic', 'fa', 'fa-italic'),
    strikethrough: new Button(id, 'Strikethrough', 'fa', 'fa-strikethrough'),
    code: new Button(id, 'Code', 'fa', 'fa-code'),
    blockquote: new Button(id, 'Blockquote', 'fa', 'fa-quote-right').addClass('marky-border-right'),
    link: new Button(id, 'Link', 'fa', 'fa-link').addClass('marky-border-left'),
    image: new Button(id, 'Image', 'fa', 'fa-file-image-o').addClass('marky-border-right'),
    unorderedList: new Button(id, 'Unordered List', 'fa', 'fa-list-ul')
      .addClass('marky-border-left'),
    orderedList: new Button(id, 'Ordered List', 'fa', 'fa-list-ol'),
    outdent: new Button(id, 'Outdent', 'fa', 'fa-outdent'),
    indent: new Button(id, 'Indent', 'fa', 'fa-indent').addClass('marky-border-right'),
    undo: new Button(id, 'Undo', 'fa', 'fa-backward').addClass('marky-border-left'),
    redo: new Button(id, 'Redo', 'fa', 'fa-forward').addClass('marky-border-right'),
    expand: new Button(id, 'Expand', 'fa', 'fa-expand').addClass('marky-border-left', 'marky-border-right'),
  };

  Object.entries(marky.elements.buttons).forEach(([buttonName, button]) => {
    button.listen('mousedown', buttonMousedown);
    if (Object.keys(marky.elements.dialogs).includes(buttonName)) {
      // eslint-disable-next-line no-param-reassign
      button.dialog = marky.elements.dialogs[buttonName].element;
      button.listen('click', () => {
        Object.keys(marky.elements.dialogs).forEach((dialogName) => {
          if (dialogName === buttonName) marky.elements.dialogs[buttonName].toggleClass('toggled');
          else marky.elements.dialogs[dialogName].removeClass('toggled');
        });

        if (
          (buttonName === 'link'
            || buttonName === 'image')
            && button.dialog.classList.contains('toggled')
        ) {
          // eslint-disable-next-line no-param-reassign
          button.dialog.children[0].children[1].value = markyEditor.element.value.substring(
            markyEditor.element.selectionStart,
            markyEditor.element.selectionEnd,
          );
        }
      });
    } else if (buttonName === 'expand') {
      button.listen('click', () => {
        container.classList.toggle('marky-expanded');
        button.toggleClass('marky-expanded');
        markyEditor.toggleClass('marky-expanded');
        button.icon.toggleClass('fa-expand');
        button.icon.toggleClass('fa-compress');
      });
    } else {
      button.listen('click', e => buttonClick(e.currentTarget, buttonName));
    }
  });

  /**
     * Insert elements into the DOM one by one to ensure order
     */

  toolbar.appendTo(container);
  markyEditor.appendTo(container);
  toolbar.appendElements([
    marky.elements.buttons.heading,
    new Separator(),
    marky.elements.buttons.bold,
    marky.elements.buttons.italic,
    marky.elements.buttons.strikethrough,
    marky.elements.buttons.code,
    marky.elements.buttons.blockquote,
    new Separator(),
    marky.elements.buttons.link,
    marky.elements.buttons.image,
    new Separator(),
    marky.elements.buttons.unorderedList,
    marky.elements.buttons.orderedList,
    marky.elements.buttons.outdent,
    marky.elements.buttons.indent,
    new Separator(),
    marky.elements.buttons.undo,
    marky.elements.buttons.redo,
    new Separator(),
    marky.elements.buttons.expand,
    dialogs,
  ]);
  dialogs.appendElements([
    marky.elements.dialogs.link,
    marky.elements.dialogs.image,
    marky.elements.dialogs.heading,
  ]);

  /**
     * Listeners for the editor
     */

  let timeoutID; // Used input events
  let deleteSelection = 0; // Used for determing how to update state with deletions
  const keyMap = []; // Used for determining whether or not to update state on space keyup
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
    32, // space
  ];

  /**
     * Listen for input events, set timeout to update state, clear timeout from previous input
     */
  markyEditor.listen('input', () => {
    window.clearTimeout(timeoutID);
    timeoutID = window.setTimeout(() => {
      marky.emit('markyupdate');
    }, 1000);
  });

  /**
     * Listen for change events (requires loss of focus) and update state
     */
  markyEditor.listen('change', () => {
    marky.emit('markyupdate');
  });

  /**
     * Listen for pasting into the editor and update state
     */
  markyEditor.listen('paste', () => {
    setTimeout(() => {
      marky.emit('markyupdate');
    }, 0);
  });

  /**
     * Listen for cutting from the editor and update state
     */
  markyEditor.listen('cut', () => {
    setTimeout(() => {
      marky.emit('markyupdate');
    }, 0);
  });

  /**
     * Listen for keydown events,
     * if key is delete key,
     * set deleteSelection to length of selection
     */
  markyEditor.listen('keydown', (e) => {
    if (e.which === 8) {
      deleteSelection = e.currentTarget.selectionEnd - e.currentTarget.selectionStart;
    }
  });

  /**
     * Listen for keyup events,
     * if key is space or punctuation (but not a space following punctuation or another space),
     * update state and clear input timeout.
     */
  markyEditor.listen('keypress', (e) => {
    keyMap.push(e.which);
    if (keyMap.length > 2) keyMap.shift();
    punctuations.forEach((punctuation) => { // eslint-disable-line consistent-return
      if (e.which === 32 && keyMap[0] === punctuation) {
        return window.clearTimeout(timeoutID);
      }
      if (e.which === punctuation) {
        window.clearTimeout(timeoutID);
        return marky.emit('markyupdate');
      }
    });
  });

  /**
     * Listen for keyup events,
     * if key is delete and it's a bulk selection,
     * update state and clear input timeout.
     */
  markyEditor.listen('keyup', (e) => {
    if (e.which === 8 && deleteSelection > 0) {
      window.clearTimeout(timeoutID);
      deleteSelection = 0;
      marky.emit('markyupdate');
    }
  });

  markyEditor.listen('click', () => {
    marky.elements.dialogs.image.removeClass('toggled');
    marky.elements.dialogs.link.removeClass('toggled');
    marky.elements.dialogs.heading.removeClass('toggled');
  });

  /**
     * The following just emit a marky event.
     */
  markyEditor.listen('select', () => marky.emit('markyselect'));
  markyEditor.listen('blur', () => marky.emit('markyblur'));
  markyEditor.listen('focus', () => marky.emit('markyfocus'));

  /**
   * Listeners for the marky instance
   */

  marky.on('markyupdate', () => {
    marky.update(
      markyEditor.element.value,
      [markyEditor.element.selectionStart, markyEditor.element.selectionEnd],
    );
  });

  marky.on('markychange', () => {
    if (marky.store.index === 0) {
      marky.elements.buttons.undo.addClass('disabled');
    } else {
      marky.elements.buttons.undo.removeClass('disabled');
    }
    if (marky.store.index === marky.store.timeline.length - 1) {
      marky.elements.buttons.redo.addClass('disabled');
    } else {
      marky.elements.buttons.redo.removeClass('disabled');
    }
  });

  return marky;
};
