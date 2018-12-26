import test from 'tape';
import sinon from 'sinon';
import initializer from '../src/initializer';

const container = document.createElement('marky-mark');
document.body.appendChild(container);
const marky = initializer(container);
const { editor } = marky;

test('Marky > has n id', (t) => {
  t.true(marky.id.length > 0);
  t.end();
});

test('Marky > has a state', (t) => {
  t.true(marky.state instanceof Array);
  t.end();
});

test('Marky > has an index', (t) => {
  t.true(typeof marky.index === 'number');
  t.end();
});

test('Marky > destroy', (t) => {
  const newContainer = document.createElement('marky-mark');
  document.body.appendChild(newContainer);
  const newMarky = initializer(newContainer);

  t.ok(document.getElementById(newContainer.id));
  newMarky.destroy();
  t.notOk(document.getElementById(newContainer.id));
  t.end();
});

test('Marky > update', (t) => {
  sinon.spy(marky, 'emit');
  editor.value = 'Some text';
  const { length } = marky.state;
  marky.update(editor.value);

  t.equal(marky.state.length, length + 1);
  t.true(marky.emit.calledWith('markychange'));
  marky.emit.restore();
  t.end();
});

test('Marky > update is triggered by a markyupdate event', (t) => {
  sinon.spy(marky, 'update');
  marky.emit('markyupdate');

  t.true(marky.update.calledOnce);
  marky.update.restore();
  t.end();
});

test('Marky > undo', (t) => {
  sinon.spy(marky, 'emit');
  marky.index = 1;
  marky.undo(1);

  t.equal(marky.index, 0);
  t.true(marky.emit.calledWith('markychange'));
  marky.emit.restore();
  t.end();
});

test('Marky > redo', (t) => {
  sinon.spy(marky, 'emit');
  marky.index = 0;
  marky.redo(1);

  t.equal(marky.index, 1);
  t.true(marky.emit.calledWith('markychange'));
  marky.emit.restore();
  t.end();
});

test('Marky > setSelection', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 0);
  marky.setSelection([0, 9]);

  t.equal(editor.selectionStart, 0);
  t.equal(editor.selectionEnd, 9);
  t.end();
});

test('Marky > expandSelectionForward', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 0);
  marky.expandSelectionForward(1);

  t.equal(editor.selectionStart, 0);
  t.equal(editor.selectionEnd, 1);
  t.end();
});

test('Marky > expandSelectionBackward', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(9, 9);
  marky.expandSelectionBackward(1);

  t.equal(editor.selectionStart, 8);
  t.equal(editor.selectionEnd, 9);
  t.end();
});

test('Marky > moveCursorForward', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 0);
  marky.moveCursorForward(1);

  t.equal(editor.selectionStart, 1);
  t.equal(editor.selectionEnd, 1);
  t.end();
});

test('Marky > moveCursorBackward', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(9, 9);
  marky.moveCursorBackward(1);

  t.equal(editor.selectionStart, 8);
  t.equal(editor.selectionEnd, 8);
  t.end();
});

test('Marky > bold', (t) => {
  sinon.spy(marky, 'emit');
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  marky.bold();

  t.equal(marky.html, '<p><strong>Some text</strong></p>\n');
  t.true(marky.emit.calledWith('markychange'));
  marky.emit.restore();
  t.end();
});

test('Marky > italic', (t) => {
  sinon.spy(marky, 'emit');
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  marky.italic();

  t.equal(marky.html, '<p><em>Some text</em></p>\n');
  t.true(marky.emit.calledWith('markychange'));
  marky.emit.restore();
  t.end();
});

test('Marky > strikethrough', (t) => {
  sinon.spy(marky, 'emit');
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  marky.strikethrough();

  t.equal(marky.html, '<p><del>Some text</del></p>\n');
  t.true(marky.emit.calledWith('markychange'));
  marky.emit.restore();
  t.end();
});

test('Marky > code', (t) => {
  sinon.spy(marky, 'emit');
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  marky.code();

  t.equal(marky.html, '<p><code>Some text</code></p>\n');
  t.true(marky.emit.calledWith('markychange'));
  marky.emit.restore();
  t.end();
});

test('Marky > blockquote', (t) => {
  sinon.spy(marky, 'emit');
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  marky.blockquote();

  t.equal(marky.html, '<blockquote>\n<p>Some text</p>\n</blockquote>\n');
  t.true(marky.emit.calledWith('markychange'));
  marky.emit.restore();
  t.end();
});

test('Marky > heading', (t) => {
  sinon.spy(marky, 'emit');
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  marky.heading(1);

  t.equal(marky.html, '<h1 id="some-text">Some text</h1>\n');
  t.true(marky.emit.calledWith('markyupdate'));
  marky.emit.restore();
  t.end();
});

test('Marky > heading with a default of 0', (t) => {
  sinon.spy(marky, 'emit');
  editor.value = '# Some text';
  editor.setSelectionRange(2, 9);
  marky.heading();

  t.equal(marky.html, '<p>Some text</p>\n');
  t.true(marky.emit.calledWith('markyupdate'));

  marky.emit.restore();
  t.end();
});

test('Marky > link', (t) => {
  sinon.spy(marky, 'emit');
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  marky.link([0, 9], 'http://google.com', 'Some text');

  t.equal(editor.value, '[Some text](http://google.com)');
  t.equal(editor.selectionStart, 0);
  t.equal(editor.selectionEnd, editor.value.length);
  t.true(marky.emit.calledWith('markyupdate'));

  marky.emit.restore();
  t.end();
});

test('Marky > link default snippet', (t) => {
  sinon.spy(marky, 'emit');
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  marky.link();

  t.equal(editor.value, '[http://url.com](http://url.com)');
  t.equal(editor.selectionStart, 0);
  t.equal(editor.selectionEnd, editor.value.length);
  t.true(marky.emit.calledWith('markyupdate'));
  marky.emit.restore();
  t.end();
});

test('Marky > image', (t) => {
  sinon.spy(marky, 'emit');
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  marky.image([0, 9], 'http://i.imgur.com/VlVsP.gif', 'Chuck Chardonnay');

  t.equal(editor.value, '![Chuck Chardonnay](http://i.imgur.com/VlVsP.gif)');
  t.equal(editor.selectionStart, 0);
  t.equal(editor.selectionEnd, editor.value.length);
  t.true(marky.emit.calledWith('markyupdate'));
  marky.emit.restore();
  t.end();
});

test('Marky > image default snippet', (t) => {
  sinon.spy(marky, 'emit');
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  marky.image();

  t.equal(editor.value, '![http://imagesource.com/image.jpg](http://imagesource.com/image.jpg)');
  t.equal(editor.selectionStart, 0);
  t.equal(editor.selectionEnd, editor.value.length);
  t.true(marky.emit.calledWith('markyupdate'));
  marky.emit.restore();
  t.end();
});

test('Marky > unorderedList', (t) => {
  sinon.spy(marky, 'emit');
  editor.value = 'Some text\r\nSome other text';
  editor.setSelectionRange(0, 26);
  marky.unorderedList();

  t.equal(editor.value, '- Some text\n- Some other text');
  t.true(marky.emit.calledWith('markyupdate'));
  marky.emit.restore();
  t.end();
});

test('Marky > orderedList', (t) => {
  sinon.spy(marky, 'emit');
  editor.value = 'Some text\r\nSome other text';
  editor.setSelectionRange(0, 26);
  marky.orderedList();

  t.equal(editor.value, '1. Some text\n2. Some other text');
  t.true(marky.emit.calledWith('markyupdate'));
  marky.emit.restore();
  t.end();
});

test('Marky > indent', (t) => {
  editor.value = '- Some text\r\n- Some other text';
  editor.setSelectionRange(0, 30);
  marky.indent();

  t.equal(editor.value, '    - Some text\n    - Some other text');
  t.end();
});

test('Marky > outdent', (t) => {
  editor.value = '    - Some text\r\n    - Some other text';
  editor.setSelectionRange(0, 38);
  marky.outdent();

  t.equal(editor.value, '- Some text\n- Some other text');
  t.end();
});

test('Marky > undoes state', (t) => {
  const state = [
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
  ];
  const index = 1;

  t.equal(marky.undo(1, state, index), 0);
  t.end();
});

test('Marky > does not undo state if state is at 0 index', (t) => {
  const state = [
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
  ];
  const index = 0;

  t.equal(marky.undo(1, state, index), 0);
  t.end();
});

test('Marky > redoes state', (t) => {
  const state = [
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
  ];
  const index = 0;

  t.equal(marky.redo(1, state, index), 1);
  t.end();
});

test('Marky > does not redo state if state is at last index', (t) => {
  const state = [
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
  ];
  const index = 1;

  t.equal(marky.redo(1, state, index), 1);
  t.end();
});
