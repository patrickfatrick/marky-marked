import chai from 'chai';

chai.should();
describe('marky methods', () => {
	it('updates the state', () => {
		const editor = document.querySelector('.marky-editor');
		editor.value = 'Some text';
		let length = editor._marky.state.length;
		editor._marky.update(editor.value);

		editor._marky.state.length.should.equal(length + 1);
	});
	it('undoes the state', () => {
		const editor = document.querySelector('.marky-editor');
		editor._marky.index = 1;
		editor._marky.undo(1);

		editor._marky.index.should.equal(0);
	});
	it('redoes the state', () => {
		const editor = document.querySelector('.marky-editor');
		editor._marky.index = 0;
		editor._marky.redo(1);

		editor._marky.index.should.equal(1);
	});
	it('sets the selection', () => {
		const editor = document.querySelector('.marky-editor');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 0);
		editor._marky.setSelection([0, 9]);
		editor.selectionStart.should.equal(0);
		editor.selectionEnd.should.equal(9);
	});
	it('expands the selection forward', () => {
		const editor = document.querySelector('.marky-editor');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 0);
		editor._marky.expandSelectionForward(1);
		editor.selectionStart.should.equal(0);
		editor.selectionEnd.should.equal(1);
	});
	it('expands the selection backward', () => {
		const editor = document.querySelector('.marky-editor');
		editor.value = 'Some text';
		editor.setSelectionRange(9, 9);
		editor._marky.expandSelectionBackward(1);
		editor.selectionStart.should.equal(8);
		editor.selectionEnd.should.equal(9);
	});
	it('moves the cursor forward', () => {
		const editor = document.querySelector('.marky-editor');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 0);
		editor._marky.moveCursorForward(1);
		editor.selectionStart.should.equal(1);
		editor.selectionEnd.should.equal(1);
	});
	it('moves the cursor backward', () => {
		const editor = document.querySelector('.marky-editor');
		editor.value = 'Some text';
		editor.setSelectionRange(9, 9);
		editor._marky.moveCursorBackward(1);
		editor.selectionStart.should.equal(8);
		editor.selectionEnd.should.equal(8);
	});
	it('implements a bold', () => {
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 9);
		editor._marky.bold();
		output.value.should.equal('<p><strong>Some text</strong></p>\n');
	});
	it('implements an italic', () => {
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 9);
		editor._marky.italic();
		output.value.should.equal('<p><em>Some text</em></p>\n');
	});
	it('implements a strikethrough', () => {
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 9);
		editor._marky.strikethrough();
		output.value.should.equal('<p><del>Some text</del></p>\n');
	});
	it('implements a code block', () => {
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 9);
		editor._marky.code();
		output.value.should.equal('<p><code>Some text</code></p>\n');
	});
	it('implements a blockquote', () => {
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 9);
		editor._marky.blockquote();
		output.value.should.equal('<blockquote>\n<p>Some text</p>\n</blockquote>\n');
	});
	it('implements a heading', () => {
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 9);
		editor._marky.heading(1);
		output.value.should.equal('<h1 id="some-text">Some text</h1>\n');
	});
	it('implements a heading with a default of 0', () => {
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = '# Some text';
		editor.setSelectionRange(2, 9);
		editor._marky.heading();
		output.value.should.equal('<p>Some text</p>\n');
	});
	it('inserts a link snippet', () => {
		const editor = document.querySelector('.marky-editor');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 9);
		editor._marky.link([0, 9], 'http://google.com', 'Some text');
		editor.value.should.equal('[Some text](http://google.com)');
		editor.selectionStart.should.equal(0);
		editor.selectionEnd.should.equal(editor.value.length);
	});
	it('inserts a default link snippet', () => {
		const editor = document.querySelector('.marky-editor');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 9);
		editor._marky.link();
		editor.value.should.equal('[http://url.com](http://url.com)');
		editor.selectionStart.should.equal(0);
		editor.selectionEnd.should.equal(editor.value.length);
	});
	it('inserts an image snippet', () => {
		const editor = document.querySelector('.marky-editor');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 9);
		editor._marky.image([0, 9], 'http://i.imgur.com/VlVsP.gif', 'Chuck Chardonnay');
		editor.value.should.equal('![Chuck Chardonnay](http://i.imgur.com/VlVsP.gif)');
		editor.selectionStart.should.equal(0);
		editor.selectionEnd.should.equal(editor.value.length);
	});
	it('inserts aa default image snippet', () => {
		const editor = document.querySelector('.marky-editor');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 9);
		editor._marky.image();
		editor.value.should.equal('![http://imagesource.com/image.jpg](http://imagesource.com/image.jpg)');
		editor.selectionStart.should.equal(0);
		editor.selectionEnd.should.equal(editor.value.length);
	});
	it('implements an unordered list', () => {
		const editor = document.querySelector('.marky-editor');
		editor.value = 'Some text\r\nSome other text';
		editor.setSelectionRange(0, 26);
		editor._marky.unorderedList();
		editor.value.should.equal('- Some text\n- Some other text');
	});
	it('implements an ordered list', () => {
		const editor = document.querySelector('.marky-editor');
		editor.value = 'Some text\r\nSome other text';
		editor.setSelectionRange(0, 26);
		editor._marky.orderedList();
		editor.value.should.equal('1. Some text\n2. Some other text');
	});
	it('implements an indent', () => {
		const editor = document.querySelector('.marky-editor');
		editor.value = '- Some text\r\n- Some other text';
		editor.setSelectionRange(0, 30);
		editor._marky.indent();
		editor.value.should.equal('    - Some text\n    - Some other text');
	});
	it('implements an outdent', () => {
		const editor = document.querySelector('.marky-editor');
		editor.value = '    - Some text\r\n    - Some other text';
		editor.setSelectionRange(0, 38);
		editor._marky.outdent();
		editor.value.should.equal('- Some text\n- Some other text');
	});
	it('undoes state', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		const editor = container.children[1];
		const state = [{markdown: '', html: '', selection: [0, 0]},{markdown: 'Some text', html: '<p>Some text</p>', selection: [0, 0]}];
		const index = 1;
		editor._marky.undo(1, state, index).should.equal(0);
	});
	it('does not undo state if state is at 0 index', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		const editor = container.children[1];
		const state = [{markdown: '', html: '', selection: [0, 0]},{markdown: 'Some text', html: '<p>Some text</p>', selection: [0, 0]}];
		const index = 0;
		editor._marky.undo(1, state, index).should.equal(0);
	});
	it('redoes state', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		const editor = container.children[1];
		const state = [{markdown: '', html: '', selection: [0, 0]},{markdown: 'Some text', html: '<p>Some text</p>', selection: [0, 0]}];
		const index = 0;
		editor._marky.redo(1, state, index).should.equal(1);
	});
	it('does not redo state if state is at last index', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		const editor = container.children[1];
		const state = [{markdown: '', html: '', selection: [0, 0]},{markdown: 'Some text', html: '<p>Some text</p>', selection: [0, 0]}];
		const index = 1;
		editor._marky.redo(1, state, index).should.equal(1);
	});
});
