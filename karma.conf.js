var istanbul = require('browserify-istanbul');

module.exports = function (karma) {
	karma.set({
		basePath: '',
		files: ['test/**/*.js'],
		frameworks: ['browserify', 'mocha', 'chai'],
		plugins: [
			'karma-browserify',
			'karma-mocha',
			'karma-chai',
			'karma-coverage',
			'karma-phantomjs-launcher'
		],
		browsers: ['PhantomJS'],

		preprocessors: {
			'test/**/*.js': ['browserify']
		},
		browserify: {
			debug: true,
			bundleDelay: 1000,
			transform: [['babelify', {
				ignore: /node_modules/
						}], istanbul({
				ignore: ['test/**', '**/node_modules/**']
			})],
			extensions: ['.js']
		},

		reporters: ['coverage', 'mocha'],
		coverageReporter: {
			reporters: [{
				type: 'text'
			}, {
				type: 'html',
				dir: 'coverage',
				subdir: 'html'
						}, {
				type: 'lcovonly',
				dir: 'coverage',
				subdir: 'lcov'
						}]
		},
		client: {
			mocha: {
				reporter: 'html', // change Karma's debug.html to the mocha web reporter
				ui: 'tdd'
			}
		},
		port: 9090,
		logLevel: karma.LOG_INFO,
		singleRun: true,
		autoWatch: false,
		browserNoActivityTimeout: 30000,
		colors: true
	});
};
