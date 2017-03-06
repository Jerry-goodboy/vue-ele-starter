'use strict'

const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const base = require('./webpack.base')
const config = require('./config')

base.entry.vendor = config.vendor
base.output.filename = '[name].[chunkhash:8].js'
base.stats = { children: false }

// Plugins Configuration
base.plugins.push(
  new ProgressBarPlugin(),
  new ExtractTextPlugin('styles.[contenthash:8].css'),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    output: {
      comments: false
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'vendor.[chunkhash:8].js'
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    options: {
      postcss: config.postcss,
      vue: {
        loaders: {
          css: ExtractTextPlugin.extract({
            use: [{ loader: 'css-loader' }, 'postcss-loader'],
            fallback: 'vue-style-loader'
          })
        },
        preserveWhitespace: false,
        postcss: config.postcss
      }
    }
  })
)

base.module.rules.push({
  test: /\.css$/,
  loader: ExtractTextPlugin.extract({
    use: [{ loader: 'css-loader' }, 'postcss-loader'],
    fallback: 'style-loader'
  })
})

module.exports = base
