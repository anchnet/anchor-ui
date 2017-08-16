const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf.js')
const config = require('../config/index')
const utils = require('./utils.js')
const entry = require('./entry')
const plugins = require('./plugins')

module.exports = merge(baseWebpackConfig, {
  entry: entry.build,

  output: {
    path: utils.webpackResolve('libs/'),
    publicPath: config.build.publicPath,
    filename: '[name].js'
  },

  devtool: config.build.productionSourceMap ? '#source-map' : false,

  plugins: plugins.build
})