const summary = require('tap-summary');
const rollupConfig = require('./rollup.config.test.js');

module.exports = (karma) => {
  karma.set({
    basePath: '',
    files: [
      'vendor/tape.js',
      'vendor/sinon.js',
      'src/**/*.js',
      'test/**/*.spec.js',
    ],
    frameworks: ['tap'],
    rollupPreprocessor: rollupConfig,
    browsers: ['ChromeHeadless'],
    client: { captureConsole: false },
    preprocessors: {
      'src/**/*.js': ['rollup'],
      'test/**/*.spec.js': ['rollup'],
    },
    reporters: ['tap-pretty', 'coverage', 'junit'],
    coverageReporter: {
      reporters: [
        {
          type: 'lcov',
          dir: 'coverage',
        },
      ],
    },
    tapReporter: {
      prettify: summary,
    },
    junitReporter: {
      outputDir: 'tmp/karma-results',
    },
    logLevel: karma.LOG_INFO,
    singleRun: true,
    autoWatch: false,
    browserNoActivityTimeout: 30000,
    colors: true,
    loggers: [{ type: 'console' }],
  });
};
