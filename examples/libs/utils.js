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
  }
}