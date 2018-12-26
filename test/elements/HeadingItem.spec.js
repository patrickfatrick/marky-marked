import test from 'tape';
import HeadingItem from '../../src/elements/HeadingItem';

test('HeadingItem > creates a heading item', (t) => {
  const headingItem = new HeadingItem('Heading 1', '1');

  t.true(headingItem.element instanceof HTMLElement);
  t.equal(headingItem.element.title, 'Heading 1');
  t.equal(headingItem.element.textContent, '1');
  t.equal(headingItem.element.value, 1);
  t.equal(headingItem.element.tagName.toLowerCase(), 'li');
  t.end();
});

test('HeadingItem > creates a heading item with icon', (t) => {
  const headingItem = new HeadingItem('Heading 1', '0', 'fa', 'fa-times');

  t.true(headingItem.element instanceof HTMLElement);
  t.ok(headingItem.element.querySelector('i'));
  t.true(headingItem.element.querySelector('i').classList.contains('fa-times'));
  t.end();
});
