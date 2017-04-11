import test from 'tape'
import { inlineHandler } from '../src/modules/handlers'

test('indent-handler > adds a formatting string around a selection', (t) => {
  let string = 'Some text'
  let indices = [0, 9]

  let boldify = inlineHandler(string, indices, '**')

  t.equal(boldify.value, '**Some text**')
  t.deepEqual(boldify.range, [2, 11])
  t.end()
})

test('indent-handler > removes a formatting string around a selection if it already has it', (t) => {
  let string = '**Some text**'
  let indices = [2, 11]

  let boldify = inlineHandler(string, indices, '**')

  t.equal(boldify.value, 'Some text')
  t.deepEqual(boldify.range, [0, 9])
  t.end()
})

test('indent-handler > removes a formatting string inside a selection if it already has it', (t) => {
  let string = '~~Some text~~'
  let indices = [0, 13]

  let strikitize = inlineHandler(string, indices, '~~')

  t.equal(strikitize.value, 'Some text')
  t.deepEqual(strikitize.range, [0, 9])
  t.end()
})

test('indent-handler > ignores other formatting strings', (t) => {
  let string = '~~Some text~~'
  let indices = [2, 11]

  let boldify = inlineHandler(string, indices, '**')

  t.equal(boldify.value, '~~**Some text**~~')
  t.deepEqual(boldify.range, [4, 13])
  t.end()
})

test('indent-handler > ignores other formatting strings with removal', (t) => {
  let string = '~~**Some text**~~'
  let indices = [4, 13]

  let boldify = inlineHandler(string, indices, '**')

  t.equal(boldify.value, '~~Some text~~')
  t.deepEqual(boldify.range, [2, 11])
  t.end()
})

test('indent-handler > can be used in the middle of ranges already marked', (t) => {
  let string = '**Some text**'
  let indices = [6, 13]

  let boldify = inlineHandler(string, indices, '**')

  t.equal(boldify.value, '**Some** text')
  t.deepEqual(boldify.range, [8, 13])
  t.end()
})

test('indent-handler > sets selection range intuitively', (t) => {
  let string = '**Some text**'
  let indices = [6, 11]

  let boldify = inlineHandler(string, indices, '**')

  t.equal(boldify.value, '**Some** text')
  t.deepEqual(boldify.range, [8, 13])
  t.end()
})

test('indent-handler > removes marks around blank strings', (t) => {
  let string = 'So****me text'
  let indices = [4, 4]

  let boldify = inlineHandler(string, indices, '**')

  t.equal(boldify.value, 'Some text')
  t.deepEqual(boldify.range, [2, 2])
  t.end()
})
