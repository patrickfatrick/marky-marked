import test from 'tape';
import { indentHandler } from '../../src/utils/handlers';

test('indent-handler > adds four spaces to the beginning of a line', (t) => {
  const string = 'Some text';
  const indices = [0, 9];

  const indentify = indentHandler(string, indices, 'in');

  t.equal(indentify.value, '    Some text');
  t.deepEqual(indentify.range, [0, 13]);
  t.end();
});

test('indent-handler > does not matter where the selection is on that line', (t) => {
  const string = 'Some text';
  const indices = [9, 9];

  const indentify = indentHandler(string, indices, 'in');

  t.equal(indentify.value, '    Some text');
  t.deepEqual(indentify.range, [0, 13]);
  t.end();
});

test('indent-handler > works with multi-line selections', (t) => {
  const string = 'Some text\r\nSome other text';
  const indices = [0, 26];

  const indentify = indentHandler(string, indices, 'in');

  t.equal(indentify.value, '    Some text\r\n    Some other text');
  t.deepEqual(indentify.range, [0, 33]);
  t.end();
});

test('indent-handler > ignores other lines around the selection', (t) => {
  const string = 'Some text\r\nSome other text';
  const indices = [11, 26];
  const indentify = indentHandler(string, indices, 'in');

  t.equal(indentify.value, 'Some text\r\n    Some other text');
  t.deepEqual(indentify.range, [11, 30]);
  t.end();
});

test('indent-handler > does not remove block or list formatting', (t) => {
  const string = '- Some text';
  const indices = [0, 11];

  const indentify = indentHandler(string, indices, 'in');

  t.equal(indentify.value, '    - Some text');
  t.deepEqual(indentify.range, [0, 15]);
  t.end();
});

test('indent-handler > does not remove block or list formatting on outdent', (t) => {
  const string = '    - Some text';
  const indices = [0, 15];

  const indentify = indentHandler(string, indices, 'out');

  t.equal(indentify.value, '- Some text');
  t.deepEqual(indentify.range, [0, 11]);
  t.end();
});

test('indent-handler > considers inline formats to be text', (t) => {
  const string = '**Some text**';
  const indices = [0, 13];

  const indentify = indentHandler(string, indices, 'in');

  t.equal(indentify.value, '    **Some text**');
  t.deepEqual(indentify.range, [0, 17]);
  t.end();
});

test('indent-handler > also considers inline formats to be text on outdent', (t) => {
  const string = '    **Some text**';
  const indices = [0, 17];

  const indentify = indentHandler(string, indices, 'out');

  t.equal(indentify.value, '**Some text**');
  t.deepEqual(indentify.range, [0, 13]);
  t.end();
});

test('indent-handler > works on a blank line', (t) => {
  const string = '';
  const indices = [0, 0];

  const indentify = indentHandler(string, indices, 'in');

  t.equal(indentify.value, '    ');
  t.deepEqual(indentify.range, [0, 4]);
  t.end();
});

test('indent-handler > outdents on lines with multiple indents', (t) => {
  const string = '        Some text';
  const indices = [0, 17];

  const indentify = indentHandler(string, indices, 'out');

  t.equal(indentify.value, '    Some text');
  t.deepEqual(indentify.range, [0, 13]);
  t.end();
});

test('indent-handler > outdents on lines with less than a full indent', (t) => {
  const string = ' Some text';
  const indices = [0, 10];

  const indentify = indentHandler(string, indices, 'out');

  t.equal(indentify.value, 'Some text');
  t.deepEqual(indentify.range, [0, 9]);
  t.end();
});

test('indent-handler > outdents on lines with less than a full indent and an unordered list format string', (t) => {
  const string = ' - Some text';
  const indices = [0, 12];

  const indentify = indentHandler(string, indices, 'out');

  t.equal(indentify.value, '- Some text');
  t.deepEqual(indentify.range, [0, 11]);
  t.end();
});

test('indent-handler > outdents on lines with less than a full indent and an ordered list format string', (t) => {
  const string = ' 1. Some text';
  const indices = [0, 13];

  const indentify = indentHandler(string, indices, 'out');

  t.equal(indentify.value, '1. Some text');
  t.deepEqual(indentify.range, [0, 12]);
  t.end();
});

test('indent-handler > indents several lines', (t) => {
  const string = '- Some text\r\n- Some other text\r\n- Even more text';
  const indices = [0, 48];

  const indentify = indentHandler(string, indices, 'in');

  t.equal(indentify.value, '    - Some text\r\n    - Some other text\r\n    - Even more text');
  t.deepEqual(indentify.range, [0, 58]);
  t.end();
});

test('indent-handler > outdents several lines', (t) => {
  const string = '    1. Some text\r\n    2. Some other text\r\n    3. Even more text';
  const indices = [0, 63];

  const indentify = indentHandler(string, indices, 'out');

  t.equal(indentify.value, '1. Some text\r\n2. Some other text\r\n3. Even more text');
  t.deepEqual(indentify.range, [0, 49]);
  t.end();
});

test('indent-handler > outdents several lines with less than a full indent on each line', (t) => {
  const string = '  1. Some text\r\n  2. Some other text\r\n  3. Even more text';
  const indices = [0, 57];

  const indentify = indentHandler(string, indices, 'out');

  t.equal(indentify.value, '1. Some text\r\n2. Some other text\r\n3. Even more text');
  t.deepEqual(indentify.range, [0, 49]);
  t.end();
});

test('indent-handler > outdents several lines with a mix of indents', (t) => {
  const string = '    1. Some text\r\n  2. Some other text\r\n   3. Even more text';
  const indices = [0, 60];

  const indentify = indentHandler(string, indices, 'out');

  t.equal(indentify.value, '1. Some text\r\n2. Some other text\r\n3. Even more text');
  t.deepEqual(indentify.range, [0, 49]);
  t.end();
});
