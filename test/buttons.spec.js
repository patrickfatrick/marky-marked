import test from 'tape';
import initializer from '../src/initializer';

const container = document.createElement('marky-mark');
document.body.appendChild(container);
const marky = initializer(container);
const { editor } = marky;

const timelineMock = [
  {
    markdown: '',
    html: '',
    selection: [0, 0],
  },
  {
    markdown: 'Some text',
    html: '<p>Some text</p>',
    selection: [0, 0],
  },
  {
    markdown: 'Some funny text',
    html: '<p>Some funny text</p>',
    selection: [0, 0],
  },
  {
    markdown: 'Some really funny text',
    html: '<p>Some really funny text</p>',
    selection: [0, 0],
  },
  {
    markdown: 'Some really funny awesome text',
    html: '<p>Some really funny awesome text</p>',
    selection: [0, 0],
  },
  {
    markdown: 'Some really funny awesome crazy text',
    html: '<p>Some really funny awesome crazy text</p>',
    selection: [0, 0],
  },
  {
    markdown: 'Some really super funny awesome crazy text',
    html: '<p>Some really super funny awesome crazy text</p>',
    selection: [0, 0],
  },
];

test('buttons > controls the heading dialog', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  container.querySelector('.image').click();
  container.querySelector('.link').click();
  container.querySelector('.heading').click();
  t.true(container.querySelector('.heading-dialog').classList.contains('toggled'));
  t.false(container.querySelector('.link-dialog').classList.contains('toggled'));
  t.false(container.querySelector('.image-dialog').classList.contains('toggled'));
  t.end();
});

test('buttons > calls the bold method', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  container.querySelector('.bold').click();
  t.equal(editor.value, '**Some text**');
  t.end();
});

test('buttons > calls the italic method', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  container.querySelector('.italic').click();
  t.equal(editor.value, '_Some text_');
  t.end();
});

test('buttons > calls the strikethrough method', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  container.querySelector('.strikethrough').click();
  t.equal(editor.value, '~~Some text~~');
  t.end();
});

test('buttons > calls the code method', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  container.querySelector('.code').click();
  t.equal(editor.value, '`Some text`');
  t.end();
});

test('buttons > calls the blockquote method', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  container.querySelector('.blockquote').click();
  t.equal(editor.value, '> Some text');
  t.end();
});

test('buttons > controls the link dialog', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  container.querySelector('.image').click();
  container.querySelector('.link').click();
  t.true(container.querySelector('.link-dialog').classList.contains('toggled'));
  t.false(container.querySelector('.image-dialog').classList.contains('toggled'));
  t.end();
});

test('buttons > automatically assigns the value of the link display text', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  container.querySelector('.link').click();

  t.equal(container.querySelector('.link-display-input').value, 'Some text');
  t.end();
});

test('buttons > controls the image dialog', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  container.querySelector('.link').click();
  container.querySelector('.image').click();
  t.true(container.querySelector('.image-dialog').classList.contains('toggled'));
  t.false(container.querySelector('.link-dialog').classList.contains('toggled'));
  t.end();
});

test('buttons > automatically assigns the value of the image alt text', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  container.querySelector('.image').click();

  t.equal(container.querySelector('.image-alt-input').value, 'Some text');
  t.end();
});

test('buttons > calls the unorderedList method', (t) => {
  editor.value = 'Some text\r\nSome other text';
  editor.setSelectionRange(0, 26);
  container.querySelector('.unordered-list').click();
  t.equal(editor.value, '- Some text\n- Some other text');
  t.end();
});

test('buttons > calls the ordered list method', (t) => {
  editor.value = 'Some text\r\nSome other text';
  editor.setSelectionRange(0, 26);
  container.querySelector('.ordered-list').click();
  t.equal(editor.value, '1. Some text\n2. Some other text');
  t.end();
});

test('buttons > calls the indent method', (t) => {
  editor.value = '- Some text\r\n- Some other text';
  editor.setSelectionRange(0, 30);
  container.querySelector('.indent').click();
  t.equal(editor.value, '    - Some text\n    - Some other text');
  t.end();
});

test('buttons > calls the outdent method', (t) => {
  editor.value = '    - Some text\r\n    - Some other text';
  editor.setSelectionRange(0, 38);
  container.querySelector('.outdent').click();
  t.equal(editor.value, '- Some text\n- Some other text');
  t.end();
});

test('buttons > calls the undo method', (t) => {
  marky.store.timeline = timelineMock;
  marky.store.index = 5;
  editor.value = timelineMock[5].markdown;

  container.querySelector('.undo').click();

  t.equal(editor.value, timelineMock[4].markdown);
  t.end();
});

test('buttons > does not call the undo method if disabled', (t) => {
  marky.store.timeline = timelineMock;
  marky.store.index = 6;
  editor.value = timelineMock[6].markdown;

  container.querySelector('.undo').classList.add('disabled');
  container.querySelector('.undo').click();

  t.equal(editor.value, timelineMock[6].markdown);
  t.end();
});

test('buttons > calls the redo method', (t) => {
  marky.store.timeline = timelineMock;
  marky.store.index = 0;
  editor.value = timelineMock[0].markdown;

  container.querySelector('.redo').click();

  t.equal(editor.value, timelineMock[1].markdown);
  t.end();
});

test('buttons > does not call the redo method if disabled', (t) => {
  marky.store.timeline = timelineMock;
  marky.store.index = 0;
  editor.value = timelineMock[0].markdown;

  container.querySelector('.redo').classList.add('disabled');
  container.querySelector('.redo').click();

  t.equal(editor.value, timelineMock[0].markdown);
  t.end();
});

test('buttons > turns on expanded view', (t) => {
  container.querySelector('.expand').click();

  t.true(container.classList.contains('marky-expanded'));
  t.true(editor.classList.contains('marky-expanded'));
  t.end();
});

test('buttons > turns off expanded', (t) => {
  container.querySelector('.expand').click();

  t.false(container.classList.contains('marky-expanded'));
  t.false(editor.classList.contains('marky-expanded'));
  t.end();
});
