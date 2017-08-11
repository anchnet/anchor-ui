const cssPath = require('../resource.json')
const jsresource = './assets/js/index.js'

const config = {
  dev: {
    env: require('./dev.env'),
    entries: {
      main: './examples/main.js',           // 主入口文件
      'static/js/anchor-ui': jsresource   // 引入 anchor-ui.js
    },
    port: 8099,
    cssSourceMap: false,
    publicPath: '/',
    subDirectory: 'static'
  },
  build: {
    env: require('./prod.env'),
    entries: {
      'js/anchor-ui.min': jsresource // anchor-ui.min.js
    },
    productionSourceMap: false,
    publicPath: '/libs',
    subDirectory: '/libs/static'
  }
}

// dev 环境引入编译后的 css
Object.keys(cssPath).forEach((name) => {
  config.dev.entries['static/css/' + name] = cssPath[name]
})

// build 输出 anchor-ui-.min.css
Object.keys(cssPath).forEach((name) => {
  config.build.entries['css/' + name + '.min'] = cssPath[name]
})

module.exports = config
