const STATIC_DATA = {
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
      } else if (!STATIC_DATA.clicked) {    // 延迟加载
        // 判断滚动方向
        let afterScroll = $(this).scrollTop()
        STATIC_DATA.direction = afterScroll - STATIC_DATA.beforeScroll >= 0 ? 'down' : 'up'
        STATIC_DATA.beforeScroll = afterScroll

        // 初始化情况处理
        // if (STATIC_DATA.initStatus) {
        //   STATIC_DATA.initStatus = false
        // }

        let position = '', top = '', left = ''
        // 向下滚动时
        if (STATIC_DATA.direction === 'down') {
          // 滚动到底部区域时
          if (apartToBottom <= 230) {
            // 记录 DOM 加载完成时与父元素的相对位置
            if (!STATIC_DATA.apartToParent) {
              STATIC_DATA.apartToParent =  elementOffset.top - $navSidebarParent.offset().top + 'px'
            }

            position = 'absolute'
            left = ''
            top = STATIC_DATA.apartToParent

          } else if (apartToTop <= 10) { // 滚动到中间与区域时
            position = 'fixed'
            top = '10px'
            left = elementOffset.left + 'px'
          }
        }

        // 向上滚动时
        if (STATIC_DATA.direction === 'up') {
          // 滚动到中间区域时
          if (apartToTop >= 10) {
            position = 'fixed'
            top = '10px'
            left = elementOffset.left + 'px'

          } else if (apartToBottom <= 230) {    // 位于底部区域时
            if (!STATIC_DATA.apartToParent) {
              STATIC_DATA.apartToParent =  elementOffset.top - $navSidebarParent.offset().top + 'px'
            }
            position = 'absolute'
            left = ''
            top = STATIC_DATA.apartToParent
          }
        }

        // 离开底部区域时，清除相对位置信息
        if (apartToBottom > 230) {
          STATIC_DATA.apartToParent = ''
        }

        $navSidebar.css({ position: position, top: top, left: left })
      }
    })
  },

  smoothScroll (wrapperElement, scrollElement) {
    if (!wrapperElement) wrapperElement = $('#nav-slidebar')
    wrapperElement.on('click', 'a[href^="#"]', function () {
      STATIC_DATA.clicked = true
      let el = $(this).attr('href')
      let scrollTop = el === '#return-top' ? 0 :Math.ceil($(el).offset().top) - 10
      if (!scrollElement) scrollElement = $('html, body')
      scrollElement.animate({scrollTop: scrollTop + 'px'}, 800)
      setTimeout(function () {
        STATIC_DATA.clicked = false
      }, 50)
    })
  }
}