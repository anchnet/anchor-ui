import escape from './escape'

export default {
  generateCode () {
    $('.bs-example').each((key, dom) => {
      let codeHtml = escape.decode($(dom).html())
      $(dom).next('figure.highlight').find('code').html(codeHtml)
    })
    $('figure.highlight code').each(function(i, block) {
      hljs.highlightBlock(block)
    })
  }
}