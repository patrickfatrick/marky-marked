import chai from 'chai';

chai.should();
describe('marky', () => {
	it('is added to the editor on init', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		const editor = container.children[1];

		editor._marky.should.be.ok;
	});
	it('has a state', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		const editor = container.children[1];

		editor._marky.state.should.be.an.instanceof(Array);
	});
	it('has an index', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		const editor = container.children[1];

		editor._marky.index.should.be.a('number');
	});
	it('has an update method', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		const editor = container.children[1];

		editor._marky.update.should.be.an.instanceof(Function);
	});
	it('has an undo method', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		const editor = container.children[1];

		editor._marky.undo.should.be.an.instanceof(Function);
	});
	it('has a redo method', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		const editor = container.children[1];

		editor._marky.redo.should.be.an.instanceof(Function);
	});
	it('has a redo method', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		const editor = container.children[1];

		editor._marky.redo.should.be.an.instanceof(Function);
	});
	it('has a setSelection method', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		const editor = container.children[1];

		editor._marky.setSelection.should.be.an.instanceof(Function);
	});
	it('has an expandSelectionForward method', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		const editor = container.children[1];

		editor._marky.expandSelectionForward.should.be.an.instanceof(Function);
	});
	it('has an expandSelectionBackward method', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		const editor = container.children[1];

		editor._marky.expandSelectionBackward.should.be.an.instanceof(Function);
	});
	it('has an moveCursorBackward method', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		const editor = container.children[1];

		editor._marky.moveCursorBackward.should.be.an.instanceof(Function);
	});
	it('has an moveCursorForward method', () => {
		const container = document.getElementsByTagName('marky-mark')[0];
		const editor = container.children[1];

		editor._marky.moveCursorForward.should.be.an.instanceof(Function);
	});
});
