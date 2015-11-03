import {Element} from './Element';
import {inlineHandler, blockHandler, insertHandler, listHandler} from './handlers';
import {update, markychange} from './custom-events';

export class BoldButton extends Element {
	constructor (type = 'button', title = 'Bold', id) {
		super(type, title, id);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		icon.addClass(['fa', 'fa-bold']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			const editor = document.querySelector('textarea.' + id);
			editor.focus();
		});
		super.listen('click', e => {
			e.preventDefault();
			const editor = document.querySelector('textarea.' + id);
			editor.focus();
			const indices = [editor.selectionStart, editor.selectionEnd];
			let boldify = inlineHandler(editor.value, indices, '**');
			editor.value = boldify.value;
			editor.setSelectionRange(boldify.range[0], boldify.range[1]);
			editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
			let html = editor._marky.state.get(editor._marky.index).get('html');
			editor.nextSibling.value = html;
			return editor.dispatchEvent(update);
		});
	}
}

export class ItalicButton extends Element {
	constructor (type = 'button', title = 'Italic', id) {
		super(type, title, id);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		icon.addClass(['fa', 'fa-italic']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			const editor = document.querySelector('textarea.' + id);
			editor.focus();

		});
		super.listen('click', e => {
			e.preventDefault();
			const editor = document.querySelector('textarea.' + id);
			editor.focus();
			const indices = [editor.selectionStart, editor.selectionEnd];
			let italicize = inlineHandler(editor.value, indices, '_');
			editor.value = italicize.value;
			editor.setSelectionRange(italicize.range[0], italicize.range[1]);
			editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
			let html = editor._marky.state.get(editor._marky.index).get('html');
			editor.nextSibling.value = html;
			return editor.dispatchEvent(update);
		});
	}
}

export class StrikethroughButton extends Element {
	constructor (type = 'button', title = 'Strikethrough', id) {
		super(type, title, id);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		icon.addClass(['fa', 'fa-strikethrough']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			const editor = document.querySelector('textarea.' + id);
			editor.focus();
		});
		super.listen('click', e => {
			e.preventDefault();
			const editor = document.querySelector('textarea.' + id);
			editor.focus();
			const indices = [editor.selectionStart, editor.selectionEnd];
			let strikitize = inlineHandler(editor.value, indices, '~~');
			editor.value = strikitize.value;
			editor.setSelectionRange(strikitize.range[0], strikitize.range[1]);
			editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
			let html = editor._marky.state.get(editor._marky.index).get('html');
			editor.nextSibling.value = html;
			return editor.dispatchEvent(update);
		});
	}
}

export class CodeButton extends Element {
	constructor (type = 'button', title = 'Code', id) {
		super(type, title, id);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		icon.addClass(['fa', 'fa-code']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			const editor = document.querySelector('textarea.' + id);
			editor.focus();
		});
		super.listen('click', e => {
			e.preventDefault();
			const editor = document.querySelector('textarea.' + id);
			editor.focus();
			const indices = [editor.selectionStart, editor.selectionEnd];
			let codify = inlineHandler(editor.value, indices, '`');
			editor.value = codify.value;
			editor.setSelectionRange(codify.range[0], codify.range[1]);
			editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
			let html = editor._marky.state.get(editor._marky.index).get('html');
			editor.nextSibling.value = html;
			return editor.dispatchEvent(update);
		});
	}
}

export class BlockquoteButton extends Element {
	constructor (type = 'button', title = 'Blockquote', id) {
		super(type, title, id);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		icon.addClass(['fa', 'fa-quote-right']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			const editor = document.querySelector('textarea.' + id);
			editor.focus();
		});
		super.listen('click', e => {
			e.preventDefault();
			const editor = document.querySelector('textarea.' + id);
			editor.focus();
			const indices = [editor.selectionStart, editor.selectionEnd];
			let quotify = blockHandler(editor.value, indices, '> ');
			editor.value = quotify.value;
			editor.setSelectionRange(quotify.range[0], quotify.range[1]);
			editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
			let html = editor._marky.state.get(editor._marky.index).get('html');
			editor.nextSibling.value = html;
			return editor.dispatchEvent(update);
		});
	}
}

export class LinkButton extends Element {
	constructor (type = 'button', title = 'Link', id) {
		super(type, title, id);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		icon.addClass(['fa', 'fa-link']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			const editor = document.querySelector('textarea.' + id);
			editor.focus();
		});
		super.listen('click', e => {
			e.preventDefault();
			const editor = document.querySelector('textarea.' + id);
			editor.focus();
			const indices = [editor.selectionStart, editor.selectionEnd];
			const mark = '[DISPLAY TEXT](http://url.com)';
			let linkify = insertHandler(editor.value, indices, mark);
			editor.value = linkify.value;
			editor.setSelectionRange(linkify.range[0], linkify.range[1]);
			editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
			let html = editor._marky.state.get(editor._marky.index).get('html');
			editor.nextSibling.value = html;
			return editor.dispatchEvent(update);
		});
	}
}

export class ImageButton extends Element {
	constructor (type = 'button', title = 'Image', id) {
		super(type, title, id);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		icon.addClass(['fa', 'fa-file-image-o']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			const editor = document.querySelector('textarea.' + id);
			editor.focus();

		});
		super.listen('click', e => {
			e.preventDefault();
			const editor = document.querySelector('textarea.' + id);
			editor.focus();
			const indices = [editor.selectionStart, editor.selectionEnd];
			const mark = '![ALT TEXT](http://imagesource.com/image.jpg)';
			let imagify = insertHandler(editor.value, indices, mark);
			editor.value = imagify.value;
			editor.setSelectionRange(imagify.range[0], imagify.range[1]);
			editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
			let html = editor._marky.state.get(editor._marky.index).get('html');
			editor.nextSibling.value = html;
			return editor.dispatchEvent(update);
		});
	}
}

export class UnorderedListButton extends Element {
	constructor (type = 'button', title = 'Unordered-List', id) {
		super(type, title, id);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		icon.addClass(['fa', 'fa-list-ul']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			const editor = document.querySelector('textarea.' + id);
			editor.focus();
		});
		super.listen('click', e => {
			e.preventDefault();
			const editor = document.querySelector('textarea.' + id);
			editor.focus();
			const indices = [editor.selectionStart, editor.selectionEnd];
			let listify = listHandler(editor.value, indices, 'ul');
			editor.value = listify.value;
			editor.setSelectionRange(listify.range[0], listify.range[1]);
			editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
			let html = editor._marky.state.get(editor._marky.index).get('html');
			editor.nextSibling.value = html;
			return editor.dispatchEvent(update);
		});
	}
}

export class OrderedListButton extends Element {
	constructor (type = 'button', title = 'Ordered-List', id) {
		super(type, title, id);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		icon.addClass(['fa', 'fa-list-ol']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			const editor = document.querySelector('textarea.' + id);
			editor.focus();
		});
		super.listen('click', e => {
			e.preventDefault();
			const editor = document.querySelector('textarea.' + id);
			editor.focus();
			const indices = [editor.selectionStart, editor.selectionEnd];
			let listify = listHandler(editor.value, indices, 'ol');
			editor.value = listify.value;
			editor.setSelectionRange(listify.range[0], listify.range[1]);
			editor._marky.update(editor.value, editor._marky.state, editor._marky.index);
			let html = editor._marky.state.get(editor._marky.index).get('html');
			editor.nextSibling.value = html;
			return editor.dispatchEvent(update);
		});
	}
}

export class UndoButton extends Element {
	constructor (type = 'button', title = 'Undo', id) {
		super(type, title, id);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		icon.addClass(['fa', 'fa-step-backward']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			const editor = document.querySelector('textarea.' + id);
			editor.focus();
		});
		super.listen('click', e => {
			e.preventDefault();
			if (this.element.classList.contains('disabled')) return;
			const editor = document.querySelector('textarea.' + id);
			editor.focus();
			let activeState = editor._marky.undo(editor._marky.state, editor._marky.index);
			let markdown = activeState.get('markdown');
			let html = activeState.get('html');
			editor.value = markdown;
			editor.nextSibling.value = html;
			return editor.dispatchEvent(markychange);
		});
	}
}

export class RedoButton extends Element {
	constructor (type = 'button', title = 'Redo', id) {
		super(type, title);
		super.addClass([this.title, id]);
		let icon = new Element('i');
		icon.addClass(['fa', 'fa-step-forward']);
		icon.appendTo(this.element);
		super.listen('mousedown', e => {
			e.preventDefault();
			const editor = document.querySelector('textarea.' + id);
			editor.focus();
		});
		super.listen('click', e => {
			e.preventDefault();
			if (this.element.classList.contains('disabled')) return;
			const editor = document.querySelector('textarea.' + id);
			editor.focus();
			let activeState = editor._marky.redo(editor._marky.state, editor._marky.index);
			let markdown = activeState.get('markdown');
			let html = activeState.get('html');
			editor.value = markdown;
			editor.nextSibling.value = html;
			return editor.dispatchEvent(markychange);
		});
	}
}
