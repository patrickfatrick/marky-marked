import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/index.js',
  plugins: [
    commonjs(),
    resolve(),
    babel({
      exclude: 'node_modules/**/*',
    }),
  ],
  output: {
    format: 'es',
    file: 'dist/marky-marked.js',
  },
};
