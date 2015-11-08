import chai from 'chai';
import jsdom from 'jsdom';
import mark from '../src/modules/mark';
import {insertHandler} from '../src/modules/handlers';

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
		const container = document.createElement('marky-mark');
		document.body.appendChild(container);
		mark('marky-mark');
		container.children[1].value = 'Some text ![Image](http://imagesource.com/image.jpg)';

		const evt = document.createEvent('HTMLEvents');
		evt.initEvent('update', false, true);
		container.children[1].dispatchEvent(evt);

		container.children[2].value.should.contain('<p>Some text <img src="http://imagesource.com/image.jpg" alt="Image"></p>');
	});

});
