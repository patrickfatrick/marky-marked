import base from './rollup.config.base';

export default Object.assign(base, {
  output: {
    file: 'dist/marky-marked.umd.js',
    format: 'umd',
    name: 'markymark',
  },
});
