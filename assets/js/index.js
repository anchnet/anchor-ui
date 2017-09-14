import '../bootstrap/javascripts/bootstrap'
import '../libs/bootstrap-select/bootstrap-select'
import '../libs/bootstrap-tagsinput/bootstrap-tagsinput'
import '../libs/jquery.cookie/jquery.cookie'
import './src/sidebar'
import './src/tablefilter'
import './src/transfer'
import './src/table'

import datetimepicker from '../libs/bootstrap-datetimepicker/bootstrap-datetimepicker.min'

!function ($) {
  $.fn.reverse = [].reverse
  $.fn.datetimepicker = datetimepicker

  $.extend({
    ANCHOR_VERSION: '0.3.0'
  })
}(jQuery);
