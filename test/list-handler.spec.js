import test from 'tape'
import { listHandler } from '../src/modules/handlers'

test('list-handler > adds a formatting string to the beginning of a line', (t) => {
  let string = 'Some text'
  let indices = [0, 9]

  let listify = listHandler(string, indices, 'ul')

  t.equal(listify.value, '- Some text')
  t.deepEqual(listify.range, [0, 11])
  t.end()
})

test('list-handler > does not matter where the selection is on that line', (t) => {
  let string = 'Some text'
  let indices = [9, 9]

  let listify = listHandler(string, indices, 'ul')

  t.equal(listify.value, '- Some text')
  t.deepEqual(listify.range, [0, 11])
  t.end()
})

test('list-handler > works with multi-line selections', (t) => {
  let string = 'Some text\r\nSome other text'
  let indices = [0, 26]

  let listify = listHandler(string, indices, 'ul')

  t.equal(listify.value, '- Some text\r\n- Some other text')
  t.deepEqual(listify.range, [0, 29])
  t.end()
})

test('list-handler > ignores other lines around the selection', (t) => {
  let string = 'Some text\r\nSome other text'
  let indices = [11, 26]
  let listify = listHandler(string, indices, 'ul')

  t.equal(listify.value, 'Some text\r\n- Some other text')
  t.deepEqual(listify.range, [11, 28])
  t.end()
})

test('list-handler > removes all other block or list formatting', (t) => {
  let string = '# Some text'
  let indices = [0, 11]

  let listify = listHandler(string, indices, 'ul')

  t.equal(listify.value, '- Some text')
  t.deepEqual(listify.range, [0, 11])
  t.end()
})

test('list-handler > removes all other list formatting even if format string is directly touching text', (t) => {
  let string = '>Some text'
  let indices = [0, 10]

  let listify = listHandler(string, indices, 'ul')

  t.equal(listify.value, '- Some text')
  t.deepEqual(listify.range, [0, 11])
  t.end()
})

test('list-handler > considers inline formats to be text', (t) => {
  let string = '**Some text**'
  let indices = [0, 13]

  let listify = listHandler(string, indices, 'ul')

  t.equal(listify.value, '- **Some text**')
  t.deepEqual(listify.range, [0, 15])
  t.end()
})

test('list-handler > also considers inline formats to be text when removing other list formats', (t) => {
  let string = '> **Some text**'
  let indices = [0, 15]

  let listify = listHandler(string, indices, 'ul')

  t.equal(listify.value, '- **Some text**')
  t.deepEqual(listify.range, [0, 15])
  t.end()
})

test('list-handler > works on a blank line', (t) => {
  let string = ''
  let indices = [0, 0]

  let listify = listHandler(string, indices, 'ul')

  t.equal(listify.value, '- ')
  t.deepEqual(listify.range, [0, 2])
  t.end()
})

test('list-handler > removes other formatting on a blank line', (t) => {
  let string = '>'
  let indices = [0, 1]

  let listify = listHandler(string, indices, 'ul')

  t.equal(listify.value, '- ')
  t.deepEqual(listify.range, [0, 2])
  t.end()
})

test('list-handler > adds formatting to several lines', (t) => {
  let string = 'Some text\r\nSome other text\r\nEven more text'
  let indices = [0, 42]

  let listify = listHandler(string, indices, 'ul')

  t.equal(listify.value, '- Some text\r\n- Some other text\r\n- Even more text')
  t.deepEqual(listify.range, [0, 46])
  t.end()
})

test('list-handler > exchanges one unordered list for an ordered list', (t) => {
  let string = '- Some text\r\n- Some other text\r\n- Even more text'
  let indices = [0, 48]

  let listify = listHandler(string, indices, 'ol')

  t.equal(listify.value, '1. Some text\r\n2. Some other text\r\n3. Even more text')
  t.deepEqual(listify.range, [0, 49])
  t.end()
})

test('list-handler > exchanges one ordered list for an unordered list', (t) => {
  let string = '1. Some text\r\n2. Some other text\r\n3. Even more text'
  let indices = [0, 51]

  let listify = listHandler(string, indices, 'ul')

  t.equal(listify.value, '- Some text\r\n- Some other text\r\n- Even more text')
  t.deepEqual(listify.range, [0, 46])
  t.end()
})
