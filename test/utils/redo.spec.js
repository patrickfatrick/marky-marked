import test from 'tape';
import { redo } from '../../src/utils/dispatcher';

const stateMock = [
  {
    markdown: '',
    html: '',
    selection: [0, 0],
  },
  {
    markdown: 'Some text',
    html: '<p>Some text</p>',
    selection: [0, 0],
  },
  {
    markdown: 'Some funny text',
    html: '<p>Some funny text</p>',
    selection: [0, 0],
  },
  {
    markdown: 'Some really funny text',
    html: '<p>Some really funny text</p>',
    selection: [0, 0],
  },
  {
    markdown: 'Some really funny awesome text',
    html: '<p>Some really funny awesome text</p>',
    selection: [0, 0],
  },
  {
    markdown: 'Some really funny awesome crazy text',
    html: '<p>Some really funny awesome crazy text</p>',
    selection: [36, 36],
  },
  {
    markdown: 'Some really super funny awesome crazy text',
    html: '<p>Some really super funny awesome crazy text</p>',
    selection: [0, 0],
  },
];

test('redo > returns a future state', (t) => {
  const stateIndex = 0;
  const newState = redo(5, stateMock, stateIndex).state;

  t.equal(newState.markdown, 'Some really funny awesome crazy text');
  t.equal(newState.html, '<p>Some really funny awesome crazy text</p>');
  t.deepEqual(newState.selection, [36, 36]);
  t.end();
});

test('redo > returns a future state from the middle of the stack', (t) => {
  const initialState = [...stateMock];
  initialState[6].selection = [42, 42];
  const stateIndex = 1;
  const newState = redo(5, initialState, stateIndex).state;

  t.equal(newState.markdown, 'Some really super funny awesome crazy text');
  t.equal(newState.html, '<p>Some really super funny awesome crazy text</p>');
  t.deepEqual(newState.selection, [42, 42]);
  t.end();
});

test('redo > returns the newest if it is less than the num specified from the end in the stack', (t) => {
  const initialState = [...stateMock];
  initialState[6].selection = [21, 21];
  const stateIndex = 3;
  const newState = redo(5, initialState, stateIndex).state;

  t.equal(newState.markdown, 'Some really super funny awesome crazy text');
  t.equal(newState.html, '<p>Some really super funny awesome crazy text</p>');
  t.deepEqual(newState.selection, [21, 21]);
  t.end();
});
