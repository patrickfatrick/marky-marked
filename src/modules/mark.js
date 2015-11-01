import {Marky} from '../marky';

/**
 * Create the DOM elements needed and set the event listeners
 * @param 	{String}	tag name to be used for initialization
 * @returns {Object} a Marky Mark instance
 */
export default function (tag = 'marky-mark') {

	const update = new CustomEvent('update');
	let containers = document.getElementsByTagName(tag);

	Array.prototype.forEach.call(containers, container => {
		let toolbar = document.createElement('div');
		toolbar.classList.add('marky-toolbar');

		let boldButton = document.createElement('button');
		boldButton.type = 'button';
		boldButton.classList.add('bold');
		boldButton.title = 'Bold';

		let italicButton = document.createElement('button');
		italicButton.type = 'button';
		italicButton.classList.add('italic');
		italicButton.title = 'Italic';

		let strikeButton = document.createElement('button');
		strikeButton.type = 'button';
		strikeButton.classList.add('strike');
		strikeButton.title = 'Strike';

		let textarea = document.createElement('textarea');
		textarea.contentEditable = true;
		textarea.classList.add('marky-editor');

		let input = document.createElement('input');
		input.type = 'hidden';
		input.classList.add('marky-output');

		container.appendChild(toolbar);
		container.appendChild(textarea);
		container.appendChild(input);
		toolbar.appendChild(boldButton);
		toolbar.appendChild(italicButton);
	});

	let editors = document.querySelectorAll('.marky-editor');

	Array.prototype.forEach.call(editors, editor => {
		editor._marky = new Marky;

		editor.addEventListener('update', function (e) {
			this._marky.update(e.target.value, this._marky.state, this._marky.index);
			let html = this._marky.state[this._marky.index].get('html');
			console.log(this._marky.state);
			return e.target.nextSibling.value = html;
		}, false);

		editor.addEventListener('input', function (e) {
			return e.target.dispatchEvent(update);
		}, false);

	});

}
