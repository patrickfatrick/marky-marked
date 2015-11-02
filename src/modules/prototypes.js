export default function () {
	String.prototype.indexOfMatch = function (regex, index) {
		var str = (index !== null) ? this.substring(index) : this;
		var matches = str.match(regex);
		return matches ? str.indexOf(matches[0]) + index : -1;
	};

	String.prototype.indicesOfMatches = function (regex, index) {
		var str = (index !== null) ? this.substring(index) : this;
		var matches = str.match(regex);
		matches.map(function (match) {
			return str.indexOf(match) + index;
		});
		return matches ? matches : -1;
	};

	String.prototype.lastIndexOfMatch = function (regex, index) {
		var str = (index !== null) ? this.substring(0, index) : this;
		var matches = str.match(regex);
		return matches ? str.lastIndexOf(matches[matches.length - 1]) : -1;
	};

	String.prototype.splitLinesBackward = function (index) {
		var str = index ? this.substring(0, index) : this;
		return str.split(/\r\n|\r|\n/);
	};

	String.prototype.splitLines = function (index) {
		var str = index ? this.substring(index) : this;
		return str.split(/\r\n|\r|\n/);
	};

	String.prototype.lineStart = function (index) {
		return this.lastIndexOfMatch(/^.*/gm, index);
	};

	String.prototype.lineEnd = function (index) {
		return this.indexOfMatch(/.*$/gm, index);
	};
}
