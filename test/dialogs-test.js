import chai from 'chai';

chai.should();
describe('toolbar dialogs', () => {

	it('calls the image method', () => {
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 9);
		var source = document.querySelector('.image-source-input');
		var alt = document.querySelector('.image-alt-input');
		source.value = 'http://i.imgur.com/VlVsP.gif';
		alt.value = 'Chuck Chardonnay';
		document.querySelector('.insert-image').click();

		output.value.should.equal('<p>Some text<img src="http://i.imgur.com/VlVsP.gif" alt="Chuck Chardonnay"></p>\n');
	});

	it('calls the link method', () => {
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = 'Some text';
		editor.setSelectionRange(0, 9);
		var source = document.querySelector('.link-url-input');
		var alt = document.querySelector('.link-display-input');
		source.value = 'http://google.com';
		alt.value = 'Google';
		document.querySelector('.insert-link').click();

		output.value.should.equal('<p>Some text<a href="http://google.com">Google</a></p>\n');
	});

});
