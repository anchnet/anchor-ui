import utils from 'examples/libs/utils'

/* 插入代码 */
const insertCode = (code) => `<pre><code>${code}</code></pre>`

/* 布局模板 */
const layoutTemplate = `
  <div class="app-sidebar" data-toggle="sidebar">
      ...
  </div>
  <div class="app-main">
      <div class="app-header">
          ...
      </div>
      <div class="app-body">
          <div class="app-block">
              ...
          </div>
      </div>
  </div>
`

$(document).ready(function () {
  /* 插入代码 */
  $('#layoutCode').html(insertCode(utils.parseHtmlCode(layoutTemplate)))
  $('#sidebarCode').html(insertCode(utils.getHtml('.app-sidebar')))
  $('#headerCode').html(insertCode(utils.getHtml('.app-header')))

  /* 代码高亮初始化 */
  $('figure.highlight code').each(function(i, block) {
    hljs.highlightBlock(block)
  })
})

