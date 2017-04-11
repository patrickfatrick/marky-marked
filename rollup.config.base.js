import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'src/index.js',
  dest: 'dist/marky-marked.js',
  plugins: [
    commonjs({
      namedExports: {
        'node_modules/contra/contra.js': [ 'emitter' ]
      }
    }),
    resolve(),
    babel({
      exclude: 'node_modules/**/*'
    })
  ],
  format: 'es'
}
