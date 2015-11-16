import chai from 'chai';
import prototypes from '../src/modules/prototypes';

chai.should();
prototypes();
describe('prototypes', () => {

  it('creates a string prototype for getting indexOf a regex pattern', () => {
    const string = 'abc def hij klm nop';
    string.indexOfMatch(/\s/g, 1).should.equal(3);
  });

  it('creates a string prototype for getting lastIndexOf a regex pattern', () => {
    const string = 'abc def hij klm nop';
    string.lastIndexOfMatch(/\s/g, 5).should.equal(3);
  });

  it('creates a string prototype for getting indices of all regex matches', () => {
    const string = 'abc def hij klm nop';
    string.indicesOfMatches(/\s/g, 1).should.contain.members([3, 7, 11, 15]);
  });

  it('creates a string prototype for all line splits', () => {
    const string = 'abc\r\ndef\rhij\nklm nop';
    string.splitLines().should.contain.members(['abc', 'def', 'hij', 'klm nop']);
  });

  it('creates a string prototype for all line splits with a starting position', () => {
    const string = 'abc\r\ndef\rhij\nklm nop';
    string.splitLines(10).should.contain.members(['ij', 'klm nop']);
  });

  it('creates a string prototype for all line splits with an ending position', () => {
    const string = 'abc\r\ndef\rhij\nklm nop';
    string.splitLinesBackward(10).should.contain.members(['abc', 'def', 'h']);
  });

  it('finds the beginning of a line given a starting position', () => {
    const string = 'abc\r\ndef\rhij\nklm nop';
    string.lineStart(10).should.equal(9);
  });

  it('finds the end of a line given a starting position', () => {
    const string = 'abc\r\ndef\rhij\nklm nop';
    string.lineEnd(10).should.equal(12);
  });

});
