import test from 'tape'
import {
  indexOfMatch,
  indicesOfMatches,
  lastIndexOfMatch,
  splitLinesBackward,
  splitLines,
  startOfLine,
  endOfLine
} from '../src/modules/parsers'

test('parsers > creates a string prototype for getting indexOf a regex pattern', (t) => {
  const string = 'abc def hij klm nop'
  t.equal(indexOfMatch(string, /\s/g, 1), 3)
  t.end()
})

test('parsers > creates a string prototype for getting lastIndexOf a regex pattern', (t) => {
  const string = 'abc def hij klm nop'
  t.equal(lastIndexOfMatch(string, /\s/g, 5), 3)
  t.end()
})

test('parsers > creates a string prototype for getting indices of all regex matches', (t) => {
  const string = 'abc def hij klm nop'
  t.deepEqual(indicesOfMatches(string, /\s/g, 1), [3, 7, 11, 15])
  t.end()
})

test('parsers > creates a string prototype for all line splits', (t) => {
  const string = 'abc\r\ndef\rhij\nklm nop'
  t.deepEqual(splitLines(string), ['abc', 'def', 'hij', 'klm nop'])
  t.end()
})

test('parsers > creates a string prototype for all line splits with a starting position', (t) => {
  const string = 'abc\r\ndef\rhij\nklm nop'
  t.deepEqual(splitLines(string, 10), ['ij', 'klm nop'])
  t.end()
})

test('parsers > creates a string prototype for all line splits with an ending position', (t) => {
  const string = 'abc\r\ndef\rhij\nklm nop'
  t.deepEqual(splitLinesBackward(string, 10), ['abc', 'def', 'h'])
  t.end()
})

test('parsers > finds the beginning of a line given a starting position', (t) => {
  const string = 'abc\r\ndef\rhij\nklm nop'
  t.equal(startOfLine(string, 10), 9)
  t.end()
})

test('parsers > finds the end of a line given a starting position', (t) => {
  const string = 'abc\r\ndef\rhij\nklm nop'
  t.equal(endOfLine(string, 10), 12)
  t.end()
})
