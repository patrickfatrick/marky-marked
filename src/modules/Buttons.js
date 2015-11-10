import {Element} from './Element';

export class BoldButton extends Element {
	constructor (type = 'button', title = 'Bold', id, parent) {
		super(type, title, id, parent);
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
	constructor (type = 'button', title = 'Italic', id, parent) {
		super(type, title, id, parent);
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
	constructor (type = 'button', title = 'Strikethrough', id, parent) {
		super(type, title, id, parent);
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
	constructor (type = 'button', title = 'Code', id, parent) {
		super(type, title, id, parent);
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
	constructor (type = 'button', title = 'Blockquote', id, parent) {
		super(type, title, id, parent);
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
	constructor (type = 'button', title = 'Link', id, parent) {
		super(type, title, id, parent);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		let editor = this.parent.element;
		icon.addClass(['fa', 'fa-link']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();
		});
		super.listen('click', e => {
			e.preventDefault();
			editor.focus();
			return editor._marky.link([editor.selectionStart, editor.selectionEnd]);
		});
	}
}

export class ImageButton extends Element {
	constructor (type = 'button', title = 'Image', id, parent) {
		super(type, title, id, parent);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		let editor = this.parent.element;
		icon.addClass(['fa', 'fa-file-image-o']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			editor.focus();

		});
		super.listen('click', e => {
			e.preventDefault();
			editor.focus();
			return editor._marky.image([editor.selectionStart, editor.selectionEnd]);
		});
	}
}

export class UnorderedListButton extends Element {
	constructor (type = 'button', title = 'Unordered-List', id, parent) {
		super(type, title, id, parent);
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
	constructor (type = 'button', title = 'Ordered-List', id, parent) {
		super(type, title, id, parent);
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

export class UndoButton extends Element {
	constructor (type = 'button', title = 'Undo', id, parent) {
		super(type, title, id, parent);
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
	constructor (type = 'button', title = 'Redo', id, parent) {
		super(type, title, id, parent);
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
