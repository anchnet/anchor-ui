import utils from 'examples/libs/utils'

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

/* 插入代码 */
$('#layoutCode').html(utils.chain(layoutTemplate, 'parseHtmlCode', 'insertCode'))
$('#sidebarCode').html(utils.chain('.app-sidebar', 'getHtml', 'parseHtmlCode', 'insertCode'))
$('#headerCode').html(utils.chain('.app-header', 'getHtml', 'parseHtmlCode', 'insertCode'))

/* 代码高亮初始化 */
utils.highlightCode()
