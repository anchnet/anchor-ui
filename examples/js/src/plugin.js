import _public from './_public'

$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip()
  $('[data-toggle="popover"]').popover()

  console.log('ANCHOR_VERSION: ' + $.ANCHOR_VERSION)

  _public.fixedNavSidebar()
  _public.smoothScroll()

  $('#basicTable').on('filter.changed.anchor.table', function (event, data) {
    console.log('字段更新', data)
  })
  $('#basicTableOpt').on('changed.bs.select', function () {
    var value = $(this).selectpicker('val')
    var selected = $('#basicTable').table('val')
    console.log('操作按钮', value, selected)
  })
})
