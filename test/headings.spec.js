import test from 'tape';
import initializer from '../src/initializer';

const container = document.createElement('marky-mark');
document.body.appendChild(container);
const marky = initializer(container);
const { editor } = marky;

test('headings > calls the heading-1 method', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  const heading1 = container.querySelector('.heading-1').children[0];
  heading1.click();

  t.equal(editor.value, '# Some text');
  t.end();
});

test('headings > calls the heading-2 method', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  const heading2 = container.querySelector('.heading-2').children[0];
  heading2.click();

  t.equal(editor.value, '## Some text');
  t.end();
});

test('headings > calls the heading-6 method', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  const heading6 = container.querySelector('.heading-6').children[0];
  heading6.click();

  t.equal(editor.value, '###### Some text');
  t.end();
});

test('headings > removes any existing heading', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  const removeHeading = container.querySelector('.remove-heading').children[0];
  removeHeading.click();

  t.equal(editor.value, 'Some text');
  t.end();
});
