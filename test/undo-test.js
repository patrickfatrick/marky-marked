import chai from 'chai';
import {Map} from 'immutable';
import * as dispatcher from '../src/modules/dispatcher';

chai.should();
describe('undo', () => {

	it('returns a previous state', () => {
		const initialState = [
			Map({markdown: '', html: ''}),
			Map({markdown: 'Some text', html: '<p>Some text</p>'})
		];
		const stateIndex = 1;
		let newState = dispatcher.undo(initialState, stateIndex);

		newState.get('markdown').should.be.empty;
		newState.get('html').should.be.empty;
	});

	it('returns a previous state from the middle of the stack', () => {
		const initialState = [
			Map({markdown: '', html: ''}),
			Map({markdown: 'Some text', html: '<p>Some text</p>'}),
			Map({markdown: 'Some funny text', html: '<p>Some funny text</p>'}),
			Map({markdown: 'Some super funny text', html: '<p>Some super funny text</p>'})
		];
		const stateIndex = 2;
		let newState = dispatcher.undo(initialState, stateIndex);

		newState.get('markdown').should.equal('Some text');
		newState.get('html').should.equal('<p>Some text</p>');
	});

	it('returns the same state if it is the first in the stack', () => {
		const initialState = [
			Map({markdown: '', html: ''}),
			Map({markdown: 'Some text', html: '<p>Some text</p>'}),
			Map({markdown: 'Some funny text', html: '<p>Some funny text</p>'}),
			Map({markdown: 'Some super funny text', html: '<p>Some super funny text</p>'})
		];
		const stateIndex = 0;
		let newState = dispatcher.undo(initialState, stateIndex);

		newState.get('markdown').should.be.empty;
		newState.get('html').should.be.empty;
	});

});
