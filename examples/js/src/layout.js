import utils from 'examples/libs/utils'

/* 插入代码 */
const insertCode = (code) => `<pre><code>${code}</code></pre>`
const getHtml = (el) => {
  let $el = $(el).clone()
  $el.find('.menu-group').removeAttr('style')
  $el.find('.menu-dot').remove()
  $el.find('.menu-triangle').remove()
  let $div = $('<div>').append($el)
  return utils.parseHtmlCode($div.html())
}

$(document).ready(function () {
  /* 布局模板 */
  let layoutTemplate = `
    <body style="height: 100%; overflow: hidden;">
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
    </body>
  `

  /* 插入代码 */
  $('#layoutCode').html(insertCode(utils.parseHtmlCode(layoutTemplate)))
  $('#sidebarCode').html(insertCode(getHtml('.app-sidebar')))
  $('#headerCode').html(insertCode(getHtml('.app-header')))

  /* 代码高亮初始化 */
  $('figure.highlight code').each(function(i, block) {
    hljs.highlightBlock(block)
  })
})
