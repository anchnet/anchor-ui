const _privateState = {
  clicked: false,
  apartToParent: '',
  beforeScroll: $(document).scrollTop(),
  direction: '',
  initStatus: true,
}

export default {
  fixedNavSidebar () {
    $(document).scroll(function () {
      let $navSidebar = $('#nav-slidebar')
      let $navSidebarParent = $('#nav-slidebar').parent()
      // DOM 元素高度
      let elementHeight = $navSidebar.height()
      // DOM 元素在 Document 文档内的位置
      let elementOffset = $navSidebar.offset()
      // Document 文档向上滚动距离
      let documentScrollTop = $(this).scrollTop()
      // Document 高度
      let documentHeight = $(document).height()
      // DOM 元素到浏览器可视区域顶部距离
      let apartToTop = Math.ceil(elementOffset.top - documentScrollTop)
      // DOM 元素到浏览器可视区域底部距离
      let apartToBottom = documentHeight - ( elementHeight + elementOffset.top )
      // 当文档位于顶部区域时
      if (documentScrollTop <= 336) {
        $navSidebar.css({ position: '', top: '', left: ''})
      } else if (!_privateState.clicked) {    // 延迟加载
        // 判断滚动方向
        let afterScroll = $(this).scrollTop()
        _privateState.direction = afterScroll - _privateState.beforeScroll >= 0 ? 'down' : 'up'
        _privateState.beforeScroll = afterScroll

        // 初始化情况处理
        // if (_privateState.initStatus) {
        //   _privateState.initStatus = false
        // }

        let position = '', top = '', left = ''
        // 向下滚动时
        if (_privateState.direction === 'down') {
          // 滚动到底部区域时
          if (apartToBottom <= 230) {
            // 记录 DOM 加载完成时与父元素的相对位置
            if (!_privateState.apartToParent) {
              _privateState.apartToParent =  elementOffset.top - $navSidebarParent.offset().top + 'px'
            }

            position = 'absolute'
            left = ''
            top = _privateState.apartToParent

          } else if (apartToTop <= 10) { // 滚动到中间与区域时
            position = 'fixed'
            top = '10px'
            left = elementOffset.left + 'px'
          }
        }

        // 向上滚动时
        if (_privateState.direction === 'up') {
          // 滚动到中间区域时
          if (apartToTop >= 10) {
            position = 'fixed'
            top = '10px'
            left = elementOffset.left + 'px'

          } else if (apartToBottom <= 230) {    // 位于底部区域时
            if (!_privateState.apartToParent) {
              _privateState.apartToParent =  elementOffset.top - $navSidebarParent.offset().top + 'px'
            }
            position = 'absolute'
            left = ''
            top = _privateState.apartToParent
          }
        }

        // 离开底部区域时，清除相对位置信息
        if (apartToBottom > 230) {
          _privateState.apartToParent = ''
        }

        $navSidebar.css({ position: position, top: top, left: left })
      }
    })
  },

  smoothScroll () {
    $('#nav-slidebar').on('click', 'a[href^="#"]', function () {
      _privateState.clicked = true
      let el = $(this).attr('href')
      let scrollTop = el === '#return-top' ? 0 :Math.ceil($(el).offset().top) - 10
      $('html, body').animate({scrollTop: scrollTop + 'px'}, 800)
      setTimeout(function () {
        _privateState.clicked = false
      }, 50)
    })
  }
}