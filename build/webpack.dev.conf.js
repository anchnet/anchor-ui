const utils = require('./utils.js')
const webpack = require('webpack')
const merge = require('webpack-merge')
const config = require('../config/index')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
  entry: config.dev.entries,

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
    port: config.dev.port,
    hot: true
  },

  devtool: '#cheap-module-eval-source-map',

  node: {
    fs: 'empty'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),

    new HtmlWebpackPlugin({
      template: utils.webpackResolve('examples/resource/index.html'),
      inject: true,
      chunks: ['home'],
      filename: 'index.html'
    }),

    new HtmlWebpackPlugin({
      template: utils.webpackResolve('examples/resource/document.html'),
      inject: true,
      chunks: ['document'],
      filename: 'document.html'
    }),
  ]
})