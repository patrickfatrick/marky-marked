import chai from 'chai';
import mark from '../src/modules/mark';

chai.should();
describe('toolbar buttons', () => {
	it('calls the heading-1 method', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		mark();
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 9);
		var heading = document.querySelector('.heading');
		heading.selectedIndex = 2;
		var change;
		change = document.createEvent('HTMLEvents');
		change.initEvent('change', true, true, window);
		heading.dispatchEvent(change);

		output.value.should.equal('<h1 id="some-text">Some text</h1>\n');
	});
	it('calls the heading-2 method', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		mark();
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 9);
		var heading = document.querySelector('.heading');
		heading.selectedIndex = 3;
		var change;
		change = document.createEvent('HTMLEvents');
		change.initEvent('change', true, true, window);
		heading.dispatchEvent(change);

		output.value.should.equal('<h2 id="some-text">Some text</h2>\n');
	});
	it('calls the heading-6 method', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		mark();
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 9);
		var heading = document.querySelector('.heading');
		heading.selectedIndex = 7;
		var change;
		change = document.createEvent('HTMLEvents');
		change.initEvent('change', true, true, window);
		heading.dispatchEvent(change);

		output.value.should.equal('<h6 id="some-text">Some text</h6>\n');
	});
	it('removes any existing heading', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		mark();
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 9);
		var heading = document.querySelector('.heading');
		heading.selectedIndex = 1;
		var change;
		change = document.createEvent('HTMLEvents');
		change.initEvent('change', true, true, window);
		heading.dispatchEvent(change);

		output.value.should.equal('<p>Some text</p>\n');
	});
});
