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
    scrollToBottom (container) {
      let $container = $(container)
      let $children = $container.children('*:first-child')
      let parentHeight = $container.height() || 0
      let childHeight = $children.height() || 0
      let scrollTop = childHeight - parentHeight
      let oldScrollTop = $container.scrollTop()
      if (scrollTop !== oldScrollTop) {
        this.smoothScroll($container, scrollTop, 300)
      }
    }
  }

  return _Utils
})(jQuery)

const utils = (() => new Utils())()

export default utils