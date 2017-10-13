const Utils = (($) => {

  let CLICKED = false

  class _Utils {
    // 平滑滚动效果
    smoothScroll (scrollElement = $('html, body'), scrollTop, time = 800) {
      try {
        if (!scrollElement) {
          throw 'The scrollElement is not belongs of jquery.'
        }
        CLICKED = true
        scrollElement.animate({scrollTop: scrollTop + 'px'}, time)
        setTimeout(() => {
          CLICKED = false
        }, 50)
      } catch (e) {
        console.error("Error: ", e)
      }
    }

    // 滚动到底部
    scrollToBottom (container, openWatch = false, baseWatch = 300) {
      const $container = $(container)
      const $children = $container.children('*:first-child')
      const parentHeight = $container.height() || 0
      const childHeight = $children.height() || 0
      const scrollTop = childHeight - parentHeight
      const oldScrollTop = $container.scrollTop()
      if (openWatch && scrollTop - oldScrollTop > baseWatch) return
      if (scrollTop !== oldScrollTop) {
        this.smoothScroll($container, scrollTop, 300)
      }
    }
  }

  return _Utils
})(jQuery)

const utils = (() => new Utils())()

export default utils