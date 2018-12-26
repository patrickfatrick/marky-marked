import test from 'tape';
import Separator from '../../src/elements/Separator';

test('Separator > creates a separator', (t) => {
  const separator = new Separator();

  t.true(separator.element instanceof HTMLElement);
  t.true(separator.element.classList.contains('separator'));
  t.equal(separator.element.tagName.toLowerCase(), 'span');
  t.end();
});
