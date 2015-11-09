import chai from 'chai';
import jsdom from 'jsdom';
import mark from '../src/modules/mark';
import {listHandler} from '../src/modules/handlers';

chai.should();
describe('list handling', () => {
	it('adds a formatting string to the beginning of a line', () => {
		let string = 'Some text';
		let indices = [0, 9];

		let headingify = listHandler(string, indices, 'ul');

		headingify.value.should.equal('- Some text');
		headingify.range.should.contain.members([0, 11]);
	});

	it('does not matter where the selection is on that line', () => {
		let string = 'Some text';
		let indices = [9, 9];

		let quotify = listHandler(string, indices, 'ul');

		quotify.value.should.equal('- Some text');
		quotify.range.should.contain.members([0, 11]);
	});

	it('works with multi-line selections', () => {
		let string = 'Some text\r\nSome other text';
		let indices = [0, 26];

		let headingify = listHandler(string, indices, 'ul');

		headingify.value.should.equal('- Some text\r\n- Some other text');
		headingify.range.should.contain.members([0, 29]);
	});

	it('ignores other lines around the selection', () => {
		let string = 'Some text\r\nSome other text';
		let indices = [11, 26];
		let headingify = listHandler(string, indices, 'ul');

		headingify.value.should.equal('Some text\r\n- Some other text');
		headingify.range.should.contain.members([11, 28]);
	});

	it('removes all other block or list formatting', () => {
		let string = '# Some text';
		let indices = [0, 11];

		let headingify = listHandler(string, indices, 'ul');

		headingify.value.should.equal('- Some text');
		headingify.range.should.contain.members([0, 11]);
	});

	it('removes all other list formatting even if format string is directly touching text', () => {
		let string = '>Some text';
		let indices = [0, 10];

		let headingify = listHandler(string, indices, 'ul');

		headingify.value.should.equal('- Some text');
		headingify.range.should.contain.members([0, 11]);
	});

	it('considers inline formats to be text', () => {
		let string = '**Some text**';
		let indices = [0, 13];

		let headingify = listHandler(string, indices, 'ul');

		headingify.value.should.equal('- **Some text**');
		headingify.range.should.contain.members([0, 15]);
	});

	it('also considers inline formats to be text when removing other list formats', () => {
		let string = '> **Some text**';
		let indices = [0, 15];

		let headingify = listHandler(string, indices, 'ul');

		headingify.value.should.equal('- **Some text**');
		headingify.range.should.contain.members([0, 15]);
	});

	it('works on a blank line', () => {
		let string = '';
		let indices = [0, 0];

		let headingify = listHandler(string, indices, 'ul');

		headingify.value.should.equal('- ');
		headingify.range.should.contain.members([0, 2]);
	});

	it('removes other formatting on a blank line', () => {
		let string = '>';
		let indices = [0, 1];

		let headingify = listHandler(string, indices, 'ul');

		headingify.value.should.equal('- ');
		headingify.range.should.contain.members([0, 2]);
	});

	it('adds formatting to several lines', () => {
		let string = 'Some text\r\nSome other text\r\nEven more text';
		let indices = [0, 42];

		let headingify = listHandler(string, indices, 'ul');

		headingify.value.should.equal('- Some text\r\n- Some other text\r\n- Even more text');
		headingify.range.should.contain.members([0, 46]);
	});

	it('exchanges one unordered list for an ordered list', () => {
		let string = '- Some text\r\n- Some other text\r\n- Even more text';
		let indices = [0, 48];

		let headingify = listHandler(string, indices, 'ol');

		headingify.value.should.equal('1. Some text\r\n2. Some other text\r\n3. Even more text');
		headingify.range.should.contain.members([0, 49]);
	});

	it('exchanges one ordered list for an unordered list', () => {
		let string = '1. Some text\r\n2. Some other text\r\n3. Even more text';
		let indices = [0, 51];

		let headingify = listHandler(string, indices, 'ul');

		headingify.value.should.equal('- Some text\r\n- Some other text\r\n- Even more text');
		headingify.range.should.contain.members([0, 46]);
	});

	it('converts to HTML', () => {
		const container = document.createElement('marky-mark');
		document.body.appendChild(container);
		mark('marky-mark');
		container.children[1].value = '- Some text\r\n- Some other text';

		const evt = document.createEvent('HTMLEvents');
		evt.initEvent('update', false, true);
		container.children[1].dispatchEvent(evt);

		container.children[2].value.should.contain('<ul>\n<li>Some text</li>\n<li>Some other text</li>\n</ul>');
	});

});
