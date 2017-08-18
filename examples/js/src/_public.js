const _privateState = {
  clicked: false
}

export default {
  fixedNavSidebar () {
    $(document).scroll(function () {
      let $navSidebar = $('#nav-slidebar'), offset = $navSidebar.offset()
      let documentTop = $(this).scrollTop()
      let leftToTop = Math.ceil(offset.top - documentTop)
      if (leftToTop <= 10 && !_privateState.clicked) {
        $navSidebar.css({
          position: 'fixed',
          top: '10px',
          left: offset.left + 'px'
        })
      }
      if (documentTop <= 336) {
        $navSidebar.css({ position: '', top: '', left: ''})
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