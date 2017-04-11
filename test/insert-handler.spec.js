import test from 'tape'
import { insertHandler } from '../src/modules/handlers'

test('insert-handler > inserts and selects the inserted markdown', (t) => {
  let string = 'Some text '
  let indices = [10, 10]

  let boldify = insertHandler(string, indices, '[DISPLAY TEXT](https://url.com)')

  t.equal(boldify.value, 'Some text [DISPLAY TEXT](https://url.com)')
  t.deepEqual(boldify.range, [10, 41])
  t.end()
})

test('insert-handler > inserts and selects the inserted markdown with a current selection', (t) => {
  let string = 'Some text '
  let indices = [0, 10]

  let boldify = insertHandler(string, indices, '[DISPLAY TEXT](https://url.com)')

  t.equal(boldify.value, '[DISPLAY TEXT](https://url.com)')
  t.deepEqual(boldify.range, [0, 31])
  t.end()
})
