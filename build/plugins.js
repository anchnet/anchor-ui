const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const utils = require('./utils')
const config = require('../config/index')
const sourceMap = require('../examples/resource/sourceMap.json')

const plugins = {
  dev: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
  ],
  build: [
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
  ],
}

// dev 环境添加 html 文件
Object.keys(sourceMap).forEach((name) => {
  plugins.dev.push(new HtmlWebpackPlugin({
    template: utils.webpackResolve(sourceMap[name]),
    filename: name + '.html',
    chunks: [name],
    inject: true
  }))
})

module.exports = plugins