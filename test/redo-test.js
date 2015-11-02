import chai from 'chai';
import {Map} from 'immutable';
import * as dispatcher from '../src/modules/dispatcher';

chai.should();
describe('redo', () => {

	it('returns a future state', () => {
		const initialState = [
			Map({markdown: '', html: ''}),
			Map({markdown: 'Some text', html: '<p>Some text</p>'}),
			Map({markdown: 'Some funny text', html: '<p>Some funny text</p>'}),
			Map({markdown: 'Some really funny text', html: '<p>Some really funny text</p>'}),
			Map({markdown: 'Some really funny awesome text', html: '<p>Some really funny awesome text</p>'}),
			Map({markdown: 'Some really funny awesome crazy text', html: '<p>Some really funny awesome crazy text</p>'})
		];
		const stateIndex = 0;
		let newState = dispatcher.redo(initialState, stateIndex).state;

		newState.get('markdown').should.not.be.empty;
		newState.get('html').should.not.be.empty;
	});

	it('returns a future state from the middle of the stack', () => {
		const initialState = [
			Map({markdown: '', html: ''}),
			Map({markdown: 'Some text', html: '<p>Some text</p>'}),
			Map({markdown: 'Some funny text', html: '<p>Some funny text</p>'}),
			Map({markdown: 'Some really funny text', html: '<p>Some really funny text</p>'}),
			Map({markdown: 'Some really funny awesome text', html: '<p>Some really funny awesome text</p>'}),
			Map({markdown: 'Some really funny awesome crazy text', html: '<p>Some really funny awesome crazy text</p>'}),
			Map({markdown: 'Some really super funny awesome crazy text', html: '<p>Some super really funny awesome crazy text</p>'})
		];
		const stateIndex = 1;
		let newState = dispatcher.redo(initialState, stateIndex).state;

		newState.get('markdown').should.equal('Some really super funny awesome crazy text');
		newState.get('html').should.contain('<p>Some super really funny awesome crazy text</p>');
	});

	it('returns the newest if it is less than 5 from the end in the stack', () => {
		const initialState = [
			Map({markdown: '', html: ''}),
			Map({markdown: 'Some text', html: '<p>Some text</p>'}),
			Map({markdown: 'Some funny text', html: '<p>Some funny text</p>'}),
			Map({markdown: 'Some super funny text', html: '<p>Some super funny text</p>'})
		];
		const stateIndex = 1;
		let newState = dispatcher.redo(initialState, stateIndex).state;

		newState.get('markdown').should.equal('Some super funny text');
		newState.get('html').should.equal('<p>Some super funny text</p>');
	});

});
