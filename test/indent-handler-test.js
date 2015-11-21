import chai from 'chai';
import {indentHandler} from '../src/modules/handlers';

chai.should();
describe('indent handling', () => {
	it('adds four spaces to the beginning of a line', () => {
		let string = 'Some text';
		let indices = [0, 9];

		let indentify = indentHandler(string, indices, 'in');

		indentify.value.should.equal('    Some text');
		indentify.range.should.contain.members([0, 13]);
	});

	it('does not matter where the selection is on that line', () => {
		let string = 'Some text';
		let indices = [9, 9];

		let indentify = indentHandler(string, indices, 'in');

		indentify.value.should.equal('    Some text');
		indentify.range.should.contain.members([0, 13]);
	});

	it('works with multi-line selections', () => {
		let string = 'Some text\r\nSome other text';
		let indices = [0, 26];

		let indentify = indentHandler(string, indices, 'in');

		indentify.value.should.equal('    Some text\r\n    Some other text');
		indentify.range.should.contain.members([0, 33]);
	});

	it('ignores other lines around the selection', () => {
		let string = 'Some text\r\nSome other text';
		let indices = [11, 26];
		let indentify = indentHandler(string, indices, 'in');

		indentify.value.should.equal('Some text\r\n    Some other text');
		indentify.range.should.contain.members([11, 30]);
	});

	it('does not remove block or list formatting', () => {
		let string = '- Some text';
		let indices = [0, 11];

		let indentify = indentHandler(string, indices, 'in');

		indentify.value.should.equal('    - Some text');
		indentify.range.should.contain.members([0, 15]);
	});

	it('does not remove block or list formatting on outdent', () => {
		let string = '    - Some text';
		let indices = [0, 15];

		let indentify = indentHandler(string, indices, 'out');

		indentify.value.should.equal('- Some text');
		indentify.range.should.contain.members([0, 11]);
	});

	it('considers inline formats to be text', () => {
		let string = '**Some text**';
		let indices = [0, 13];

		let indentify = indentHandler(string, indices, 'in');

		indentify.value.should.equal('    **Some text**');
		indentify.range.should.contain.members([0, 17]);
	});

	it('also considers inline formats to be text on outdent', () => {
		let string = '    **Some text**';
		let indices = [0, 17];

		let indentify = indentHandler(string, indices, 'out');

		indentify.value.should.equal('**Some text**');
		indentify.range.should.contain.members([0, 13]);
	});

	it('works on a blank line', () => {
		let string = '';
		let indices = [0, 0];

		let indentify = indentHandler(string, indices, 'in');

		indentify.value.should.equal('    ');
		indentify.range.should.contain.members([0, 4]);
	});

	it('outdents on lines with multiple indents', () => {
		let string = '        Some text';
		let indices = [0, 17];

		let indentify = indentHandler(string, indices, 'out');

		indentify.value.should.equal('    Some text');
		indentify.range.should.contain.members([0, 13]);
	});

	it('outdents on lines with less than a full indent', () => {
		let string = ' Some text';
		let indices = [0, 10];

		let indentify = indentHandler(string, indices, 'out');

		indentify.value.should.equal('Some text');
		indentify.range.should.contain.members([0, 9]);
	});

	it('outdents on lines with less than a full indent and an unordered list format string', () => {
		let string = ' - Some text';
		let indices = [0, 12];

		let indentify = indentHandler(string, indices, 'out');

		indentify.value.should.equal('- Some text');
		indentify.range.should.contain.members([0, 11]);
	});

	it('outdents on lines with less than a full indent and an ordered list format string', () => {
		let string = ' 1. Some text';
		let indices = [0, 13];

		let indentify = indentHandler(string, indices, 'out');

		indentify.value.should.equal('1. Some text');
		indentify.range.should.contain.members([0, 12]);
	});

	it('indents several lines', () => {
		let string = '- Some text\r\n- Some other text\r\n- Even more text';
		let indices = [0, 48];

		let indentify = indentHandler(string, indices, 'in');

		indentify.value.should.equal('    - Some text\r\n    - Some other text\r\n    - Even more text');
		indentify.range.should.contain.members([0, 58]);
	});

	it('outdents several lines', () => {
		let string = '    1. Some text\r\n    2. Some other text\r\n    3. Even more text';
		let indices = [0, 63];

		let indentify = indentHandler(string, indices, 'out');

		indentify.value.should.equal('1. Some text\r\n2. Some other text\r\n3. Even more text');
		indentify.range.should.contain.members([0, 49]);
	});

	it('outdents several lines with less than a full indent on each line', () => {
		let string = '  1. Some text\r\n  2. Some other text\r\n  3. Even more text';
		let indices = [0, 57];

		let indentify = indentHandler(string, indices, 'out');

		indentify.value.should.equal('1. Some text\r\n2. Some other text\r\n3. Even more text');
		indentify.range.should.contain.members([0, 49]);
	});

	it('outdents several lines with a mix of indents', () => {
		let string = '    1. Some text\r\n  2. Some other text\r\n   3. Even more text';
		let indices = [0, 60];

		let indentify = indentHandler(string, indices, 'out');

		indentify.value.should.equal('1. Some text\r\n2. Some other text\r\n3. Even more text');
		indentify.range.should.contain.members([0, 49]);
	});

});
