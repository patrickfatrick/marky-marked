import {Button} from './Button';

class BoldButton extends Button {
	constructor () {
		super('Bold');
		this.addEventListener('click', e => {
			console.log('clicked');
		});
	}
}

class ItalicButton extends Button {
	constructor () {
		super('Italic');
		this.addEventListener('click', e => {
			console.log('clicked');
		});
	}
}
