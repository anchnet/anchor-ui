const jsResource = require('../js_resource.json')
const cssResource = require('../css_resource.json')

const anchorUIRoute = './assets/js/index.js'

const config = {
  dev: {
    env: require('./dev.env'),
    entries: {
      'static/js/anchor-ui': anchorUIRoute   // 引入 anchor-ui.js
    },
    port: 8099,
    cssSourceMap: false,
    publicPath: '/',
    subDirectory: 'static'
  },
  build: {
    env: require('./prod.env'),
    entries: {
      'js/anchor-ui.min': anchorUIRoute // anchor-ui.min.js
    },
    productionSourceMap: false,
    publicPath: '/libs',
    subDirectory: '/libs/static'
  }
}

// dev 入口文件
Object.keys(jsResource).forEach((name) => {
  config.dev.entries['static/js/' + name] = jsResource[name]
})

// dev 环境引入编译后的 css
Object.keys(cssResource).forEach((name) => {
  config.dev.entries['static/css/' + name] = cssResource[name]
})

// build 输出 anchor-ui-.min.css
Object.keys(cssResource).forEach((name) => {
  config.build.entries['css/' + name + '.min'] = cssResource[name]
})

module.exports = config
