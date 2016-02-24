/* global describe it */

import chai from 'chai'
import {indexOfMatch, indicesOfMatches, lastIndexOfMatch, splitLinesBackward, splitLines, startOfLine, endOfLine} from '../src/modules/parsers'

chai.should()
describe('parsers', () => {
  it('creates a string prototype for getting indexOf a regex pattern', () => {
    const string = 'abc def hij klm nop'
    indexOfMatch(string, /\s/g, 1).should.equal(3)
  })

  it('creates a string prototype for getting lastIndexOf a regex pattern', () => {
    const string = 'abc def hij klm nop'
    lastIndexOfMatch(string, /\s/g, 5).should.equal(3)
  })

  it('creates a string prototype for getting indices of all regex matches', () => {
    const string = 'abc def hij klm nop'
    indicesOfMatches(string, /\s/g, 1).should.contain.members([3, 7, 11, 15])
  })

  it('creates a string prototype for all line splits', () => {
    const string = 'abc\r\ndef\rhij\nklm nop'
    splitLines(string).should.contain.members(['abc', 'def', 'hij', 'klm nop'])
  })

  it('creates a string prototype for all line splits with a starting position', () => {
    const string = 'abc\r\ndef\rhij\nklm nop'
    splitLines(string, 10).should.contain.members(['ij', 'klm nop'])
  })

  it('creates a string prototype for all line splits with an ending position', () => {
    const string = 'abc\r\ndef\rhij\nklm nop'
    splitLinesBackward(string, 10).should.contain.members(['abc', 'def', 'h'])
  })

  it('finds the beginning of a line given a starting position', () => {
    const string = 'abc\r\ndef\rhij\nklm nop'
    startOfLine(string, 10).should.equal(9)
  })

  it('finds the end of a line given a starting position', () => {
    const string = 'abc\r\ndef\rhij\nklm nop'
    endOfLine(string, 10).should.equal(12)
  })
})
