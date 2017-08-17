import escape from './escape'

const utils = {
  generateCode () {
    // 暴露 html
    $('.bs-example').each(function (key, dom) {
      let $this = $(this)
      if (!$this.attr('data-no-generated')) {
        let $dom = $(dom), parsedHtml = ''
        if ($dom.attr('data-code-type') === 'selectpicker') {
          let $selectpicker = $dom.find('.selectpicker').clone()
          let tempDOM = document.createElement('div')
          $(tempDOM).append($selectpicker)
          parsedHtml = utils.parseHtmlCode($(tempDOM).html())
        } else {
          parsedHtml = utils.parseHtmlCode($dom.html())
        }
        $(dom).next('figure.highlight').find('code').html(parsedHtml)
      }
    })
    $('figure.highlight code').each(function (i, block) {
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
  },

  /* 获取html内容（包含自身） */
  getHtml (el) {
    let $div = $('<div>').append($(el).clone())
    return this.parseHtmlCode($div.html())
  }
}

export default utils