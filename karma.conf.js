var istanbul = require('browserify-istanbul');

module.exports = function (karma) {
	karma.set({
		basePath: './',
		files: ['test/test.js'],
		frameworks: ['browserify', 'mocha', 'chai'],
		plugins: [
  		'karma-browserify',
			'karma-mocha',
			'karma-chai',
			'karma-chrome-launcher',
			'karma-phantomjs-launcher'
		],	
		browsers: ['PhantomJS'], // 'Chrome'

		preprocessors: {
			'src/**/*.js': ['browserify'],
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
		port: 9090,
		logLevel: karma.LOG_DISABLE,
		singleRun: false,
		autoWatch: false,
		browserNoActivityTimeout: 30000,
		colors: true
	});
};