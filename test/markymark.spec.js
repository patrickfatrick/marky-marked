import test from 'tape';
import markymark from '../src';

test('markymark > throws a TypeError if an invalid argument is passed in', (t) => {
  const containers = {};

  t.throws(() => markymark(containers), TypeError);
  t.end();
});

test('markymark > initializes on multiple elements', (t) => {
  const container = document.createElement('marky-mark');
  document.body.appendChild(container);
  const anotherContainer = document.createElement('funky-bunch');
  document.body.appendChild(anotherContainer);
  const yetAnotherContainer = document.createElement('marky-mark');
  document.body.appendChild(yetAnotherContainer);

  markymark();

  t.ok(container.querySelector('.marky-editor'));
  t.notOk(anotherContainer.querySelector('.marky-editor'));
  t.ok(yetAnotherContainer.querySelector('.marky-editor'));
  t.end();
});

test('markymark > initializes on marky-mark elements by default', (t) => {
  const container = document.createElement('funky-bunch');
  document.body.appendChild(container);

  markymark();

  t.notOk(container.querySelector('.marky-editor'));
  t.notOk(container.querySelector('.marky-toolbar'));
  t.end();
});

test('markymark > initializes on an array of empty elements passed in', (t) => {
  const container = document.createElement('mark-wahlberg');
  document.body.appendChild(container);

  t.doesNotThrow(() => markymark([container]), TypeError);

  document.body.removeChild(container);
  t.end();
});

test('markymark > initializes on a NodeList passed in', (t) => {
  const container = document.createElement('mark-wahlberg');
  document.body.appendChild(container);

  t.doesNotThrow(() => markymark(document.querySelectorAll('mark-wahlberg')), TypeError);

  document.body.removeChild(container);
  t.end();
});

test('markymark > initializes on an HTMLCollection passed in', (t) => {
  const container = document.createElement('mark-wahlberg');
  document.body.appendChild(container);

  t.doesNotThrow(() => markymark(document.getElementsByTagName('mark-wahlberg')), TypeError);

  document.body.removeChild(container);
  t.end();
});

test('markymark > returns an array of marky instances', (t) => {
  const container = document.createElement('mark-wahlberg');
  document.body.appendChild(container);

  t.ok(markymark([container])[0].state);

  document.body.removeChild(container);
  t.end();
});
