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

  parseHtmlCode (html) {
    let code = html
    code = code.replace(/data:image\/svg\+xml;base64[^"]+/g, '...')
    code = code.replace(/^\s*[\r\n]/gm, '').replace(/^\s*$/gm, '')
    let spaceLen = code.match(/^\s*/)[0].length
    code = code.replace(new RegExp(`^\\s{${spaceLen}}`, 'gm'), '')
    code = escape.decode(code)
    return code
  }
}
