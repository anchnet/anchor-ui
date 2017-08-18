export default {
  fixedNavSidebar () {
    $(document).scroll(function () {
      let $navSidebar = $('#nav-slidebar'), offset = $navSidebar.offset()
      let documentTop = $(this).scrollTop()
      let leftToTop = Math.ceil(offset.top - documentTop)
      if (leftToTop <= 10 && leftToTop > 0) {
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
      let $el = $($(this).attr('href'))
      let scrollTop = Math.ceil($el.offset().top) - 10
      $('html, body').animate({scrollTop: scrollTop + 'px'}, 800)
    })
  }
}