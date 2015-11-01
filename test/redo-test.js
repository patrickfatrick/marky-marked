import chai from 'chai';
import {Map} from 'immutable';
import * as dispatcher from '../src/modules/dispatcher';

chai.should();
describe('redo', () => {

	it('returns a future state', () => {
		const initialState = [
			Map({markdown: '', html: ''}),
			Map({markdown: 'Some text', html: '<p>Some text</p>'})
		];
		const stateIndex = 0;
		let newState = dispatcher.redo(initialState, stateIndex);

		newState.get('markdown').should.not.be.empty;
		newState.get('html').should.not.be.empty;
	});

	it('returns a future state from the middle of the stack', () => {
		const initialState = [
			Map({markdown: '', html: ''}),
			Map({markdown: 'Some text', html: '<p>Some text</p>'}),
			Map({markdown: 'Some funny text', html: '<p>Some funny text</p>'}),
			Map({markdown: 'Some super funny text', html: '<p>Some super funny text</p>'})
		];
		const stateIndex = 1;
		let newState = dispatcher.redo(initialState, stateIndex);

		newState.get('markdown').should.equal('Some funny text');
		newState.get('html').should.equal('<p>Some funny text</p>');
	});

	it('returns the same state if it is the last in the stack', () => {
		const initialState = [
			Map({markdown: '', html: ''}),
			Map({markdown: 'Some text', html: '<p>Some text</p>'}),
			Map({markdown: 'Some funny text', html: '<p>Some funny text</p>'}),
			Map({markdown: 'Some super funny text', html: '<p>Some super funny text</p>'})
		];
		const stateIndex = 3;
		let newState = dispatcher.redo(initialState, stateIndex);

		newState.get('markdown').should.equal('Some super funny text');
		newState.get('html').should.equal('<p>Some super funny text</p>');
	});

});
