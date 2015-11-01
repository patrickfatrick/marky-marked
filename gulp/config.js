var dest = './dist';
var src = '.';
var gutil = require('gulp-util');

module.exports = {
	build: {
		transform: ['babelify', {
			compact: false
		}],
		config: './config.js',
		src: src + '/index.js',
		dest: dest + '/',
		outputName: 'marky.js',
		standalone: 'marky'
	},
	min: {
		transform: ['babelify', {
			compact: true
		}],
		config: './config.js',
		src: src + '/index.js',
		dest: dest + '/',
		outputName: 'marky.min.js',
		standalone: 'marky'
	},
	lint: {
		src: src + '/src/**/*.js'
	},
	sass: {
		src: src + '/styles/marky-mark.scss',
		dest: dest,
		settings: {
			outputStyle: 'compressed'
		}
	}
};
