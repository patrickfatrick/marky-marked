/**
 * Creates an HTML element with some built-in shortcut methods
 * @class
 * @param {String}			type		tag name for the element
 * @param {String}			title		title for the element
 * @param {String}			id			editor ID to associate with the element
 * @param {HTMLElement}	parent	element this element should have access to
 */
export class Element {
	constructor(type, title = null, id = null, parent = null) {
		this.title = title;
		this.type = type;
		this.id = id;
		this.parent = parent;
		this.element = this.register();
		if (this.title) this.element.title = this.title;
	}

	register () {
		return document.createElement(this.type);
	}

	assign (prop, value) {
		return this.element[prop] = value;
	}

	appendTo (container) {
		return container.appendChild(this.element);
	}

	addClass(classNames) {
		for (let className of classNames) {
			this.element.classList.add(className.replace(/[ ]/g, '-').toLowerCase());
		}
		return;
	}

	removeClass(classNames) {
		for (let className of classNames) {
			this.element.classList.remove(className.replace(/[ ]/g, '-').toLowerCase());
		}
		return;
	}

	listen(evt, cb) {
		return this.element.addEventListener(evt, cb);
	}
}
