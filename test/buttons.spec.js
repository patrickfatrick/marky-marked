import test from 'tape';
import initializer from '../src/modules/initializer';

const container = document.createElement('marky-mark');
document.body.appendChild(container);
const marky = initializer(container);
const { editor } = marky;

const stateMock = [
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
  t.equal(container.marky.html, '<p><strong>Some text</strong></p>\n');
  t.end();
});

test('buttons > calls the italic method', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  container.querySelector('.italic').click();
  t.equal(container.marky.html, '<p><em>Some text</em></p>\n');
  t.end();
});

test('buttons > calls the strikethrough method', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  container.querySelector('.strikethrough').click();
  t.equal(container.marky.html, '<p><del>Some text</del></p>\n');
  t.end();
});

test('buttons > calls the code method', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  container.querySelector('.code').click();
  t.equal(container.marky.html, '<p><code>Some text</code></p>\n');
  t.end();
});

test('buttons > calls the blockquote method', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  container.querySelector('.blockquote').click();
  t.equal(container.marky.html, '<blockquote>\n<p>Some text</p>\n</blockquote>\n');
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
  container.marky.state = stateMock;
  container.marky.index = 5;

  container.querySelector('.undo').click();

  t.equal(editor.value, 'Some really funny awesome text');
  t.equal(container.marky.html, '<p>Some really funny awesome text</p>');
  t.end();
});

test('buttons > does not call the undo method if disabled', (t) => {
  editor.value = 'Some really super funny awesome crazy text';
  container.marky.html = '<p>Some really super funny awesome crazy text</p>';
  container.marky.state = stateMock;
  container.marky.index = 6;
  container.querySelector('.undo').classList.add('disabled');
  container.querySelector('.undo').click();
  t.equal(editor.value, 'Some really super funny awesome crazy text');
  t.equal(container.marky.html, '<p>Some really super funny awesome crazy text</p>');
  t.end();
});

test('buttons > calls the redo method', (t) => {
  editor.value = '';
  container.marky.html = '';
  container.marky.state = stateMock;
  container.marky.index = 0;
  container.querySelector('.redo').click();
  t.equal(editor.value, 'Some text');
  t.equal(container.marky.html, '<p>Some text</p>');
  t.end();
});

test('buttons > does not call the redo method if disabled', (t) => {
  editor.value = '';
  container.marky.html = '';
  container.marky.state = stateMock;
  container.marky.index = 0;
  container.querySelector('.redo').classList.add('disabled');
  container.querySelector('.redo').click();
  t.equal(editor.value, '');
  t.equal(container.marky.html, '');
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
