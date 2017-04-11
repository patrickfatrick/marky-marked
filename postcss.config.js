module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-cssnext')({
      browsers: [ 'last 2 versions', '> 5%' ]
    }),
    require('cssnano')({
      autoprefixer: false
    })
  ]
}
