

/**
 * Finds the first index based on a regex match
 * @param   {RegExp} regex a regex object
 * @param   {Number} index optional starting index
 * @returns {Number} the index of the match
 */
export function indexOfMatch(string, regex, index) {
  const str = (index !== null) ? string.substring(index) : string;
  const matches = str.match(regex);
  return matches ? str.indexOf(matches[0]) + index : -1;
}

/**
 * Finds the first index based on a regex match
 * @param   {RegExp} regex a regex object
 * @param   {Number} index optional starting index
 * @returns {Number} the index of the match
 */
export function indicesOfMatches(string, regex, index) {
  const str = (index !== null) ? string.substring(index) : string;
  const matches = str.match(regex);
  const indices = [];
  matches.forEach((match, i) => {
    const prevIndex = indices ? indices[i - 1] : null;
    indices.push(str.indexOf(match, prevIndex + 1) + index);
  });
  return indices || -1;
}

/**
 * Finds the last index based on a regex match
 * @param   {RegExp} regex a regex object
 * @param   {Number} index optional ending index
 * @returns {Number} the index of the match
 */
export function lastIndexOfMatch(string, regex, index) {
  const str = (index !== null) ? string.substring(0, index) : string;
  const matches = str.match(regex);
  return matches ? str.lastIndexOf(matches[matches.length - 1]) : -1;
}

/**
 * Creates an array of lines separated by line breaks
 * @param   {Number} index optional ending index
 * @returns {String[]}  an array of strings
 */
export function splitLinesBackward(string, index) {
  const str = index ? string.substring(0, index) : string;
  return str.split(/\r\n|\r|\n/);
}

/**
 * Creates an array of lines split by line breaks
 * @param   {Number} index optional starting index
 * @returns {String[]}  an array of strings
 */
export function splitLines(string, index) {
  const str = index ? string.substring(index) : string;
  return str.split(/\r\n|\r|\n/);
}

/**
 * Finds the start of a line
 * @param   {Number} index  optional position
 * @returns {Number} the index of the line start
 */
export function startOfLine(string, index = 0) {
  return lastIndexOfMatch(string, /^.*/gm, index);
}

/**
 * Finds the end of a line
 * @param   {Number} index  optional position
 * @returns {Number} the index of the line end
 */
export function endOfLine(string, index = 0) {
  return indexOfMatch(string, /(\r|\n|$)/gm, index);
}
