import chai from 'chai';
import {markyupdate} from '../src/modules/custom-events';
import * as dispatcher from '../src/modules/dispatcher';

chai.should();
describe('update', () => {

	it('handles updating state', () => {
		const initialState = [{markdown: '', html: '', selection: [0, 0]}];
		const stateIndex = 0;
		let newState = dispatcher.update('Some text', [9, 9], initialState, stateIndex);

		newState.state.length.should.equal(2);
		newState.state[1].markdown.should.equal('Some text');
		newState.state[1].html.should.contain('<p>Some text</p>');
		newState.state[1].selection.should.include.members([9, 9]);
		newState.state[0].markdown.should.be.empty;
		newState.state[0].selection.should.include.members([0, 0]);
		newState.index.should.equal(1);
	});

	it('adds to existing state', () => {
		const initialState = [
			{markdown: '', html: '', selection: [0, 0]},
			{markdown: 'Some text', html: '<p>Some text</p>', selection: [9, 9]}
		];
		const stateIndex = 1;
		let newState = dispatcher.update('', [0, 0], initialState, stateIndex);

		newState.state.length.should.equal(3);
		newState.state[2].markdown.should.be.empty;
		newState.state[2].html.should.be.empty;
		newState.state[2].selection.should.include.members([0, 0]);
		newState.state[1].markdown.should.equal('Some text');
		newState.state[1].selection.should.include.members([9, 9]);
		newState.index.should.equal(2);
	});

	it('removes old states when there are 500 of them', () => {
		const initialState = [
			{markdown: '', html: '', selection: [0, 0]},
			{markdown: 'Some text', html: '<p>Some text</p>', selection: [9, 9]}
		];
		const stateIndex = 499;
		let newState = dispatcher.update('', [0, 0], initialState, stateIndex);

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
		editor.dispatchEvent(markyupdate);

		output.value.should.contain('<p>Some text</p>');
	});

});
