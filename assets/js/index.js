import '../bootstrap/javascripts/bootstrap'
import '../libs/bootstrap-select/bootstrap-select'
import './src/sidebar'
import './src/transfer'
import './src/table'

!function ($) {
  $.fn.reverse = [].reverse
  $.extend({
    ANCHOR_VERSION: '0.3.0'
  })
}(jQuery)
