import chai from 'chai';
import jsdom from 'jsdom';
import mark from '../src/modules/mark';

chai.should();

describe('mark', () => {
	it('works in the DOM', () => {
		const container = document.createElement('marky-mark');
		container.tagName.toLowerCase().should.equal('marky-mark');
	});
	it('creates a toolbar, a textarea, and a hidden input', () => {
		const container = document.createElement('marky-mark');
		document.body.appendChild(container);
		mark('marky-mark');
		container.children[0].tagName.toLowerCase().should.equal('div');
		container.children[0].classList.should.have.property('0', 'marky-toolbar');
		container.children[1].tagName.toLowerCase().should.equal('textarea');
		container.children[1].classList.should.have.property('0', 'marky-editor');
		container.children[2].type.should.equal('hidden');
		container.children[2].classList.should.have.property('0', 'marky-output');
	});
	it('creates a bunch of toolbar controls', () => {
		const container = document.createElement('marky-mark');
		document.body.appendChild(container);
		mark('marky-mark');
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
		container.children[0].children[14].classList.should.have.property('0', 'undo');
		container.children[0].children[15].classList.should.have.property('0', 'redo');
	});
	it('initializes on marky-mark tags by default', () => {
		const container = document.createElement('marky-mark');
		const anotherContainer = document.createElement('funky-bunch');
		document.body.appendChild(container);
		document.body.appendChild(anotherContainer);
		mark();
		anotherContainer.children.should.be.empty;
		container.children[0].tagName.toLowerCase().should.equal('div');
		container.children[0].classList.should.have.property('0', 'marky-toolbar');
		container.children[1].tagName.toLowerCase().should.equal('textarea');
		container.children[1].classList.should.have.property('0', 'marky-editor');
		container.children[2].type.should.equal('hidden');
		container.children[2].classList.should.have.property('0', 'marky-output');
	});
	it('initializes on multiple elements', () => {
		const container = document.createElement('marky-mark');
		const anotherContainer = document.createElement('funky-bunch');
		const yetAnotherContainer = document.createElement('marky-mark');
		document.body.appendChild(container);
		document.body.appendChild(anotherContainer);
		document.body.appendChild(yetAnotherContainer);
		mark();
		anotherContainer.children.should.be.empty;
		yetAnotherContainer.children[0].tagName.toLowerCase().should.equal('div');
		yetAnotherContainer.children[0].classList.should.have.property('0', 'marky-toolbar');
		container.children[0].tagName.toLowerCase().should.equal('div');
		container.children[0].classList.should.have.property('0', 'marky-toolbar');
		container.children[1].tagName.toLowerCase().should.equal('textarea');
		container.children[1].classList.should.have.property('0', 'marky-editor');
		container.children[2].type.should.equal('hidden');
		container.children[2].classList.should.have.property('0', 'marky-output');
	});

})
