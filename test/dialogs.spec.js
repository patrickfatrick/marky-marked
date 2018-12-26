import test from 'tape';
import initializer from '../src/modules/initializer';

const container = document.createElement('marky-mark');
document.body.appendChild(container);
const marky = initializer(container);
const { editor } = marky;

test('dialogs > calls the image method', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  const source = container.querySelector('.image-source-input');
  const alt = container.querySelector('.image-alt-input');
  source.value = 'http://i.imgur.com/VlVsP.gif';
  alt.value = 'Chuck Chardonnay';
  container.querySelector('.insert-image').click();

  t.equal(container.marky.html, '<p><img src="http://i.imgur.com/VlVsP.gif" alt="Chuck Chardonnay"></p>\n');
  t.end();
});

test('dialogs > calls the link method', (t) => {
  editor.value = 'Some text';
  editor.setSelectionRange(0, 9);
  const source = container.querySelector('.link-url-input');
  const alt = container.querySelector('.link-display-input');
  source.value = 'http://google.com';
  alt.value = 'Google';
  container.querySelector('.insert-link').click();

  t.equal(container.marky.html, '<p><a href="http://google.com">Google</a></p>\n');
  t.end();
});
