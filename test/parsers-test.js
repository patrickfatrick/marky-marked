/* global describe it */

import { assert } from 'chai'
import { indexOfMatch, indicesOfMatches, lastIndexOfMatch, splitLinesBackward, splitLines, startOfLine, endOfLine } from '../src/modules/parsers'

describe('parsers', () => {
  it('creates a string prototype for getting indexOf a regex pattern', () => {
    const string = 'abc def hij klm nop'
    assert.strictEqual(indexOfMatch(string, /\s/g, 1), 3)
  })

  it('creates a string prototype for getting lastIndexOf a regex pattern', () => {
    const string = 'abc def hij klm nop'
    assert.strictEqual(lastIndexOfMatch(string, /\s/g, 5), 3)
  })

  it('creates a string prototype for getting indices of all regex matches', () => {
    const string = 'abc def hij klm nop'
    assert.includeMembers(indicesOfMatches(string, /\s/g, 1), [3, 7, 11, 15])
  })

  it('creates a string prototype for all line splits', () => {
    const string = 'abc\r\ndef\rhij\nklm nop'
    assert.includeMembers(splitLines(string), ['abc', 'def', 'hij', 'klm nop'])
  })

  it('creates a string prototype for all line splits with a starting position', () => {
    const string = 'abc\r\ndef\rhij\nklm nop'
    assert.includeMembers(splitLines(string, 10), ['ij', 'klm nop'])
  })

  it('creates a string prototype for all line splits with an ending position', () => {
    const string = 'abc\r\ndef\rhij\nklm nop'
    assert.includeMembers(splitLinesBackward(string, 10), ['abc', 'def', 'h'])
  })

  it('finds the beginning of a line given a starting position', () => {
    const string = 'abc\r\ndef\rhij\nklm nop'
    assert.strictEqual(startOfLine(string, 10), 9)
  })

  it('finds the end of a line given a starting position', () => {
    const string = 'abc\r\ndef\rhij\nklm nop'
    assert.strictEqual(endOfLine(string, 10), 12)
  })
})
