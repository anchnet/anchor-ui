import utils from 'examples/libs/utils'

$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip()
  $('[data-toggle="popover"]').popover()

  console.log('ANCHOR_VERSION: ' + $.ANCHOR_VERSION)

  utils.generateCode()
  $('figure.highlight code').each(function(i, block) {
    hljs.highlightBlock(block)
  })
})