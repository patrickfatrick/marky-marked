import test from 'tape';
import { update } from '../../src/utils/dispatcher';

test('update > handles updating state', (t) => {
  const initialState = [{ markdown: '', html: '', selection: [0, 0] }];
  const stateIndex = 0;
  const newState = update('Some text', [9, 9], initialState, stateIndex);

  t.equal(newState.state.length, 2);
  t.equal(newState.state[1].markdown, 'Some text');
  t.true(newState.state[1].html.includes('<p>Some text</p>'));
  t.deepEqual(newState.state[1].selection, [9, 9]);
  t.equal(newState.state[0].markdown, '');
  t.deepEqual(newState.state[0].selection, [0, 0]);
  t.equal(newState.index, 1);
  t.end();
});

test('update > adds to existing state', (t) => {
  const initialState = [
    { markdown: '', html: '', selection: [0, 0] },
    { markdown: 'Some text', html: '<p>Some text</p>', selection: [9, 9] },
  ];
  const stateIndex = 1;
  const newState = update('', [0, 0], initialState, stateIndex);

  t.equal(newState.state.length, 3);
  t.equal(newState.state[2].markdown, '');
  t.equal(newState.state[2].html, '');
  t.deepEqual(newState.state[2].selection, [0, 0]);
  t.equal(newState.state[1].markdown, 'Some text');
  t.deepEqual(newState.state[1].selection, [9, 9]);
  t.equal(newState.index, 2);
  t.end();
});

test('update > removes old states when there are 1000 of them', (t) => {
  const initialState = [
    { markdown: '', html: '', selection: [0, 0] },
    { markdown: 'Some text', html: '<p>Some text</p>', selection: [9, 9] },
  ];
  const stateIndex = 999;
  const newState = update('', [0, 0], initialState, stateIndex);

  t.equal(newState.state.length, 2);
  t.equal(newState.state[1].markdown, '');
  t.equal(newState.state[1].html, '');
  t.equal(newState.state[0].markdown, 'Some text');
  t.equal(newState.index, 999);
  t.end();
});
