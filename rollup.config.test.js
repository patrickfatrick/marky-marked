const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');

// Have to use CommonJS for tests,
// and build it from scratch rather than using the base config
module.exports = {
  input: 'src/index.js',
  plugins: [
    commonjs({
      namedExports: {
        'node_modules/harsh/dist/harsh.js': ['hashish'],
      },
    }),
    resolve(),
    babel({
      exclude: 'node_modules/**/*',
      plugins: ['transform-object-rest-spread', 'external-helpers', 'array-includes', 'istanbul'],
    }),
  ],
  output: {
    format: 'iife',
    globals: {
      tape: 'test',
      sinon: 'sinon',
    },
    name: 'markymark',
    sourceMap: 'inline',
  },
  external: ['tape', 'sinon'],
};
