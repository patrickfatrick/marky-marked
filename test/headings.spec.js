import test from 'tape';
import markymark from '../src/modules/markymark';

const container = document.createElement('marky-mark');
document.body.appendChild(container);
const marky = markymark()[0];
const { editor } = marky;

test('headings > calls the heading-1 method', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  const heading1 = container.querySelector('.heading-1').children[0];
  heading1.click();

  t.equal(editor.marky.html, '<h1 id="some-text">Some text</h1>\n');
  t.end();
});

test('headings > calls the heading-2 method', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  const heading2 = container.querySelector('.heading-2').children[0];
  heading2.click();

  t.equal(editor.marky.html, '<h2 id="some-text">Some text</h2>\n');
  t.end();
});

test('headings > calls the heading-6 method', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  const heading6 = container.querySelector('.heading-6').children[0];
  heading6.click();

  t.equal(editor.marky.html, '<h6 id="some-text">Some text</h6>\n');
  t.end();
});

test('headings > removes any existing heading', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  const removeHeading = container.querySelector('.remove-heading').children[0];
  removeHeading.click();

  t.equal(editor.marky.html, '<p>Some text</p>\n');
  t.end();
});
