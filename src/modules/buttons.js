import {Element} from './Element';

export class BoldButton extends Element {
	constructor (type = 'button', title = 'Bold') {
		super(type, title);
		super.addClass(this.title);
		let icon = new Element('i');
		icon.addClass('fa');
		icon.addClass('fa-bold');
		icon.appendTo(this.element);
		super.listen('click', e => {
			e.preventDefault();
			console.log('click on ' + this.title);
		});
	}
}

export class ItalicButton extends Element {
	constructor (type = 'button', title = 'Italic') {
		super(type, title);
		super.addClass(this.title);
		let icon = new Element('i');
		icon.addClass('fa');
		icon.addClass('fa-italic');
		icon.appendTo(this.element);
		super.listen('click', e => {
			e.preventDefault();
			console.log('click on ' + this.title);
		});
	}
}

export class StrikethroughButton extends Element {
	constructor (type = 'button', title = 'Strikethrough') {
		super(type, title);
		super.addClass(this.title);
		let icon = new Element('i');
		icon.addClass('fa');
		icon.addClass('fa-strikethrough');
		icon.appendTo(this.element);
		super.listen('click', e => {
			e.preventDefault();
			console.log('click on ' + this.title);
		});
	}
}

export class CodeButton extends Element {
	constructor (type = 'button', title = 'Code') {
		super(type, title);
		super.addClass(this.title);
		let icon = new Element('i');
		icon.addClass('fa');
		icon.addClass('fa-code');
		icon.appendTo(this.element);
		super.listen('click', e => {
			e.preventDefault();
			console.log('click on ' + this.title);
		});
	}
}

export class BlockquoteButton extends Element {
	constructor (type = 'button', title = 'Blockquote') {
		super(type, title);
		super.addClass(this.title);
		let icon = new Element('i');
		icon.addClass('fa');
		icon.addClass('fa-quote-right');
		icon.appendTo(this.element);
		super.listen('click', e => {
			e.preventDefault();
			console.log('click on ' + this.title);
		});
	}
}

export class LinkButton extends Element {
	constructor (type = 'button', title = 'Link') {
		super(type, title);
		super.addClass(this.title);
		let icon = new Element('i');
		icon.addClass('fa');
		icon.addClass('fa-link');
		icon.appendTo(this.element);
		super.listen('click', e => {
			e.preventDefault();
			console.log('click on ' + this.title);
		});
	}
}

export class ImageButton extends Element {
	constructor (type = 'button', title = 'Image') {
		super(type, title);
		super.addClass(this.title);
		let icon = new Element('i');
		icon.addClass('fa');
		icon.addClass('fa-file-image-o');
		icon.appendTo(this.element);
		super.listen('click', e => {
			e.preventDefault();
			console.log('click on ' + this.title);
		});
	}
}

export class UnorderedListButton extends Element {
	constructor (type = 'button', title = 'Unordered-List') {
		super(type, title);
		super.addClass(this.title);
		let icon = new Element('i');
		icon.addClass('fa');
		icon.addClass('fa-list-ul');
		icon.appendTo(this.element);
		super.listen('click', e => {
			e.preventDefault();
			console.log('click on ' + this.title);
		});
	}
}

export class OrderedListButton extends Element {
	constructor (type = 'button', title = 'Ordered-List') {
		super(type, title);
		super.addClass(this.title);
		let icon = new Element('i');
		icon.addClass('fa');
		icon.addClass('fa-list-ol');
		icon.appendTo(this.element);
		super.listen('click', e => {
			e.preventDefault();
			console.log('click on ' + this.title);
		});
	}
}

export class UndoButton extends Element {
	constructor (type = 'button', title = 'Undo') {
		super(type, title);
		super.addClass(this.title);
		let icon = new Element('i');
		icon.addClass('fa');
		icon.addClass('fa-step-backward');
		icon.appendTo(this.element);
		super.listen('click', e => {
			e.preventDefault();
			console.log('click on ' + this.title);
		});
	}
}

export class RedoButton extends Element {
	constructor (type = 'button', title = 'Redo') {
		super(type, title);
		super.addClass(this.title);
		let icon = new Element('i');
		icon.addClass('fa');
		icon.addClass('fa-step-forward');
		icon.appendTo(this.element);
		super.listen('click', e => {
			e.preventDefault();
			console.log('click on ' + this.title);
		});
	}
}
