export class Button {
	constructor(title) {
		this.title = title;
		this.type = 'button';
	}

	create () {
		return document.createElement('button');
	}

	addClass(className) {
		return this.classList.add(className.toLowerCase());
	}
}
