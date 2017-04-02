'use strict'

const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const base = require('./webpack.config.base')

module.exports = merge(base, {
  entry: [
    './index.js'
  ],
  output: {
    filename: 'marky-marked.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            'css-loader?importLoaders=1&minimize=true',
            'postcss-loader'
          ]
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('marky-marked.css'),
    new StylelintPlugin({
      files: [ 'styles/*.css' ]
    })
  ]
})
