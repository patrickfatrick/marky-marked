import test from 'tape';
import initializer from '../src/modules/initializer';

test('initializer > assigns a Marky instance to the container', (t) => {
  const container = document.createElement('marky-mark');
  document.body.appendChild(container);
  initializer(container);

  t.ok(container.marky);
  document.body.removeChild(container);
  t.end();
});

test('initializer > creates a toolbar, a textarea, and a hidden input', (t) => {
  const container = document.createElement('marky-mark');
  document.body.appendChild(container);
  initializer(container);

  t.ok(container.querySelector('.marky-toolbar'));
  t.ok(container.querySelector('.marky-editor'));
  t.ok(container.querySelector('.heading'));
  t.ok(container.querySelector('.separator'));
  t.ok(container.querySelector('.bold'));
  t.ok(container.querySelector('.italic'));
  t.ok(container.querySelector('.strikethrough'));
  t.ok(container.querySelector('.code'));
  t.ok(container.querySelector('.blockquote'));
  t.ok(container.querySelector('.link'));
  t.ok(container.querySelector('.image'));
  t.ok(container.querySelector('.unordered-list'));
  t.ok(container.querySelector('.ordered-list'));
  t.ok(container.querySelector('.outdent'));
  t.ok(container.querySelector('.indent'));
  t.ok(container.querySelector('.undo'));
  t.ok(container.querySelector('.redo'));
  t.ok(container.querySelector('.expand'));
  document.body.removeChild(container);
  t.end();
});

test('initializer > initializes on an empty element passed in', (t) => {
  const container = document.createElement('mark-wahlberg');
  document.body.appendChild(container);

  t.doesNotThrow(() => initializer(container), TypeError);

  document.body.removeChild(container);
  t.end();
});

test('initializer > initializes on a NodeList item passed in', (t) => {
  const container = document.createElement('mark-wahlberg');
  document.body.appendChild(container);

  t.doesNotThrow(() => initializer(document.querySelectorAll('mark-wahlberg')[0]), TypeError);

  document.body.removeChild(container);
  t.end();
});

test('initializer > initializes on an HTMLCollection item passed in', (t) => {
  const container = document.createElement('mark-wahlberg');
  document.body.appendChild(container);

  t.doesNotThrow(() => initializer(document.getElementsByTagName('mark-wahlberg')[0]), TypeError);

  document.body.removeChild(container);
  t.end();
});

test('initializer > returns a marky instance', (t) => {
  const container = document.createElement('mark-wahlberg');
  document.body.appendChild(container);

  t.ok(initializer(container).state);

  document.body.removeChild(container);
  t.end();
});

test('initializer > assigns the marky instance to the container', (t) => {
  const container = document.createElement('mark-wahlberg');
  document.body.appendChild(container);

  initializer(container);
  t.ok(container.marky);

  document.body.removeChild(container);
  t.end();
});

test('initializer > adds elements to the Marky instance', (t) => {
  const container = document.createElement('marky-mark');
  document.body.appendChild(container);

  const marky = initializer(container);

  t.true(Object.keys(marky.elements.dialogs).length > 0);
  t.true(Object.keys(marky.elements.buttons).length > 0);
  t.ok(marky.elements.editor);

  document.body.removeChild(container);
  t.end();
});

test('initializer > adds listeners to the Marky instance', (t) => {
  const container = document.createElement('marky-mark');
  document.body.appendChild(container);

  const marky = initializer(container);

  t.true(Object.keys(marky.elements.dialogs.heading.options[0].listeners).length > 0);
  t.true(Object.keys(marky.elements.dialogs.image.form.listeners).length > 0);
  t.true(Object.keys(marky.elements.dialogs.link.form.listeners).length > 0);
  t.true(
    Object.keys(marky.elements.buttons).every(buttonName => (
      Object.keys(marky.elements.buttons[buttonName].listeners).length > 0
    )),
  );
  t.true(Object.keys(marky.elements.editor.listeners).length > 0);

  document.body.removeChild(container);
  t.end();
});

test('initializer > throws a TypeError if an array of non-HTMLElements is passed in', (t) => {
  t.throws(() => initializer('marky-mark'), TypeError);
  t.end();
});

test('initializer > does not initialize on non-empty elements', (t) => {
  const container = document.createElement('marky-mark');
  const child = document.createElement('div');
  container.appendChild(child);
  document.body.appendChild(container);

  initializer(container);

  t.equal(container.children.length, 1);
  t.notOk(container.querySelector('.marky-editor'));
  t.end();
});
