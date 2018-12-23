const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')

// Have to use CommonJS for tests,
// and build it from scratch rather than using the base config
module.exports = {
  plugins: [
    commonjs({
      namedExports: {
        'node_modules/contra/contra.js': [ 'emitter' ],
        'node_modules/harsh/dist/harsh.js': [ 'hashish' ]
      }
    }),
    resolve(),
    babel({
      exclude: 'node_modules/**/*',
      plugins: [ 'transform-object-rest-spread', 'external-helpers', 'array-includes', 'istanbul' ]
    })
  ],
  sourceMap: 'inline',
  format: 'iife',
  moduleName: 'markymark',
  external: [ 'tape', 'sinon' ],
  globals: {
    tape: 'test',
    sinon: 'sinon'
  }
}
