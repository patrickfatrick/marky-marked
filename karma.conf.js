const webpackConfig = require('./webpack.config.test.js')

module.exports = function (karma) {
  karma.set({
    basePath: '',
    files: [
      'test/index.js'
    ],
    frameworks: [ 'mocha', 'chai' ],
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    browsers: [ 'PhantomJS' ], // 'Chrome', 'Safari', 'Firefox', 'Opera'
    preprocessors: {
      'test/index.js': [ 'webpack', 'sourcemap' ]
    },
    reporters: [ 'coverage', 'spec' ],
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
    port: 9876,
    logLevel: karma.LOG_INFO,
    singleRun: true,
    autoWatch: false,
    browserNoActivityTimeout: 30000,
    colors: true,
    loggers: [ { type: 'console' } ]
  })
}
