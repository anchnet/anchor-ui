const resource = require('../resource.json')
const jsSourceMap = require('../examples/js/controller/sourceMap.json')
const cssSourceMap = require('../examples/scss/sourceMap.json')

const entry = {
  dev: {},
  build: {},
}

// dev 入口文件
//环境引入编译后的 全局 js && css 文件
Object.keys(resource).forEach((name) => {
  entry.dev['static/' + name] = resource[name]
})
// dev 环境引入编译后的 js
Object.keys(jsSourceMap).forEach((name) => {
  entry.dev['static/js/' + name] = jsSourceMap[name]
})
// dev 环境引入编译后的 css
Object.keys(cssSourceMap).forEach((name) => {
  entry.dev['static/css/' + name] = cssSourceMap[name]
})

// prod 入口文件
Object.keys(resource).forEach((name) => {
  entry.build[name + '.min'] = resource[name]
})

module.exports = entry
