import {Element} from './Element';

/**
 * Creates HTML button elements
 * @class
 * @requires Element
 * @param {String}			type		tag name for the element
 * @param {String}			title		title for the element
 * @param {String}			id			editor ID to associate with the element
 * @param {HTMLElement}	parent	element this element should have access to
 */

export class BoldButton extends Element {
	constructor (type, title, id, parent) {
		super(type || 'button', title || 'Bold', id, parent);
		super.addClass([this.title, id]);
		let editor = this.parent.element;
		let icon = new Element('i');
		icon.addClass(['fa', 'fa-bold']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
		});
		super.listen('click', e => {
			e.preventDefault();
			editor.focus();
			return editor._marky.bold([editor.selectionStart, editor.selectionEnd]);
		});
	}
}

export class ItalicButton extends Element {
	constructor (type, title, id, parent) {
		super(type || 'button', title || 'Italic', id, parent);
		super.addClass([this.title, id]);
		let editor = this.parent.element;
		let icon = new Element('i');
		icon.addClass(['fa', 'fa-italic']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();

		});
		super.listen('click', e => {
			e.preventDefault();
			editor.focus();
			return editor._marky.italic([editor.selectionStart, editor.selectionEnd]);
		});
	}
}

export class StrikethroughButton extends Element {
	constructor (type, title, id, parent) {
		super(type || 'button', title || 'Strikethrough', id, parent);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		let editor = this.parent.element;
		icon.addClass(['fa', 'fa-strikethrough']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
		});
		super.listen('click', e => {
			e.preventDefault();
			editor.focus();
			return editor._marky.strikethrough([editor.selectionStart, editor.selectionEnd]);
		});
	}
}

export class CodeButton extends Element {
	constructor (type, title, id, parent) {
		super(type || 'button', title || 'Code', id, parent);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		let editor = this.parent.element;
		icon.addClass(['fa', 'fa-code']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
		});
		super.listen('click', e => {
			e.preventDefault();
			editor.focus();
			return editor._marky.code([editor.selectionStart, editor.selectionEnd]);
		});
	}
}

export class BlockquoteButton extends Element {
	constructor (type, title, id, parent) {
		super(type || 'button', title || 'Blockquote', id, parent);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		let editor = this.parent.element;
		icon.addClass(['fa', 'fa-quote-right']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
		});
		super.listen('click', e => {
			e.preventDefault();
			editor.focus();
			return editor._marky.blockquote([editor.selectionStart, editor.selectionEnd]);
		});
	}
}

export class LinkButton extends Element {
	constructor (type, title, id, parent) {
		super(type || 'button', title || 'Link', id, parent);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		let dialog = this.parent.element;
		icon.addClass(['fa', 'fa-link']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
		});
		super.listen('click', e => {
			e.preventDefault();
			dialog.classList.toggle('toggled');
			if (dialog.style.visibility === 'hidden') return dialog.style.visibility = 'visible';
			return dialog.style.visibility = 'hidden';
		});
	}
}

export class ImageButton extends Element {
	constructor (type, title, id, parent) {
		super(type || 'button', title || 'Image', id, parent);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		let dialog = this.parent.element;
		icon.addClass(['fa', 'fa-file-image-o']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
		});
		super.listen('click', e => {
			e.preventDefault();
			dialog.classList.toggle('toggled');
			if (dialog.style.visibility === 'hidden') return dialog.style.visibility = 'visible';
			return dialog.style.visibility = 'hidden';
		});
	}
}

export class UnorderedListButton extends Element {
	constructor (type, title, id, parent) {
		super(type || 'button', title || 'Unordered List', id, parent);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		let editor = this.parent.element;
		icon.addClass(['fa', 'fa-list-ul']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
		});
		super.listen('click', e => {
			e.preventDefault();
			editor.focus();
			return editor._marky.unorderedList([editor.selectionStart, editor.selectionEnd]);
		});
	}
}

export class OrderedListButton extends Element {
	constructor (type, title, id, parent) {
		super(type || 'button', title || 'Ordered List', id, parent);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		let editor = this.parent.element;
		icon.addClass(['fa', 'fa-list-ol']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
		});
		super.listen('click', e => {
			e.preventDefault();
			editor.focus();
			return editor._marky.orderedList([editor.selectionStart, editor.selectionEnd]);
		});
	}
}

export class IndentButton extends Element {
	constructor (type, title, id, parent) {
		super(type || 'button', title || 'Indent', id, parent);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		let editor = this.parent.element;
		icon.addClass(['fa', 'fa-indent']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
		});
		super.listen('click', e => {
			e.preventDefault();
			editor.focus();
			return editor._marky.indent([editor.selectionStart, editor.selectionEnd]);
		});
	}
}

export class OutdentButton extends Element {
	constructor (type, title, id, parent) {
		super(type || 'button', title || 'Outdent', id, parent);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		let editor = this.parent.element;
		icon.addClass(['fa', 'fa-outdent']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
		});
		super.listen('click', e => {
			e.preventDefault();
			editor.focus();
			return editor._marky.outdent([editor.selectionStart, editor.selectionEnd]);
		});
	}
}

export class UndoButton extends Element {
	constructor (type, title, id, parent) {
		super(type || 'button', title || 'Undo', id, parent);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		let editor = this.parent.element;
		icon.addClass(['fa', 'fa-step-backward']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
		});
		super.listen('click', e => {
			e.preventDefault();
			if (this.element.classList.contains('disabled')) return;
			editor.focus();
			return editor._marky.undo(5, editor._marky.state, editor._marky.index);
		});
	}
}

export class RedoButton extends Element {
	constructor (type, title, id, parent) {
		super(type || 'button', title || 'Redo', id, parent);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		let editor = this.parent.element;
		icon.addClass(['fa', 'fa-step-forward']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
		});
		super.listen('click', e => {
			e.preventDefault();
			if (this.element.classList.contains('disabled')) return;
			editor.focus();
			return editor._marky.redo(5, editor._marky.state, editor._marky.index);
		});
	}
}
