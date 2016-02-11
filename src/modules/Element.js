'use strict';

/**
 * Creates an HTML element with some built-in shortcut methods
 * @class
 * @param {String}			type		tag name for the element
 * @param {String}			title		title for the element
 * @param {String}			id			editor ID to associate with the element
 * @param {HTMLElement}	relevant	element this element should have access to
 */
export class Element {
	constructor(type, title = null, id = null, relevant = null) {
		this.title = title;
		this.type = type;
		this.id = id;
		this.relevant = relevant;
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

	addClass (classNames) {
		return classNames.forEach(className => {
			this.element.classList.add(className.replace(/[ ]/g, '-').toLowerCase());
		});
	}

	removeClass (classNames) {
		return classNames.forEach(className => {
			this.element.classList.remove(className.replace(/[ ]/g, '-').toLowerCase());
		});
	}

	listen (evt, cb) {
		return this.element.addEventListener(evt, cb);
	}
}
