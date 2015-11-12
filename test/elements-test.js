import chai from 'chai';
import mark from '../src/modules/mark';
import {Element} from '../src/modules/Element';
import {BoldButton} from '../src/modules/Buttons';
import {HeadingSelect} from '../src/modules/Selects';
import {HeadingOption} from '../src/modules/Options';

chai.should();

describe('Element', () => {
	it('creates an element', () => {
		let element = new Element('div', 'element', 'element');

		element.should.be.an.instanceof(Element);
		element.title.should.equal('element');
		element.id.should.equal('element');
	});
	it('creates a button', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		mark();
		const editor = document.querySelector('.marky-editor');
		let element = new BoldButton('button', 'Bold', 'bold', editor);

		element.should.be.an.instanceof(Element);
		element.should.be.an.instanceof(BoldButton);
		element.title.should.equal('Bold');
		element.id.should.equal('bold');
	});
	it('creates a select', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		mark();
		const editor = document.querySelector('.marky-editor');
		let element = new HeadingSelect('select', 'Headings', 'headings', editor);

		element.should.be.an.instanceof(Element);
		element.should.be.an.instanceof(HeadingSelect);
		element.title.should.equal('Headings');
		element.id.should.equal('headings');
	});
	it('creates an option', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		mark();
		const editor = document.querySelector('.marky-editor');
		let element = new HeadingOption('option', 'Heading 1', 'heading-1');

		element.should.be.an.instanceof(Element);
		element.should.be.an.instanceof(HeadingOption);
		element.title.should.equal('Heading 1');
		element.element.textContent.should.equal('Heading 1');
		element.element.value.should.equal('heading-1');
	});
});
