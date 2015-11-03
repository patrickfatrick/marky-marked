import chai from 'chai';
import {Map, List} from 'immutable';
import * as dispatcher from '../src/modules/dispatcher';

chai.should();
describe('undo', () => {

	it('returns a previous state', () => {
		const initialState = List([
			Map({markdown: '', html: ''}),
			Map({markdown: 'Some text', html: '<p>Some text</p>'}),
			Map({markdown: 'Some funny text', html: '<p>Some funny text</p>'}),
			Map({markdown: 'Some really funny text', html: '<p>Some really funny text</p>'}),
			Map({markdown: 'Some really funny awesome text', html: '<p>Some really funny awesome text</p>'}),
			Map({markdown: 'Some really funny awesome crazy text', html: '<p>Some really funny awesome crazy text</p>'})
		]);
		const stateIndex = 5;
		let newState = dispatcher.undo(initialState, stateIndex).state;

		newState.get('markdown').should.be.empty;
		newState.get('html').should.be.empty;
	});

	it('returns a previous state from the middle of the stack', () => {
		const initialState = List([
			Map({markdown: '', html: ''}),
			Map({markdown: 'Some text', html: '<p>Some text</p>'}),
			Map({markdown: 'Some funny text', html: '<p>Some funny text</p>'}),
			Map({markdown: 'Some really funny text', html: '<p>Some really funny text</p>'}),
			Map({markdown: 'Some really funny awesome text', html: '<p>Some really funny awesome text</p>'}),
			Map({markdown: 'Some really funny awesome crazy text', html: '<p>Some really funny awesome crazy text</p>'}),
			Map({markdown: 'Some really super funny awesome crazy text', html: '<p>Some super really funny awesome crazy text</p>'})
		]);
		const stateIndex = 5;
		let newState = dispatcher.undo(initialState, stateIndex).state;

		newState.get('markdown').should.be.empty;
		newState.get('html').should.be.empty;
	});

	it('returns oldest state if it is less than 5', () => {
		const initialState = List([
			Map({markdown: '', html: ''}),
			Map({markdown: 'Some text', html: '<p>Some text</p>'}),
			Map({markdown: 'Some funny text', html: '<p>Some funny text</p>'}),
			Map({markdown: 'Some super funny text', html: '<p>Some super funny text</p>'})
		]);
		const stateIndex = 3;
		let newState = dispatcher.undo(initialState, stateIndex).state;

		newState.get('markdown').should.be.empty;
		newState.get('html').should.be.empty;
	});

});
