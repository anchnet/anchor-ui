const path = require('path')
const config = require('../config/index')

module.exports = {
  webpackResolve (str) {
    if (typeof str === 'string') {
      return path.resolve(__dirname, '..', str)
    } else {
      return path.resolve(__dirname, '..')
    }
  },

  subDirectory (dir) {
    var subDirectory = process.env.NODE_ENV === 'production'
      ? config.build.subDirectory
      : config.dev.subDirectory
    return path.posix.join(subDirectory, dir)
  }
}