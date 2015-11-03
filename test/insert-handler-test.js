import chai from 'chai';
import jsdom from 'jsdom';
import mark from '../src/modules/mark';
import {insertHandler} from '../src/modules/handlers';

chai.should();
describe('block handling', () => {
	it('inserts and selects the inserted markdown', () => {
		let string = 'Some text ';
		let indices = [10, 10];

		let boldify = insertHandler(string, indices, '[DISPLAY TEXT](https://url.com)');

		boldify.value.should.equal('Some text [DISPLAY TEXT](https://url.com)');
		boldify.range.should.contain.members([10, 41]);
	});
});
