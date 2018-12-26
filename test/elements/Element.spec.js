/* global HTMLElement */

import test from 'tape';
import Element from '../../src/modules/elements/Element';

test('Element > creates an element', (t) => {
  const element = new Element('div', 'element', 'element');

  t.true(element.element instanceof HTMLElement);
  t.equal(element.element.title, 'element');
  t.end();
});
