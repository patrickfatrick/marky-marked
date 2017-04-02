'use strict'

const path = require('path')
const webpack = require('webpack')

module.exports = {
  output: {
    path: path.join(__dirname, '/dist/'),
    publicPath: '/dist/',
    filename: 'marky-marked.js',
    library: 'marky',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules\//,
        use: [ 'standard-loader' ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules\//,
        use: [ 'babel-loader' ]
      },
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV'
    ])
  ]
}