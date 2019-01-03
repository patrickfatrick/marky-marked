import {
  indexOfMatch, splitLines, startOfLine, endOfLine,
} from './parsers';

/**
 * Handles wrapping format strings around a selection
 * @param   {String} string         the entire string
 * @param   {Number[]}  selectionRange the starting and ending positions of the selection
 * @param   {String} symbol         the format string to use
 * @returns {Object} the new string, the updated selectionRange
 */
export function inlineHandler(string, selectionRange, symbol) {
  let newString = string;
  const newSelectionRange = [...selectionRange];
  // insertSymbols determines whether to add the symbol to either end of the selected text
  // Stat with assuming we will insert them (we will remove as necessary)
  const insertSymbols = [symbol, symbol];
  const symbolLength = symbol.length;
  const relevantPart = string
    .substring(selectionRange[0] - symbolLength, selectionRange[1] + symbolLength)
    .trim();

  // First check that the symbol is in the string at all
  if (relevantPart.includes(symbol)) {
    // If it is, for each index in the selection range...
    newSelectionRange.forEach((selectionIndex, j) => {
      const isStartingIndex = j === 0;
      const isEndingIndex = j === 1;
      // If the symbol immediately precedes the selection index...
      if (newString.lastIndexOf(symbol, selectionIndex) === selectionIndex - symbolLength) {
        // First trim it
        newString = newString.substring(0, selectionIndex - symbolLength)
          + newString.substring(selectionIndex);

        // Then adjust the selection range,
        // If this is the starting index in the range, we will have to adjust both
        // starting and ending indices
        if (isStartingIndex) {
          newSelectionRange[0] -= symbolLength;
          newSelectionRange[1] -= symbolLength;
        }

        if (isEndingIndex && !insertSymbols[0]) {
          newSelectionRange[1] -= symbol.length;
        }

        // Finally, disallow the symbol at this end of the selection
        insertSymbols[j] = '';
      }

      // If the symbol immediately follows the selection index...
      if (newString.indexOf(symbol, selectionIndex) === selectionIndex) {
        // Trim it
        newString = newString.substring(0, selectionIndex)
          + newString.substring(selectionIndex + symbolLength);

        // Then adjust the selection range,
        // If this is the starting index in the range...
        if (isStartingIndex) {
          // If the starting and ending indices are NOT the same (selection length > 0)
          // Adjust the ending selection down
          if (newSelectionRange[0] !== newSelectionRange[1]) {
            newSelectionRange[1] -= symbolLength;
          }
          // If the starting and ending indices are the same (selection length = 0)
          // Adjust the starting selection down
          if (newSelectionRange[0] === newSelectionRange[1]) {
            newSelectionRange[0] -= symbolLength;
          }
        }

        // If this is the ending index and the range
        // AND we're inserting the symbol at the starting index,
        // Adjust the ending selection up
        if (isEndingIndex && insertSymbols[0]) {
          newSelectionRange[1] += symbolLength;
        }

        // Finally, disallow the symbol at this end of the selection
        insertSymbols[j] = '';
      }
    });
  }

  // Put it all together
  const value = newString.substring(0, newSelectionRange[0])
    + insertSymbols[0]
    + newString.substring(newSelectionRange[0], newSelectionRange[1])
    + insertSymbols[1]
    + newString.substring(newSelectionRange[1]);

  return {
    value,
    range: [
      newSelectionRange[0] + insertSymbols[0].length,
      newSelectionRange[1] + insertSymbols[1].length,
    ],
  };
}

/**
 * Handles adding/removing a format string to a line
 * @param   {String} string         the entire string
 * @param   {Number[]}  selectionRange the starting and ending positions of the selection
 * @param   {String} symbol         the format string to use
 * @returns {Object} the new string, the updated indices
 */
export function blockHandler(string, selectionRange, symbol) {
  const start = selectionRange[0];
  const end = selectionRange[1];
  const boundaryRegex = /[0-9~*`_-]|\b|\n|$/gm;
  let value;
  let lineStart = startOfLine(string, start);
  let lineEnd = endOfLine(string, end);

  // If there is a block handler symbol at the start of the line...
  if (indexOfMatch(string, /^[#>]/m, lineStart) === lineStart) {
    // Find the first boundary from the start of the formatting symbol
    // May include white space
    const existingSymbolBoundary = string.substring(lineStart).search(boundaryRegex);
    const existingSymbol = string.substring(
      lineStart,
      existingSymbolBoundary,
    );

    // Create new string without the existingSymbol
    value = string.substring(0, lineStart)
      + string.substring(
        existingSymbolBoundary,
        string.length,
      );

    // And also subtract the length of the symbol from the lineEnd index
    lineEnd -= existingSymbol.length;

    // If it's some other block handler...
    if (symbol.trim().length && existingSymbol.trim() !== symbol.trim()) {
      // Create a new string with the symbol inserted
      value = string.substring(0, lineStart)
        + symbol
        + string.substring(
          existingSymbolBoundary,
          string.length,
        );
      // And adjust lineStart and lineEnd indices
      lineStart += symbol.length;
      lineEnd += symbol.length;
    }

    return { value, range: [lineStart, lineEnd] };
  }

  // If not, pretty simple
  value = string.substring(0, lineStart) + symbol + string.substring(lineStart, string.length);
  return { value, range: [start + symbol.length, end + symbol.length] };
}

/**
 * Handles adding/removing format strings to groups of lines
 * @param   {String} string  the entire string to use
 * @param   {Number[]}  selectionRange the starting and ending positions of the selection
 * @param   {String} type    ul or ol
 * @returns {Object} the new string, the updated selectionRange
 */
export function listHandler(string, selectionRange, type) {
  const start = startOfLine(string, selectionRange[0]);
  const end = endOfLine(string, selectionRange[1]);
  const lines = splitLines(string.substring(start, end));
  const boundaryRegex = /[~*`_[!]|[a-zA-Z]|\r|\n|$/gm;
  const newLines = [];

  lines.forEach((line, i) => {
    const symbol = (type === 'ul') ? '- ' : `${i + 1}. `;
    let newLine;

    // If the line begins with an existing list symbol
    if (indexOfMatch(line, /^[0-9#>-]/m, 0) === 0) {
      const existingSymbol = line.substring(
        0,
        0 + line.substring(0).search(boundaryRegex),
      );

      // Remove the symbol
      newLine = line.substring(line.search(boundaryRegex), line.length);
      if (existingSymbol.trim() !== symbol.trim()) {
        newLine = symbol + line.substring(line.search(boundaryRegex), line.length);
      }
      return newLines.push(newLine);
    }
    newLine = symbol + line.substring(0, line.length);
    return newLines.push(newLine);
  });

  // Put it all together
  const joined = newLines.join('\r\n');
  const value = string.substring(0, start) + newLines.join('\r\n') + string.substring(end, string.length);
  return { value, range: [start, start + joined.replace(/\n/gm, '').length] };
}

/**
 * Handles adding/removing indentation to groups of lines
 * @param   {String} string         the entire string to use
 * @param   {Number[]}  selectionRange the starting and ending positions to wrap
 * @param   {String} type           in or out
 * @returns {Object} the new string, the updated selectionRange
 */
export function indentHandler(string, selectionRange, type) {
  const start = startOfLine(string, selectionRange[0]);
  const end = endOfLine(string, selectionRange[1]);
  const lines = splitLines(string.substring(start, end));
  const newLines = [];

  lines.forEach((line) => {
    const fourSpaces = '    ';
    let newLine;
    if (type === 'out') {
      newLine = (line.indexOf(fourSpaces, 0) === 0)
        ? line.substring(fourSpaces.length, line.length)
        : line.substring(line.search(/[~*`_[!#>-]|[a-zA-Z0-9]|\r|\n|$/gm), line.length);
      return newLines.push(newLine);
    }
    newLine = fourSpaces + line.substring(0, line.length);
    return newLines.push(newLine);
  });

  const joined = newLines.join('\r\n');
  const value = string.substring(0, start) + newLines.join('\r\n') + string.substring(end, string.length);
  return { value, range: [start, start + joined.replace(/\n/gm, '').length] };
}

/**
 * Handles inserting a snippet at the end of a selection
 * @param   {String} string         the entire string to use
 * @param   {Number[]}  selectionRange the starting and ending positions of the selection
 * @param   {String} snippet        the snippet to insert
 * @returns {Object} the new string, the updated selectionRange
 */
export function insertHandler(string, selectionRange, snippet) {
  const start = selectionRange[0];
  const end = selectionRange[1];
  const value = string.substring(0, start) + snippet + string.substring(end, string.length);

  return { value, range: [start, start + snippet.length] };
}
