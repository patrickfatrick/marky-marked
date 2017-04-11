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
    frameworks: [ 'tap', 'sinon' ],
    rollupPreprocessor: rollupConfig,
    browsers: [ 'Firefox' ], // 'PhantomJS', 'Chrome', 'Safari', 'Firefox', 'Opera',
    preprocessors: {
      'src/**/*.js': [ 'sourcemap', 'rollup' ],
      'test/**/*.spec.js': [ 'sourcemap', 'rollup' ]
    },
    reporters: [ 'tap-pretty', 'coverage' ],
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
    logLevel: karma.LOG_INFO,
    singleRun: true,
    autoWatch: false
  })
}
