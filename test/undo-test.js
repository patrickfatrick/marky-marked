import chai from 'chai';
import * as dispatcher from '../src/modules/dispatcher';

chai.should();
describe('undo', () => {

	it('returns a previous state', () => {
		const initialState = [
			{markdown: '', html: ''},
			{markdown: 'Some text', html: '<p>Some text</p>'},
			{markdown: 'Some funny text', html: '<p>Some funny text</p>'},
			{markdown: 'Some really funny text', html: '<p>Some really funny text</p>'},
			{markdown: 'Some really funny awesome text', html: '<p>Some really funny awesome text</p>'},
			{markdown: 'Some really funny awesome crazy text', html: '<p>Some really funny awesome crazy text</p>'}
		];
		const stateIndex = 5;
		let newState = dispatcher.undo(initialState, stateIndex).state;

		newState.markdown.should.be.empty;
		newState.html.should.be.empty;
	});

	it('returns a previous state from the middle of the stack', () => {
		const initialState = [
			{markdown: '', html: ''},
			{markdown: 'Some text', html: '<p>Some text</p>'},
			{markdown: 'Some funny text', html: '<p>Some funny text</p>'},
			{markdown: 'Some really funny text', html: '<p>Some really funny text</p>'},
			{markdown: 'Some really funny awesome text', html: '<p>Some really funny awesome text</p>'},
			{markdown: 'Some really funny awesome crazy text', html: '<p>Some really funny awesome crazy text</p>'},
			{markdown: 'Some really super funny awesome crazy text', html: '<p>Some super really funny awesome crazy text</p>'}
		];
		const stateIndex = 5;
		let newState = dispatcher.undo(initialState, stateIndex).state;

		newState.markdown.should.be.empty;
		newState.html.should.be.empty;
	});

	it('returns oldest state if it is less than 5', () => {
		const initialState = [
			{markdown: '', html: ''},
			{markdown: 'Some text', html: '<p>Some text</p>'},
			{markdown: 'Some funny text', html: '<p>Some funny text</p>'},
			{markdown: 'Some super funny text', html: '<p>Some super funny text</p>'}
		];
		const stateIndex = 3;
		let newState = dispatcher.undo(initialState, stateIndex).state;

		newState.markdown.should.be.empty;
		newState.html.should.be.empty;
	});

});
