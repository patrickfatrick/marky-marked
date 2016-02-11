'use strict';

/**
 * Handles wrapping format strings around a selection
 * @param   {String} string  the entire string to use
 * @param   {Array}  indices the starting and ending positions to wrap
 * @param   {String} mark    the format string to use
 * @returns {Object} the new string, the updated indices
 */
export function inlineHandler (string, indices, mark) {
	let value;
	let useMark = [mark, mark];
	if (string.indexOf(mark) !== -1) {
		for (let index in indices) {
			if (string.lastIndexOf(mark, indices[index]) === indices[index] - mark.length) {
				string = string.substring(0, indices[index] - mark.length) + string.substring(indices[index], string.length);
				if (index == 0) {
					indices[0] = indices[0] - mark.length;
					indices[1] = indices[1] - mark.length;
				} else {
					indices[1] = indices[1] - mark.length;
				}
				if (index == 1 && useMark[0]) indices[1] = indices[1] + mark.length;
				useMark[index] = '';
			}
			if (string.indexOf(mark, indices[index]) == indices[index]) {
				string = string.substring(0, indices[index]) + string.substring(indices[index] + mark.length, string.length);
				if (index == 0 && (indices[0] != indices[1])) {
					indices[1] = indices[1] - mark.length;
				}
				if (index == 0 && (indices[0] === indices[1])) {
					indices[0] = indices[0] - mark.length;
				}
				if (index == 1 && useMark[0]) indices[1] = indices[1] + mark.length;
				useMark[index] = '';
			}
		}
	}
	value = string.substring(0, indices[0]) + useMark[0] + string.substring(indices[0], indices[1]) + useMark[1] + string.substring(indices[1], string.length);
	return {value: value, range: [indices[0] + useMark[0].length, indices[1] + useMark[1].length]};
}

/**
 * Handles adding/removing a format string to a line
 * @param   {String} string  the entire string to use
 * @param   {Array}  indices the starting and ending positions to wrap
 * @param   {String} mark    the format string to use
 * @returns {Object} the new string, the updated indices
 */
export function blockHandler (string, indices, mark) {
	const start = indices[0];
	const end = indices[1];
	let value;
	let lineStart = string.lineStart(start);
	let lineEnd = string.lineEnd(end);
	if (string.indexOfMatch(/^[#>]/m, lineStart) === lineStart) {
		let currentFormat = string.substring(lineStart, lineStart + string.substring(lineStart).search(/[0-9~*`_-]|\b|\n|$/gm));
		value = string.substring(0, lineStart) + string.substring(lineStart + string.substring(lineStart).search(/[0-9~*`_-]|\b|\n|$/gm), string.length);
		lineEnd = lineEnd - currentFormat.length;
		if (currentFormat.trim() !== mark.trim() && mark.trim().length) {
			value = string.substring(0, lineStart) + mark + string.substring(lineStart + string.substring(lineStart).search(/[0-9~*`_-]|\b|\n|$/gm), string.length);
			lineStart = lineStart + mark.length;
			lineEnd = lineEnd + mark.length;
		}
		return {value: value, range: [lineStart, lineEnd]};
	}
	value = string.substring(0, lineStart) + mark + string.substring(lineStart, string.length);
	return {value: value, range: [start + mark.length, end + mark.length]};
}

/**
 * Handles adding/removing format strings to groups of lines
 * @param   {String} string  the entire string to use
 * @param   {Array}  indices the starting and ending positions to wrap
 * @param   {String} type    ul or ol
 * @returns {Object} the new string, the updated indices
 */
export function listHandler (string, indices, type) {
	const start = string.lineStart(indices[0]);
	const end = string.lineEnd(indices[1]);
	const lines = string.substring(start, end).splitLines();
	let newLines = [];
	let value;
	lines.forEach((line, i) => {
		let mark = (type === 'ul') ? '-' + ' ' : (i + 1) + '.' + ' ';
		let newLine;
		if (line.indexOfMatch(/^[0-9#>-]/m, 0) === 0) {
			let currentFormat = line.substring(0, 0 + line.substring(0).search(/[~*`_[!]|[a-zA-Z]|\r|\n|$/gm));
			newLine = line.substring(line.search(/[~*`_[!]|[a-zA-Z]|\r|\n|$/gm), line.length);
			if (currentFormat.trim() !== mark.trim()) {
				newLine = mark + line.substring(line.search(/[~*`_[!]|[a-zA-Z]|\r|\n|$/gm), line.length);
			}
			return newLines.push(newLine);
		}
		newLine = mark + line.substring(0, line.length);
		return newLines.push(newLine);
	});
	let joined = newLines.join('\r\n');
	value = string.substring(0, start) + newLines.join('\r\n') + string.substring(end, string.length);
	return {value: value, range: [start, start + joined.replace(/\n/gm, '').length]};
}

/**
 * Handles adding/removing indentation to groups of lines
 * @param   {String} string  the entire string to use
 * @param   {Array}  indices the starting and ending positions to wrap
 * @param   {String} type    in or out
 * @returns {Object} the new string, the updated indices
 */
export function indentHandler (string, indices, type) {
	const start = string.lineStart(indices[0]);
	const end = string.lineEnd(indices[1]);
	const lines = string.substring(start, end).splitLines();
	let newLines = [];
	let value;
	lines.forEach((line) => {
		let mark = '    ';
		let newLine;
		if (type === 'out') {
			newLine = (line.indexOf(mark, 0) === 0) ? line.substring(mark.length, line.length) : line.substring(line.search(/[~*`_[!#>-]|[a-zA-Z0-9]|\r|\n|$/gm), line.length);
			return newLines.push(newLine);
		}
		newLine = mark + line.substring(0, line.length);
		return newLines.push(newLine);
	});
	let joined = newLines.join('\r\n');
	value = string.substring(0, start) + newLines.join('\r\n') + string.substring(end, string.length);
	return {value: value, range: [start, start + joined.replace(/\n/gm, '').length]};
}

/**
 * Handles inserting a snippet at the end of a selection
 * @param   {String} string  the entire string to use
 * @param   {Array}  indices the starting and ending positions to wrap
 * @param   {String} mark    the snippet to insert
 * @returns {Object} the new string, the updated indices
 */
export function insertHandler (string, indices, mark) {
	const start = indices[0];
	const end = indices[1];
	let value;
	value = string.substring(0, start) + mark + string.substring(end, string.length);

	return {value: value, range: [start, start + mark.length]};
}
