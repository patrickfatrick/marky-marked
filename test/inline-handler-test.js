import chai from 'chai';
import {inlineHandler} from '../src/modules/handlers';
import {markyupdate} from '../src/modules/custom-events';

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

	it('removes marks around blank strings', () => {
		let string = 'So****me text';
		let indices = [4, 4];

		let boldify = inlineHandler(string, indices, '**');

		boldify.value.should.equal('Some text');
		boldify.range.should.contain.members([2, 2]);
	});

	it('converts to HTML', () => {
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = '**Some text**';
		editor.dispatchEvent(markyupdate);

		output.value.should.contain('<p><strong>Some text</strong></p>');
	});

});
