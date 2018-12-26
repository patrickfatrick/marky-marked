const faucet = require('faucet');
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
      'src/**/*.js': ['sourcemap', 'rollup'],
      'test/**/*.spec.js': ['sourcemap', 'rollup'],
    },
    reporters: ['tap-pretty', 'coverage', 'junit'],
    coverageReporter: {
      reporters: [
        {
          type: 'lcov',
          dir: 'coverage',
        },
        {
          type: 'text',
        },
      ],
    },
    tapReporter: {
      prettify: faucet,
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
