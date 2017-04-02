const testHelper = require('./test-helper')

// require test files
const testsContext = require.context('.', true, /-test\.js$/)
testsContext.keys().forEach(testsContext)

// require source files
const srcContext = require.context('../src/', true, /\.js$/)
srcContext.keys().forEach(srcContext)

testHelper()
