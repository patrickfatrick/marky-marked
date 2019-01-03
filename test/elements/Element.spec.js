import test from 'tape';
import Element from '../../src/elements/Element';

test('Element > creates an element', (t) => {
  const element = new Element('div', { title: 'element' });

  t.true(element.element instanceof HTMLElement);
  t.equal(element.element.title, 'element');
  t.end();
});
