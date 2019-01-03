import test from 'tape';
import Store from '../src/Store';

test('Store > update > handles updating state', (t) => {
  const store = new Store([{ markdown: '', html: '', selection: [0, 0] }]);
  store.update('Some text', [9, 9]);

  t.equal(store.timeline.length, 2);
  t.equal(store.timeline[1].markdown, 'Some text');
  t.true(store.timeline[1].html.includes('<p>Some text</p>'));
  t.deepEqual(store.timeline[1].selection, [9, 9]);
  t.equal(store.timeline[0].markdown, '');
  t.deepEqual(store.timeline[0].selection, [0, 0]);
  t.equal(store.index, 1);
  t.end();
});

test('Store > update > adds to existing state', (t) => {
  const store = new Store([
    { markdown: '', html: '', selection: [0, 0] },
    { markdown: 'Some text', html: '<p>Some text</p>', selection: [9, 9] },
  ]);
  store.index = 1;
  store.update('', [0, 0]);

  t.equal(store.timeline.length, 3);
  t.equal(store.timeline[2].markdown, '');
  t.equal(store.timeline[2].html, '');
  t.deepEqual(store.timeline[2].selection, [0, 0]);
  t.equal(store.timeline[1].markdown, 'Some text');
  t.deepEqual(store.timeline[1].selection, [9, 9]);
  t.equal(store.index, 2);
  t.end();
});

test('Store > update > removes old states when there are 1000 of them', (t) => {
  const store = new Store([
    { markdown: '', html: '', selection: [0, 0] },
    { markdown: 'Some text', html: '<p>Some text</p>', selection: [9, 9] },
  ]);
  store.index = 999;
  store.update('', [0, 0]);

  t.equal(store.timeline.length, 2);
  t.equal(store.timeline[1].markdown, '');
  t.equal(store.timeline[1].html, '');
  t.equal(store.timeline[0].markdown, 'Some text');
  t.equal(store.index, 999);
  t.end();
});

let timelineMock = [
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
    selection: [0, 0],
  },
  {
    markdown: 'Some really super funny awesome crazy text',
    html: '<p>Some really super funny awesome crazy text</p>',
    selection: [0, 0],
  },
];

test('Store > redo > returns a future state', (t) => {
  const store = new Store(timelineMock);
  store.redo(5);

  t.equal(store.state.markdown, 'Some really funny awesome crazy text');
  t.equal(store.state.html, '<p>Some really funny awesome crazy text</p>');
  t.deepEqual(store.state.selection, [0, 0]);
  t.end();
});

test('Store > redo > returns a future state from the middle of the stack', (t) => {
  const store = new Store([...timelineMock]);
  store.index = 1;
  store.redo(5);

  t.deepEqual(store.state, {
    markdown: 'Some really super funny awesome crazy text',
    html: '<p>Some really super funny awesome crazy text</p>',
    selection: [0, 0],
  });
  t.end();
});

test('Store > redo > returns the newest if it is less than the num specified from the end in the stack', (t) => {
  const store = new Store([...timelineMock]);
  store.index = 3;
  store.redo(5);

  t.deepEqual(store.state, {
    markdown: 'Some really super funny awesome crazy text',
    html: '<p>Some really super funny awesome crazy text</p>',
    selection: [0, 0],
  });
  t.end();
});

timelineMock = [
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
    selection: [0, 0],
  },
  {
    markdown: 'Some really super funny awesome crazy text',
    html: '<p>Some really super funny awesome crazy text</p>',
    selection: [0, 0],
  },
];

test('Store > undo > returns a previous state', (t) => {
  const store = new Store([...timelineMock]);
  store.index = 5;
  store.undo(1);

  t.deepEqual(store.state, {
    markdown: 'Some really funny awesome text',
    html: '<p>Some really funny awesome text</p>',
    selection: [0, 0],
  });
  t.end();
});

test('Store > undo > returns a previous state from the middle of the stack', (t) => {
  const store = new Store([...timelineMock]);
  store.index = 5;
  store.undo(5);

  t.deepEqual(store.state, {
    markdown: '',
    html: '',
    selection: [0, 0],
  });
  t.end();
});

test('Store > undo > returns oldest state if state index is less than the num specified', (t) => {
  const store = new Store([...timelineMock]);
  store.index = 3;
  store.undo(5);

  t.deepEqual(store.state, {
    markdown: '',
    html: '',
    selection: [0, 0],
  });
  t.end();
});
