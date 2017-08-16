const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const utils = require('./utils')
const config = require('../config/index')
const sourceMap = require('../examples/resource/sourceMap.json')

const plugins = [
  new webpack.DefinePlugin({
    'process.env': config.dev.env
  }),
]

Object.keys(sourceMap).forEach((name) => {
  plugins.push(new HtmlWebpackPlugin({
    template: utils.webpackResolve(sourceMap[name]),
    filename: name + '.html',
    chunks: [name],
    inject: true
  }))
})

module.exports = plugins