import '../bootstrap/javascripts/bootstrap'
import '../libs/bootstrap-select/bootstrap-select'
import '../libs/bootstrap-tagsinput/bootstrap-tagsinput'
import '../libs/bootstrap-datetimepicker/bootstrap-datetimepicker.min' // 源码（引用方式部分）有修改，更新需注意！
import '../libs/jquery.cookie/jquery.cookie'
import './src/sidebar'
import './src/tablefilter'
import './src/transfer'
import './src/table'

import utils from './src/utils'

!function ($) {
  $.fn.reverse = [].reverse

  $.extend({
    utils: utils,
    ANCHOR_VERSION: '0.3.0'
  })
}(jQuery);
