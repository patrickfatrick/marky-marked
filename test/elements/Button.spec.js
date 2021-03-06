/* global HTMLElement */

import test from 'tape';
import Button from '../../src/elements/Button';

test('Button > creates a button', (t) => {
  const button = new Button('bold', 'Bold', 'fa', 'fa-bold');

  t.true(button.element instanceof HTMLElement);
  t.equal(button.element.title, 'Bold');
  t.equal(button.element.tagName.toLowerCase(), 'button');
  t.ok(button.element.querySelector('i'));
  t.true(button.element.querySelector('i').classList.contains('fa-bold'));
  t.end();
});
