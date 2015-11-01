export default function () {
	String.prototype.indexOfMatch = function (regex, fromIndex) {
		var str = (fromIndex !== null) ? this.substring(fromIndex) : this;
		var matches = str.match(regex);
		return matches ? str.indexOf(matches[0]) + fromIndex : -1;
	};

	String.prototype.indicesOfMatches = function (regex, fromIndex) {
		var str = (fromIndex !== null) ? this.substring(fromIndex) : this;
		var matches = str.match(regex);
		matches.map(function (match) {
			return str.indexOf(match) + fromIndex;
		});
		return matches ? matches : -1;
	};

	String.prototype.lastIndexOfMatch = function (regex, fromIndex) {
		var str = (fromIndex !== null) ? this.substring(0, fromIndex) : this;
		var matches = str.match(regex);
		return matches ? str.lastIndexOf(matches[matches.length - 1]) : -1;
	};

	String.prototype.splitLinesBackward = function (fromIndex) {
		var str = fromIndex ? this.substring(0, fromIndex) : this;
		return str.split(/\r\n|\r|\n/);
	};

	String.prototype.splitLines = function (fromIndex) {
		var str = fromIndex ? this.substring(fromIndex) : this;
		return str.split(/\r\n|\r|\n/);
	};
}
