import {Element} from './Element';

/**
 * Creates HTML button elements
 * @class
 * @requires Element
 * @param {String}			type		tag name for the element
 * @param {String}			title		title for the element
 * @param {String}			id			editor ID to associate with the element
 * @param {HTMLElement}	relevant	element this element should have access to
 */

export class HeadingButton extends Element {
	constructor (type, title, id, relevant) {
		super(type || 'button', title || 'Headings', id, relevant);
		super.addClass([this.title, id]);
		super.assign('value', title);
		let icon = new Element('i');
		let dialog = this.relevant.element;
		icon.addClass(['fa', 'fa-header']);
		icon.appendTo(this.element);
		super.listen('click', e => {
			e.preventDefault();
			this.element.blur();
			dialog.classList.toggle('toggled');
			if (dialog.style.visibility === 'hidden') return dialog.style.visibility = 'visible';
			return dialog.style.visibility = 'hidden';
		});
	}
}

export class BoldButton extends Element {
	constructor (type, title, id, relevant) {
		super(type || 'button', title || 'Bold', id, relevant);
		super.addClass([this.title, id]);
		super.assign('value', title);
		let editor = this.relevant.element;
		let icon = new Element('i');
		icon.addClass(['fa', 'fa-bold']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
			return super.addClass(['active']);
		});
		super.listen('mouseup', () => {
			return super.removeClass(['active']);
		});
		super.listen('click', e => {
			e.preventDefault();
			editor.focus();
			return editor._marky.bold([editor.selectionStart, editor.selectionEnd]);
		});
	}
}

export class ItalicButton extends Element {
	constructor (type, title, id, relevant) {
		super(type || 'button', title || 'Italic', id, relevant);
		super.addClass([this.title, id]);
		super.assign('value', title);
		let editor = this.relevant.element;
		let icon = new Element('i');
		icon.addClass(['fa', 'fa-italic']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
			return super.addClass(['active']);
		});
		super.listen('mouseup', () => {
			return super.removeClass(['active']);
		});
		super.listen('click', e => {
			e.preventDefault();
			editor.focus();
			return editor._marky.italic([editor.selectionStart, editor.selectionEnd]);
		});
	}
}

export class StrikethroughButton extends Element {
	constructor (type, title, id, relevant) {
		super(type || 'button', title || 'Strikethrough', id, relevant);
		super.addClass([this.title, id]);
		super.assign('value', title);
		let icon = new Element('i');
		let editor = this.relevant.element;
		icon.addClass(['fa', 'fa-strikethrough']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
			return super.addClass(['active']);
		});
		super.listen('mouseup', () => {
			return super.removeClass(['active']);
		});
		super.listen('click', e => {
			e.preventDefault();
			editor.focus();
			return editor._marky.strikethrough([editor.selectionStart, editor.selectionEnd]);
		});
	}
}

export class CodeButton extends Element {
	constructor (type, title, id, relevant) {
		super(type || 'button', title || 'Code', id, relevant);
		super.addClass([this.title, id]);
		super.assign('value', title);
		let icon = new Element('i');
		let editor = this.relevant.element;
		icon.addClass(['fa', 'fa-code']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
			return super.addClass(['active']);
		});
		super.listen('mouseup', () => {
			return super.removeClass(['active']);
		});
		super.listen('click', e => {
			e.preventDefault();
			editor.focus();
			return editor._marky.code([editor.selectionStart, editor.selectionEnd]);
		});
	}
}

export class BlockquoteButton extends Element {
	constructor (type, title, id, relevant) {
		super(type || 'button', title || 'Blockquote', id, relevant);
		super.addClass([this.title, id]);
		super.assign('value', title);
		let icon = new Element('i');
		let editor = this.relevant.element;
		icon.addClass(['fa', 'fa-quote-right']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
			return super.addClass(['active']);
		});
		super.listen('mouseup', () => {
			return super.removeClass(['active']);
		});
		super.listen('click', e => {
			e.preventDefault();
			editor.focus();
			return editor._marky.blockquote([editor.selectionStart, editor.selectionEnd]);
		});
	}
}

export class LinkButton extends Element {
	constructor (type, title, id, relevant) {
		super(type || 'button', title || 'Link', id, relevant);
		super.addClass([this.title, id]);
		super.assign('value', title);
		let icon = new Element('i');
		let dialog = this.relevant[0].element;
		let editor = this.relevant[1].element;
		icon.addClass(['fa', 'fa-link']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
			return super.addClass(['active']);
		});
		super.listen('mouseup', () => {
			return super.removeClass(['active']);
		});
		super.listen('click', e => {
			e.preventDefault();
			editor.focus();
			dialog.classList.toggle('toggled');
			if (dialog.style.visibility === 'hidden') {
				dialog.children[0].children[1].value = editor.value.substring(editor.selectionStart, editor.selectionEnd);
				return dialog.style.visibility = 'visible';
			}
			return dialog.style.visibility = 'hidden';
		});
	}
}

export class ImageButton extends Element {
	constructor (type, title, id, relevant) {
		super(type || 'button', title || 'Image', id, relevant);
		super.addClass([this.title, id]);
		super.assign('value', title);
		let icon = new Element('i');
		let dialog = this.relevant[0].element;
		let editor = this.relevant[1].element;
		icon.addClass(['fa', 'fa-file-image-o']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
			return super.addClass(['active']);
		});
		super.listen('mouseup', () => {
			return super.removeClass(['active']);
		});
		super.listen('click', e => {
			e.preventDefault();
			editor.focus();
			dialog.classList.toggle('toggled');
			if (dialog.style.visibility === 'hidden') {
				dialog.children[0].children[1].value = editor.value.substring(editor.selectionStart, editor.selectionEnd);
				return dialog.style.visibility = 'visible';
			}
			return dialog.style.visibility = 'hidden';
		});
	}
}

export class UnorderedListButton extends Element {
	constructor (type, title, id, relevant) {
		super(type || 'button', title || 'Unordered List', id, relevant);
		super.addClass([this.title, id]);
		super.assign('value', title);
		let icon = new Element('i');
		let editor = this.relevant.element;
		icon.addClass(['fa', 'fa-list-ul']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
			return super.addClass(['active']);
		});
		super.listen('mouseup', () => {
			return super.removeClass(['active']);
		});
		super.listen('click', e => {
			e.preventDefault();
			editor.focus();
			return editor._marky.unorderedList([editor.selectionStart, editor.selectionEnd]);
		});
	}
}

export class OrderedListButton extends Element {
	constructor (type, title, id, relevant) {
		super(type || 'button', title || 'Ordered List', id, relevant);
		super.addClass([this.title, id]);
		super.assign('value', title);
		let icon = new Element('i');
		let editor = this.relevant.element;
		icon.addClass(['fa', 'fa-list-ol']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
			return super.addClass(['active']);
		});
		super.listen('mouseup', () => {
			return super.removeClass(['active']);
		});
		super.listen('click', e => {
			e.preventDefault();
			editor.focus();
			return editor._marky.orderedList([editor.selectionStart, editor.selectionEnd]);
		});
	}
}

export class IndentButton extends Element {
	constructor (type, title, id, relevant) {
		super(type || 'button', title || 'Indent', id, relevant);
		super.addClass([this.title, id]);
		super.assign('value', title);
		let icon = new Element('i');
		let editor = this.relevant.element;
		icon.addClass(['fa', 'fa-indent']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
			return super.addClass(['active']);
		});
		super.listen('mouseup', () => {
			return super.removeClass(['active']);
		});
		super.listen('click', e => {
			e.preventDefault();
			editor.focus();
			return editor._marky.indent([editor.selectionStart, editor.selectionEnd]);
		});
	}
}

export class OutdentButton extends Element {
	constructor (type, title, id, relevant) {
		super(type || 'button', title || 'Outdent', id, relevant);
		super.addClass([this.title, id]);
		super.assign('value', title);
		let icon = new Element('i');
		let editor = this.relevant.element;
		icon.addClass(['fa', 'fa-outdent']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
			return super.addClass(['active']);
		});
		super.listen('mouseup', () => {
			return super.removeClass(['active']);
		});
		super.listen('click', e => {
			e.preventDefault();
			editor.focus();
			return editor._marky.outdent([editor.selectionStart, editor.selectionEnd]);
		});
	}
}

export class UndoButton extends Element {
	constructor (type, title, id, relevant) {
		super(type || 'button', title || 'Undo', id, relevant);
		super.addClass([this.title, id]);
		super.assign('value', title);
		let icon = new Element('i');
		let editor = this.relevant.element;
		icon.addClass(['fa', 'fa-backward']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
			return super.addClass(['active']);
		});
		super.listen('mouseup', () => {
			return super.removeClass(['active']);
		});
		super.listen('click', e => {
			e.preventDefault();
			if (this.element.classList.contains('disabled')) return;
			editor.focus();
			return editor._marky.undo(1, editor._marky.state, editor._marky.index);
		});
	}
}

export class RedoButton extends Element {
	constructor (type, title, id, relevant) {
		super(type || 'button', title || 'Redo', id, relevant);
		super.addClass([this.title, id]);
		super.assign('value', title);
		let icon = new Element('i');
		let editor = this.relevant.element;
		icon.addClass(['fa', 'fa-forward']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
			return super.addClass(['active']);
		});
		super.listen('mouseup', () => {
			return super.removeClass(['active']);
		});
		super.listen('click', e => {
			e.preventDefault();
			if (this.element.classList.contains('disabled')) return;
			editor.focus();
			return editor._marky.redo(1, editor._marky.state, editor._marky.index);
		});
	}
}

export class FullscreenButton extends Element {
	constructor (type, title, id, relevant) {
		super(type || 'button', title || 'Image', id, relevant);
		super.addClass([this.title, id]);
		super.assign('value', title);
		let icon = new Element('i');
		let container = this.relevant[0];
		let editor = this.relevant[1].element;
		icon.addClass(['fa', 'fa-expand']);
		icon.appendTo(this.element);
		super.listen('click', e => {
			e.preventDefault();
			this.element.blur();
			container.classList.toggle('fullscreen-toggled');
			editor.classList.toggle('fullscreen-toggled');
			this.element.classList.toggle('fullscreen-toggled');
			icon.element.classList.toggle('fa-expand');
			icon.element.classList.toggle('fa-compress');
			return;
		});
	}
}
