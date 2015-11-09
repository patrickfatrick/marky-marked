import chai from 'chai';
import jsdom from 'jsdom';
import mark from '../src/modules/mark';
import * as dispatcher from '../src/modules/dispatcher';

chai.should();
describe('update', () => {

	it('handles updating state', () => {
		const initialState = [{markdown: '', html: ''}];
		const stateIndex = 0;
		let newState = dispatcher.update('Some text', initialState, stateIndex);

		newState.state.length.should.equal(2);
		newState.state[1].markdown.should.equal('Some text');
		newState.state[1].html.should.contain('<p>Some text</p>');
		newState.state[0].markdown.should.be.empty;
		newState.index.should.equal(1);
	});

	it('adds to existing state', () => {
		const initialState = [
			{markdown: '', html: ''},
			{markdown: 'Some text', html: '<p>Some text</p>'}
		];
		const stateIndex = 1;
		let newState = dispatcher.update('', initialState, stateIndex);

		newState.state.length.should.equal(3);
		newState.state[2].markdown.should.be.empty;
		newState.state[2].html.should.be.empty;
		newState.state[1].markdown.should.equal('Some text');
		newState.index.should.equal(2);
	});

	it('is triggered by an update event', () => {
		var container = document.createElement('marky-mark');
		document.body.appendChild(container);
		mark('marky-mark');
		container.children[1].value = 'Some text';

		var evt = document.createEvent('HTMLEvents');
		evt.initEvent('update', false, true);
		container.children[1].dispatchEvent(evt);

		container.children[2].value.should.contain('<p>Some text</p>');
	});

});
