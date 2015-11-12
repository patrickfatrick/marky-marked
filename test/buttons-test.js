import chai from 'chai';
import mark from '../src/modules/mark';

chai.should();
describe('toolbar buttons', () => {
	it('calls the bold method', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		mark();
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 9);
		document.querySelector('.bold').click();
		output.value.should.equal('<p><strong>Some text</strong></p>\n');
	});
	it('calls the italic method', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		mark();
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 9);
		document.querySelector('.italic').click();
		output.value.should.equal('<p><em>Some text</em></p>\n');
	});
	it('calls the strikethrough method', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		mark();
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 9);
		document.querySelector('.strikethrough').click();
		output.value.should.equal('<p><del>Some text</del></p>\n');
	});
	it('calls the code method', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		mark();
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 9);
		document.querySelector('.code').click();
		output.value.should.equal('<p><code>Some text</code></p>\n');
	});
	it('calls the blockquote method', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		mark();
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 9);
		document.querySelector('.blockquote').click();
		output.value.should.equal('<blockquote>\n<p>Some text</p>\n</blockquote>\n');
	});
	it('calls the link method', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		mark();
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 9);
		document.querySelector('.link').click();
		editor.value.should.equal('Some text[DISPLAY TEXT](http://url.com)');
		editor.selectionStart.should.equal(9);
		editor.selectionEnd.should.equal(editor.value.length);
	});
	it('calls the image method', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		mark();
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 9);
		document.querySelector('.image').click();
		editor.value.should.equal('Some text![ALT TEXT](http://imagesource.com/image.jpg)');
		editor.selectionStart.should.equal(9);
		editor.selectionEnd.should.equal(editor.value.length);
	});
	it('calls the unorderedList method', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		mark();
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = 'Some text\r\nSome other text';
		editor.setSelectionRange(0, 26);
		document.querySelector('.unordered-list').click();
		editor.value.should.equal('- Some text\n- Some other text');
	});
	it('calls the ordered list method', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		mark();
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = 'Some text\r\nSome other text';
		editor.setSelectionRange(0, 26);
		document.querySelector('.ordered-list').click();
		editor.value.should.equal('1. Some text\n2. Some other text');
	});
});
