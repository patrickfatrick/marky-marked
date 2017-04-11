import test from 'tape'
import markymark from '../src/modules/markymark'

test('markymark > assigns a Marky instance to the editor', (t) => {
  const container = document.createElement('marky-mark')
  document.body.appendChild(container)
  markymark()

  t.ok(container.querySelector('.marky-editor')._marky)
  document.body.removeChild(container)
  t.end()
})

test('markymark > creates a toolbar, a textarea, and a hidden input', (t) => {
  const container = document.createElement('marky-mark')
  document.body.appendChild(container)
  markymark()

  t.ok(container.querySelector('.marky-toolbar'))
  t.ok(container.querySelector('.marky-editor'))
  t.ok(container.querySelector('.heading'))
  t.ok(container.querySelector('.separator'))
  t.ok(container.querySelector('.bold'))
  t.ok(container.querySelector('.italic'))
  t.ok(container.querySelector('.strikethrough'))
  t.ok(container.querySelector('.code'))
  t.ok(container.querySelector('.blockquote'))
  t.ok(container.querySelector('.link'))
  t.ok(container.querySelector('.image'))
  t.ok(container.querySelector('.unordered-list'))
  t.ok(container.querySelector('.ordered-list'))
  t.ok(container.querySelector('.outdent'))
  t.ok(container.querySelector('.indent'))
  t.ok(container.querySelector('.undo'))
  t.ok(container.querySelector('.redo'))
  t.ok(container.querySelector('.expand'))
  document.body.removeChild(container)
  t.end()
})

test('markymark > initializes on marky-mark elements by default', (t) => {
  const container = document.createElement('funky-bunch')
  document.body.appendChild(container)

  markymark()

  t.notOk(container.querySelector('.marky-editor'))
  t.notOk(container.querySelector('.marky-toolbar'))
  t.end()
})

test('markymark > initializes on an array of empty elements passed in', (t) => {
  const container = document.createElement('mark-wahlberg')
  document.body.appendChild(container)

  t.doesNotThrow(() => markymark([container]), TypeError)

  document.body.removeChild(container)
  t.end()
})

test('markymark > initializes on a NodeList passed in', (t) => {
  const container = document.createElement('mark-wahlberg')
  document.body.appendChild(container)

  t.doesNotThrow(() => markymark(document.querySelectorAll('mark-wahlberg')), TypeError)

  document.body.removeChild(container)
  t.end()
})

test('markymark > initializes on an HTMLCollection passed in', (t) => {
  const container = document.createElement('mark-wahlberg')
  document.body.appendChild(container)

  t.doesNotThrow(() => markymark(document.getElementsByTagName('mark-wahlberg')), TypeError)

  document.body.removeChild(container)
  t.end()
})

test('markymark > returns an array of marky instances', (t) => {
  const container = document.createElement('mark-wahlberg')
  document.body.appendChild(container)

  t.ok(markymark([container])[0].hasOwnProperty('state'))

  document.body.removeChild(container)
  t.end()
})

test('markymark > assigns the marky instance to the editor', (t) => {
  const container = document.createElement('mark-wahlberg')
  document.body.appendChild(container)

  markymark([container])
  t.ok(container.querySelector('.marky-editor').hasOwnProperty('_marky'))

  document.body.removeChild(container)
  t.end()
})

test('markymark > adds elements to the Marky instance', (t) => {
  const container = document.createElement('marky-mark')
  document.body.appendChild(container)

  const marky = markymark()[0]

  t.true(Object.keys(marky.elements.dialogs).length > 0)
  t.true(Object.keys(marky.elements.buttons).length > 0)
  t.ok(marky.elements.editor)

  document.body.removeChild(container)
  t.end()
})

test('markymark > adds listeners to the Marky instance', (t) => {
  const container = document.createElement('marky-mark')
  document.body.appendChild(container)

  const marky = markymark()[0]

  t.true(Object.keys(marky.elements.dialogs.heading.options[0].listeners).length > 0)
  t.true(Object.keys(marky.elements.dialogs.image.form.listeners).length > 0)
  t.true(Object.keys(marky.elements.dialogs.link.form.listeners).length > 0)
  t.true(Object.keys(marky.elements.buttons).every((buttonName) => {
    return Object.keys(marky.elements.buttons[buttonName].listeners).length > 0
  }))
  t.true(Object.keys(marky.elements.editor.listeners).length > 0)

  document.body.removeChild(container)
  t.end()
})

test('markymark > throws a TypeError if an array or HTMLCollection is not passed in', (t) => {
  const newContainer = document.createElement('mark-wahlberg')
  document.body.appendChild(newContainer)

  t.throws(() => markymark(newContainer), TypeError)

  document.body.removeChild(newContainer)
  t.end()
})

test('markymark > throws a TypeError if an array of non-HTMLElements is passed in', (t) => {
  const containers = ['marky-mark', 'funky-bunch', 'mark-wahlberg']

  t.throws(() => markymark(containers), TypeError)
  t.end()
})

test('markymark > initializes on multiple elements', (t) => {
  const container = document.createElement('marky-mark')
  document.body.appendChild(container)
  const anotherContainer = document.createElement('funky-bunch')
  document.body.appendChild(anotherContainer)
  const yetAnotherContainer = document.createElement('marky-mark')
  document.body.appendChild(yetAnotherContainer)

  markymark()

  t.ok(container.querySelector('.marky-editor'))
  t.notOk(anotherContainer.querySelector('.marky-editor'))
  t.ok(yetAnotherContainer.querySelector('.marky-editor'))
  t.end()
})

test('markymark > does not initialize on empty elements', (t) => {
  const container = document.createElement('marky-mark')
  const child = document.createElement('div')
  container.appendChild(child)
  document.body.appendChild(container)

  markymark()

  t.equal(container.children.length, 1)
  t.notOk(container.querySelector('.marky-editor'))
  t.end()
})
