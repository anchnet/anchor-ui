const utils = require('./utils.js')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  resolve: {
    extensions: ['.js', '.scss', '.json'],
    modules: ['node_modules'],
    alias: {
      'scss': utils.webpackResolve('examples/src/scss'),
      'examples': utils.webpackResolve('examples')
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: ['node_modules'],
        query: {
          compact: false  // 禁止 babel 大文件编译警告
        }
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'sass-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: process.env.NODE_ENV ? [require('autoprefixer')()] : []
              }
            }
          ]
        })
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|svg|eot|ttf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 204800,
          name: utils.subDirectory('img/[name].[hash:7].[ext]')
        }
      }
    ]
  },

  plugins: [
    // https://github.com/webpack-contrib/extract-text-webpack-plugin
    new ExtractTextPlugin('[name].css')
  ]
}