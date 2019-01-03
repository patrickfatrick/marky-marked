import test from 'tape';
import HeadingDialog from '../../src/elements/HeadingDialog';

test('HeadingDialog > creates a heading dialog', (t) => {
  const headingDialog = new HeadingDialog('heading-dialog', 'Heading Dialog');

  t.true(headingDialog.element instanceof HTMLElement);
  t.equal(headingDialog.element.title, 'Heading Dialog');
  t.ok(headingDialog.element.querySelector('.heading-dialog-heading-list'));
  t.equal(headingDialog.element.querySelectorAll('button').length, 7);
  t.end();
});
