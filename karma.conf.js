const faucet = require('faucet')
const rollupConfig = require('./rollup.config.test.js')

module.exports = function (karma) {
  karma.set({
    basePath: '',
    files: [
      'util/tape.js',
      'src/**/*.js',
      'test/**/*.spec.js'
    ],
    frameworks: [ 'sinon', 'tap' ],
    rollupPreprocessor: rollupConfig,
    browsers: [ 'Chrome' ],
    client: { captureConsole: false },
    preprocessors: {
      'src/**/*.js': [ 'sourcemap', 'rollup' ],
      'test/**/*.spec.js': [ 'sourcemap', 'rollup' ]
    },
    reporters: [ 'tap-pretty', 'coverage', 'junit' ],
    coverageReporter: {
      reporters: [
        {
          type: 'lcov',
          dir: 'coverage'
        },
        {
          type: 'text'
        }
      ]
    },
    tapReporter: {
      prettify: faucet
    },
    junitReporter: {
      outputDir: 'tmp/karma-results'
    },
    logLevel: karma.LOG_INFO,
    singleRun: true,
    autoWatch: false,
    browserNoActivityTimeout: 30000,
    colors: true,
    loggers: [ { type: 'console' } ]
  })
}
