import test from 'tape'
import markymark from '../src/modules/markymark'

const container = document.createElement('marky-mark')
document.body.appendChild(container)
const marky = markymark()[0]
const editor = marky.editor

test('dialogs > calls the image method', (t) => {
  editor.value = 'Some text'
  editor.setSelectionRange(0, 9)
  var source = container.querySelector('.image-source-input')
  var alt = container.querySelector('.image-alt-input')
  source.value = 'http://i.imgur.com/VlVsP.gif'
  alt.value = 'Chuck Chardonnay'
  container.querySelector('.insert-image').click()

  t.equal(editor._marky.html, '<p><img src="http://i.imgur.com/VlVsP.gif" alt="Chuck Chardonnay"></p>\n')
  t.end()
})

test('dialogs > calls the link method', (t) => {
  editor.value = 'Some text'
  editor.setSelectionRange(0, 9)
  var source = container.querySelector('.link-url-input')
  var alt = container.querySelector('.link-display-input')
  source.value = 'http://google.com'
  alt.value = 'Google'
  container.querySelector('.insert-link').click()

  t.equal(editor._marky.html, '<p><a href="http://google.com">Google</a></p>\n')
  t.end()
})
