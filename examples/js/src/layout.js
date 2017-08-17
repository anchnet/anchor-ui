import escape from 'examples/libs/escape'

/* 插入代码 */
const insertCode = (code) => `<pre><code>${code}</code></pre>`
const getHtml = (el) => escape.decode($(el).clone().appendTo('<div>').html())

$(document).ready(function () {
  /* 布局代码 */
  let layoutTemplate = `
    <div class="app-sidebar" data-toggle="sidebar"></div>
    <div class="app-wrapper">
      <div class="app-header"></div>
      <div class="app-body">
        <div class="app-block">
          ...
        </div>
      </div>
    </div>
  `
  $('#layoutCode').html(insertCode(escape.decode(layoutTemplate)))

  /* 侧边栏代码 */
  $('#sidebarCode').html(insertCode(getHtml('.app-sidebar')))

  /* 顶部代码 */
  $('#headerCode').html(insertCode(getHtml('.app-header')))

  /* 代码高亮 */
  $('figure.highlight code').each(function(i, block) {
    hljs.highlightBlock(block)
  })
})
