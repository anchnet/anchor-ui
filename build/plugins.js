const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const utils = require('./utils')
const config = require('../config/index')
const sourceMap = require('../examples/resource/sourceMap.json')
const ExamplesMap = require('../examples/sourceMap.json')

const plugins = {
  dev: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),

    // new HtmlWebpackPlugin({
    //   templateOptions: {
    //     title: 'template',
    //     style: '/static/css/plugin.css',
    //     render: '../js/controller/plugin.js',
    //   },
    //   template: utils.webpackResolve('./examples/template.ejs'),
    //   filename: 'plugin.html',
    //   chunks: ['plugin'],
    //   inject: true
    // })
  ],

  build: [
    // 指定运行环境
    new webpack.DefinePlugin({
      'process.env': config.build.env
    }),

    // css 压缩
    // https://github.com/NMFR/optimize-css-assets-webpack-plugin
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g, // 匹配指定文件
      cssProcessor: require('cssnano'), // 指定css压缩器，默认为 cssnano
      cssProcessorOptions: {
        discardComments: {
          removeAll: true // 移除所有注释
        }
      },
      canPrint: true
    }),

    // js 压缩 (默认也压缩了 css)
    // https://github.com/webpack-contrib/uglifyjs-webpack-plugin
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,            // 开启sourceMap
      uglifyOptions: {
        compress: {
          warnings: false,        // 在UglifyJs删除没有用到的代码时不输出警告
          properties: true,       // 用点号重写属性
          dead_code: true,        // 移除没有用到的代码
          drop_debugger: true,    // 移除 debugger 代码
          join_vars: true,
          collapse_vars: true,    // 内嵌定义了但是只用到一次的变量
          reduce_vars: true,      // 提取出出现多次但是没有定义成变量去引用的静态值
          drop_console: true,     // 移除 console
        }
      }
    })
  ],
}

// dev 环境添加 html 文件
// https://github.com/jantimon/html-webpack-plugin
Object.keys(sourceMap).forEach((name) => {
  plugins.dev.push(new HtmlWebpackPlugin({
    template: utils.webpackResolve(sourceMap[name]),
    filename: name + '.html',
    chunks: [name],
    inject: true
  }))
})

module.exports = plugins