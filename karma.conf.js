var istanbul = require('browserify-istanbul');
var isparta = require('isparta');

module.exports = function (karma) {
	karma.set({
		basePath: '',
		files: ['node_modules/babel-core/browser-polyfill.js', 'test/test_helper.js', 'src/**.js', 'test/**/*-test.js'],
		frameworks: ['browserify', 'mocha', 'chai'],
		plugins: [
			'karma-browserify',
			'karma-mocha',
			'karma-chai',
			'karma-coverage',
			'karma-mocha-reporter',
			'karma-phantomjs-launcher',
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			'karma-safari-launcher'
		],
		browsers: ['PhantomJS'], // Chrome, Safari, Firefox
		preprocessors: {
			'src/**.js': ['browserify'],
			'test/**/*.js': ['browserify']
		},
		browserify: {
			debug: true,
			bundleDelay: 1000,
			transform: [
				['babelify', {
					ignore: /node_modules/
				}],
				istanbul({
					instrumenter: isparta,
					ignore: ['test/**', '**/node_modules/**']
				})
			],
			extensions: ['.js']
		},
		reporters: ['coverage', 'mocha'],
		coverageReporter: {
			reporters: [
				{
					type: 'lcovonly',
					dir: 'coverage'
				},
				{
					type: 'text'
				}
			]
		},
		port: 9876,
		logLevel: karma.LOG_INFO,
		singleRun: true,
		autoWatch: false,
		browserNoActivityTimeout: 30000,
		colors: true,
		loggers: [{type: 'console'}]
	});
};
