import chai from 'chai';
import jsdom from 'jsdom';
import mark from '../src/modules/mark';
import {inlineHandler} from '../src/modules/handlers';

chai.should();
describe('inline handling', () => {

	it('adds a formatting string around a selection', () => {
		let string = 'Some text';
		let indices = [0, 9];

		let boldify = inlineHandler(string, indices, '**');

		boldify.value.should.equal('**Some text**');
		boldify.range.should.contain.members([2, 11]);
	});

	it('removes a formatting string around a selection if it already has it', () => {
		let string = '**Some text**';
		let indices = [2, 11];

		let boldify = inlineHandler(string, indices, '**');

		boldify.value.should.equal('Some text');
		boldify.range.should.contain.members([0, 9]);
	});

	it('removes a formatting string inside a selection if it already has it', () => {
		let string = '~~Some text~~';
		let indices = [0, 13];

		let strikitize = inlineHandler(string, indices, '~~');

		strikitize.value.should.equal('Some text');
		strikitize.range.should.contain.members([0, 9]);
	});

	it('ignores other formatting strings', () => {
		let string = '~~Some text~~';
		let indices = [2, 11];

		let boldify = inlineHandler(string, indices, '**');

		boldify.value.should.equal('~~**Some text**~~');
		boldify.range.should.contain.members([4, 13]);
	});

	it('ignores other formatting strings with removal', () => {
		let string = '~~**Some text**~~';
		let indices = [4, 13];

		let boldify = inlineHandler(string, indices, '**');

		boldify.value.should.equal('~~Some text~~');
		boldify.range.should.contain.members([2, 11]);
	});

	it('can be used in the middle of ranges already marked', () => {
		let string = '**Some text**';
		let indices = [6, 13];

		let boldify = inlineHandler(string, indices, '**');

		boldify.value.should.equal('**Some** text');
		boldify.range.should.contain.members([8, 13]);
	});

	it('sets selection range intuitively', () => {
		let string = '**Some text**';
		let indices = [6, 11];

		let boldify = inlineHandler(string, indices, '**');

		boldify.value.should.equal('**Some** text');
		boldify.range.should.contain.members([8, 13]);
	});

	it('converts to HTML', () => {
		const container = document.createElement('marky-mark');
		document.body.appendChild(container);
		mark('marky-mark');
		container.children[1].value = '**Some text**';

		const evt = document.createEvent('HTMLEvents');
		evt.initEvent('update', false, true);
		container.children[1].dispatchEvent(evt);

		container.children[2].value.should.contain('<p><strong>Some text</strong></p>');
	});

});
