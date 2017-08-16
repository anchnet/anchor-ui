const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const config = require('../config/index')
const utils = require('./utils.js')
const entry = require('./entry')
const plugins = require('./plugins')

module.exports = merge(baseWebpackConfig, {
  entry: entry.dev,

  output: {
    path: utils.webpackResolve('dist/'),
    publicPath: config.dev.path,
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.art$/,
        loader: 'art-template-loader'
      },
    ]
  },

  devServer: {
    contentBase: utils.webpackResolve('examples'),
    historyApiFallback: true,
    clientLogLevel: 'warning',
    compress: true,
    host: config.dev.host || 'localhost',
    port: config.dev.port,
    hot: true
  },

  devtool: '#cheap-module-eval-source-map',

  node: {
    fs: 'empty'
  },

  plugins: plugins.dev
})
