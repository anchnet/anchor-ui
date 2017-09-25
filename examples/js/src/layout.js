import utils from 'examples/libs/utils'
import _public from './_public'

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
$('#layoutInfoCode').html(utils.chain('#layoutInfoContent', 'getHtml', 'parseHtmlCode', 'insertCode'))
$('#createTemplateCode').html(utils.chain('#createTemplate', 'getHtml', 'parseHtmlCode', 'insertCode'))

/* 代码高亮初始化 */
utils.highlightCode()

$(function () {
  _public.smoothScroll($('.app-header'), $('.app-body'))

  var myTextarea = document.getElementById('editor');
  var CodeMirrorEditor = CodeMirror.fromTextArea(myTextarea, {
    lineWrapping: true,         //是否换行
    foldGutter: true,           //是否折叠
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"], //添加行号栏，折叠栏
    lineNumbers: true,          //是否显示行号
    matchBrackets: true,
    autoCloseBrackets: true,
    mode: {name: "javascript", json: true},
    // mode: "application/ld+json",
    lineWrapping: true,
    indentWithTabs: true,
    readOnly: true,
  });

})
