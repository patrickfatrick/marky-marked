import chai from 'chai';
import jsdom from 'mocha-jsdom';
import mark from '../src/modules/mark';

chai.should();

describe('mark', () => {
	it('works in the DOM', () => {
		var container = document.createElement('marky-mark');
		container.tagName.toLowerCase().should.equal('marky-mark');
	});
	it('creates a toolbar, a textarea, and a hidden input', () => {
		var container = document.createElement('marky-mark');
		document.body.appendChild(container);
		mark('marky-mark');
		container.children[0].tagName.toLowerCase().should.equal('div');
		container.children[0].classList.should.have.property('0', 'marky-toolbar');
		container.children[1].tagName.toLowerCase().should.equal('textarea');
		container.children[1].classList.should.have.property('0', 'marky-editor');
		container.children[2].type.should.equal('hidden');
		container.children[2].classList.should.have.property('0', 'marky-output');
	});
	it('initializes on marky-mark tags by default', () => {
		var container = document.createElement('marky-mark');
		var anotherContainer = document.createElement('funky-bunch');
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
		var container = document.createElement('marky-mark');
		var anotherContainer = document.createElement('funky-bunch');
		var yetAnotherContainer = document.createElement('marky-mark');
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
