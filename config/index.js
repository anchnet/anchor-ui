const config = {
  dev: {
    env: require('./dev.env'),
    port: 8099,
    cssSourceMap: false,
    publicPath: '/',
    subDirectory: 'static'
  },
  build: {
    env: require('./prod.env'),
    productionSourceMap: false,
    publicPath: '/',
    subDirectory: 'static'
  }
}

module.exports = config
