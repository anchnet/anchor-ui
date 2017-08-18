import utils from 'examples/libs/utils'
import _public from './_public'

$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip()
  $('[data-toggle="popover"]').popover()

  console.log('ANCHOR_VERSION: ' + $.ANCHOR_VERSION)

  utils.generateCode()

  _public.fixedNavSidebar()
  _public.smoothScroll()
})