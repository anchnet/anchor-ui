import escape from './escape'

export default {
  generateCode () {
    $('.bs-example').each(function (key, dom) {
      if (!$(this).attr('data-noGenerated')) {
        let codeHtml = escape.decode($(dom).html())
        $(dom).next('figure.highlight').find('code').html(codeHtml)
      }
    })
    $('figure.highlight code').each(function (i, block) {
      if ($(this).attr('data-decode')) {
        let codeHtml = escape.decode($(block).html())
        $(block).html(codeHtml)
      }
      hljs.highlightBlock(block)
    })
  },

  /* 将html转化为code并美化 */
  parseHtmlCode (html) {
    let code = html

    // base64图片替换为...
    code = code.replace(/data:image\/svg\+xml;base64[^"]+/g, '...')

    // 删掉空行和整段末尾的空格
    code = code.replace(/^\s*[\r\n]/gm, '').replace(/^\s*$/gm, '')

    let codeArr = code.split(/\r?\n/)

    // 首行和末行的开头空格数
    let firstLineSpaceLen = code.match(/^\s*/)[0].length
    let lastLineSpaceLen = codeArr[codeArr.length - 1].match(/^\s*/)[0].length

    // 取较大的空格数并删除每行开头的此数量的空格
    let spaceLen = Math.max(firstLineSpaceLen, lastLineSpaceLen)
    code = code.replace(new RegExp(`^\\s{${spaceLen}}`, 'gm'), '')

    code = escape.decode(code)
    return code
  }
}
