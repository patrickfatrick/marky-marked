import test from 'tape';
import { blockHandler } from '../../src/utils/markdownHandlers';

test('block-handler > adds a formatting string to the beginning of a line', (t) => {
  const string = 'Some text';
  const indices = [0, 9];

  const headingify = blockHandler(string, indices, '# ');

  t.equal(headingify.value, '# Some text');
  t.deepEqual(headingify.range, [2, 11]);
  t.end();
});

test('block-handler > adds a formatting string to the beginning of a line', (t) => {
  const string = 'Some text';
  const indices = [0, 9];

  const headingify = blockHandler(string, indices, '# ');

  t.equal(headingify.value, '# Some text');
  t.deepEqual(headingify.range, [2, 11]);
  t.end();
});

test('block-handler > does not matter where the selection is on that line', (t) => {
  const string = 'Some text';
  const indices = [9, 9];

  const quotify = blockHandler(string, indices, '> ');

  t.equal(quotify.value, '> Some text');
  t.deepEqual(quotify.range, [11, 11]);
  t.end();
});

test('block-handler > works with multi-line selections', (t) => {
  const string = 'Some text\r\nSome other text';
  const indices = [0, 26];

  const headingify = blockHandler(string, indices, '## ');

  t.equal(headingify.value, '## Some text\r\nSome other text');
  t.deepEqual(headingify.range, [3, 29]);
  t.end();
});

test('block-handler > ignores other lines around the selection', (t) => {
  const string = 'Some text\r\nSome other text';
  const indices = [11, 26];

  const headingify = blockHandler(string, indices, '# ');

  t.equal(headingify.value, 'Some text\r\n# Some other text');
  t.deepEqual(headingify.range, [13, 28]);
  t.end();
});

test('block-handler > removes all other block formatting', (t) => {
  const string = '# Some text';
  const indices = [0, 11];

  const headingify = blockHandler(string, indices, '### ');

  t.equal(headingify.value, '### Some text');
  t.deepEqual(headingify.range, [4, 13]);
  t.end();
});

test('block-handler > removes all other block formatting even if format string is directly touching text', (t) => {
  const string = '> Some text';
  const indices = [0, 10];

  const headingify = blockHandler(string, indices, '## ');

  t.equal(headingify.value, '## Some text');
  t.deepEqual(headingify.range, [3, 11]);
  t.end();
});

test('block-handler > considers inline formats to be text', (t) => {
  const string = '**Some text**';
  const indices = [0, 13];

  const headingify = blockHandler(string, indices, '## ');

  t.equal(headingify.value, '## **Some text**');
  t.deepEqual(headingify.range, [3, 16]);
  t.end();
});

test('block-handler > also considers inline formats to be text when removing other block formats', (t) => {
  const string = '> **Some text**';
  const indices = [0, 15];

  const headingify = blockHandler(string, indices, '## ');

  t.equal(headingify.value, '## **Some text**');
  t.deepEqual(headingify.range, [3, 16]);
  t.end();
});

test('block-handler > also considers list formats to be text when removing other block formats', (t) => {
  const string = '> 1. Some text';
  const indices = [0, 14];

  const headingify = blockHandler(string, indices, '> ');

  t.equal(headingify.value, '1. Some text');
  t.deepEqual(headingify.range, [0, 12]);
  t.end();
});

test('block-handler > also considers list formats to be text when exchanging block formats', (t) => {
  const string = '> 1. Some text';
  const indices = [0, 14];

  const headingify = blockHandler(string, indices, '# ');

  t.equal(headingify.value, '# 1. Some text');
  t.deepEqual(headingify.range, [2, 14]);
  t.end();
});

test('block-handler > can deal with a blank mark', (t) => {
  const string = '# Some text';
  const indices = [0, 11];

  const headingify = blockHandler(string, indices, '');

  t.equal(headingify.value, 'Some text');
  t.deepEqual(headingify.range, [0, 9]);
  t.end();
});

test('block-handler > works on a blank line', (t) => {
  const string = '';
  const indices = [0, 0];

  const headingify = blockHandler(string, indices, '# ');

  t.equal(headingify.value, '# ');
  t.deepEqual(headingify.range, [2, 2]);
  t.end();
});

test('block-handler > removes other formatting on a blank line', (t) => {
  const string = '>';
  const indices = [0, 1];

  const headingify = blockHandler(string, indices, '# ');

  t.equal(headingify.value, '# ');
  t.deepEqual(headingify.range, [2, 2]);
  t.end();
});
