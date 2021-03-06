import test from 'tape';
import Dialog from '../../src/elements/Dialog';

test('Dialog > creates a dialog', (t) => {
  const dialog = new Dialog('dialog', 'Dialog');

  t.true(dialog.element instanceof HTMLElement);
  t.equal(dialog.element.title, 'Dialog');
  t.end();
});
