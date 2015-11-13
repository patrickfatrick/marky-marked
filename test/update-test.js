import chai from 'chai';
import {update} from '../src/modules/custom-events';
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

	it('removes old states when there are 500 of them', () => {
		const initialState = [
			{markdown: '', html: ''},
			{markdown: 'Some text', html: '<p>Some text</p>'}
		];
		const stateIndex = 499;
		let newState = dispatcher.update('', initialState, stateIndex);

		newState.state.length.should.equal(2);
		newState.state[1].markdown.should.be.empty;
		newState.state[1].html.should.be.empty;
		newState.state[0].markdown.should.equal('Some text');
		newState.index.should.equal(499);
	});

	it('is triggered by an update event', () => {
		const editor = document.querySelector('.marky-editor');
		const output = document.querySelector('.marky-output');
		editor.value = 'Some text';
		editor.dispatchEvent(update);

		output.value.should.contain('<p>Some text</p>');
	});

});
