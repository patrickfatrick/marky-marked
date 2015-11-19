import chai from 'chai';
import mark from '../src/modules/mark';

chai.should();

describe('mark', () => {
	it('creates a toolbar, a textarea, and a hidden input', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		container.children[0].tagName.toLowerCase().should.equal('div');
		container.children[0].classList.should.have.property('0', 'marky-toolbar');
		container.children[1].tagName.toLowerCase().should.equal('textarea');
		container.children[1].classList.should.have.property('0', 'marky-editor');
		container.children[2].type.should.equal('hidden');
		container.children[2].classList.should.have.property('0', 'marky-output');
	});
	it('creates a bunch of toolbar controls', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		container.children[0].children[0].tagName.toLowerCase().should.equal('select');
		container.children[0].children[0].children[0].tagName.toLowerCase().should.equal('option');
		container.children[0].children[1].classList.should.have.property('0', 'separator');
		container.children[0].children[2].classList.should.have.property('0', 'bold');
		container.children[0].children[3].classList.should.have.property('0', 'italic');
		container.children[0].children[4].classList.should.have.property('0', 'strikethrough');
		container.children[0].children[5].classList.should.have.property('0', 'code');
		container.children[0].children[6].classList.should.have.property('0', 'blockquote');
		container.children[0].children[8].classList.should.have.property('0', 'link');
		container.children[0].children[9].classList.should.have.property('0', 'image');
		container.children[0].children[11].classList.should.have.property('0', 'unordered-list');
		container.children[0].children[12].classList.should.have.property('0', 'ordered-list');
		container.children[0].children[13].classList.should.have.property('0', 'outdent');
		container.children[0].children[14].classList.should.have.property('0', 'indent');
		container.children[0].children[16].classList.should.have.property('0', 'undo');
		container.children[0].children[17].classList.should.have.property('0', 'redo');
	});
	it('initializes on marky-mark tags by default', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		const anotherContainer = document.getElementsByTagName('funky-bunch')[0];
		chai.expect(anotherContainer.children[0]).to.be.undefined;
		container.children[0].tagName.toLowerCase().should.equal('div');
		container.children[0].classList.should.have.property('0', 'marky-toolbar');
		container.children[1].tagName.toLowerCase().should.equal('textarea');
		container.children[1].classList.should.have.property('0', 'marky-editor');
		container.children[2].type.should.equal('hidden');
		container.children[2].classList.should.have.property('0', 'marky-output');
	});
	it('initializes on multiple elements', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		const anotherContainer = document.getElementsByTagName('funky-bunch')[0];
		const yetAnotherContainer = document.getElementsByTagName('marky-mark')[1];
		chai.expect(anotherContainer.children[0]).to.be.undefined;
		yetAnotherContainer.children[0].tagName.toLowerCase().should.equal('div');
		yetAnotherContainer.children[0].classList.should.have.property('0', 'marky-toolbar');
		container.children[0].tagName.toLowerCase().should.equal('div');
		container.children[0].classList.should.have.property('0', 'marky-toolbar');
		container.children[1].tagName.toLowerCase().should.equal('textarea');
		container.children[1].classList.should.have.property('0', 'marky-editor');
		container.children[2].type.should.equal('hidden');
		container.children[2].classList.should.have.property('0', 'marky-output');
	});
	it('checks that the element is empty', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		const anotherContainer = document.createElement('marky-mark');
		document.body.appendChild(anotherContainer);
		mark();
		container.children.length.should.equal(3);
		anotherContainer.children.length.should.equal(3);
	});
});
