export class Element {
	constructor(type, title = null) {
		this.title = title;
		this.type = type;
		this.element = this.register();
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

	addClass(className) {
		return this.element.classList.add(className.toLowerCase());
	}

	listen(evt, cb) {
		return this.element.addEventListener(evt, cb);
	}
}
