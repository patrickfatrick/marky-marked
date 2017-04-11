import base from './rollup.config.base'

export default Object.assign(base, {
  format: 'umd',
  moduleName: 'markymark',
  dest: 'dist/marky-marked.umd.js'
})
