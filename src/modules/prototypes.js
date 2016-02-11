'use strict';

export default function () {
	/**
	 * Finds the first index based on a regex match
	 * @param   {RegExp} regex a regex object
	 * @param   {Number} index optional starting index
	 * @returns {Number} the index of the match
	 */
	String.prototype.indexOfMatch = function (regex, index) {
		var str = (index !== null) ? this.substring(index) : this;
		var matches = str.match(regex);
		return matches ? str.indexOf(matches[0]) + index : -1;
	};

	/**
	 * Finds the first index based on a regex match
	 * @param   {RegExp} regex a regex object
	 * @param   {Number} index optional starting index
	 * @returns {Number} the index of the match
	 */
	String.prototype.indicesOfMatches = function (regex, index) {
		var str = (index !== null) ? this.substring(index) : this;
		var matches = str.match(regex);
		var indices = [];
		matches.forEach(function (match, i) {
			let prevIndex = indices ? indices[i - 1] : null;
			indices.push(str.indexOf(match, prevIndex + 1) + index);
		});
		return indices ? indices : -1;
	};

	/**
	 * Finds the last index based on a regex match
	 * @param   {RegExp} regex a regex object
	 * @param   {Number} index optional ending index
	 * @returns {Number} the index of the match
	 */
	String.prototype.lastIndexOfMatch = function (regex, index) {
		var str = (index !== null) ? this.substring(0, index) : this;
		var matches = str.match(regex);
		return matches ? str.lastIndexOf(matches[matches.length - 1]) : -1;
	};

	/**
	 * Creates an array of lines separated by line breaks
	 * @param   {Number} index optional ending index
	 * @returns {Array}  an array of strings
	 */
	String.prototype.splitLinesBackward = function (index) {
		var str = index ? this.substring(0, index) : this;
		return str.split(/\r\n|\r|\n/);
	};

	/**
	 * Creates an array of lines split by line breaks
	 * @param   {Number} index optional starting index
	 * @returns {Array}  an array of strings
	 */
	String.prototype.splitLines = function (index) {
		var str = index ? this.substring(index) : this;
		return str.split(/\r\n|\r|\n/);
	};

	/**
	 * Finds the start of a line
	 * @param   {Number} index 	optional position
	 * @returns {Number} the index of the line start
	 */
	String.prototype.lineStart = function (index = 0) {
		return this.lastIndexOfMatch(/^.*/gm, index);
	};

	/**
	 * Finds the end of a line
	 * @param   {Number} index 	optional position
	 * @returns {Number} the index of the line end
	 */
	String.prototype.lineEnd = function (index = 0) {
		return this.indexOfMatch(/(\r|\n|$)/gm, index);
	};
}
