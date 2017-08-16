const merge = require('webpack-merge')
const webpack = require('webpack')
const baseWebpackConfig = require('./webpack.base.conf.js')
const config = require('../config/index')
const utils = require('./utils.js')

module.exports = merge(baseWebpackConfig, {
  entry: config.build.entries,

  output: {
    path: utils.webpackResolve('libs/'),
    publicPath: config.build.publicPath,
    filename: '[name].js'
  },

  devtool: config.build.productionSourceMap ? '#source-map' : false,

  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.build.env
    }),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        collapse_vars: true,
        reduce_vars: true
      },
      sourceMap: true
    })
  ]
})