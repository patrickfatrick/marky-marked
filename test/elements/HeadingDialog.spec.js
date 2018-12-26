/* global HTMLElement */

import test from 'tape';
import HeadingDialog from '../../src/modules/elements/HeadingDialog';

test('HeadingDialog > creates an image dialog', (t) => {
  const headingDialog = new HeadingDialog('Heading Dialog', 'heading-dialog');

  t.true(headingDialog.element instanceof HTMLElement);
  t.equal(headingDialog.element.title, 'Heading Dialog');
  t.ok(headingDialog.element.querySelector('#heading-dialog-heading-list'));
  t.equal(headingDialog.element.querySelectorAll('button').length, 7);
  t.end();
});
