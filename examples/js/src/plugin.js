import _public from './_public'

$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip()
  $('[data-toggle="popover"]').popover()

  console.log('ANCHOR_VERSION: ' + $.ANCHOR_VERSION)

  _public.fixedNavSidebar()
  _public.smoothScroll()

  /* 过滤器组件 */
  {
    $('#toggleTableFilter').on('click', function () {
      $('#basicTableFilter').tablefilter('toggle')
    })
  }

  /* 表格组件 */
  {
    $('#basicTable').on('filter.changed.anchor.table', function (event, data) {
      console.log('字段更新', data.data)
    })

    $('#basicTableOpt a').on('click', function (event) {
      event.preventDefault()
      var value = $(this).data('opt')
      var selected = $('#basicTable').table('selected')
      console.log('操作按钮', value, selected)
    })
  }
})
