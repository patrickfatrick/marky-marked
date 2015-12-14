import chai from 'chai';
import {insertHandler} from '../src/modules/handlers';
import {markyupdate} from '../src/modules/custom-events';

chai.should();
describe('insert handling', () => {
	it('inserts and selects the inserted markdown', () => {
		let string = 'Some text ';
		let indices = [10, 10];

		let boldify = insertHandler(string, indices, '[DISPLAY TEXT](https://url.com)');

		boldify.value.should.equal('Some text [DISPLAY TEXT](https://url.com)');
		boldify.range.should.contain.members([10, 41]);
	});

	it('converts to HTML', () => {
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = 'Some text ![Image](http://imagesource.com/image.jpg)';
		editor.dispatchEvent(markyupdate);

		output.value.should.contain('<p>Some text <img src="http://imagesource.com/image.jpg" alt="Image"></p>');
	});

});
