/**
 * slider
 */

const Slider =(($) => {

  /**
   * Constants
   */

  const NAME = 'slider'
  const VERSION = '1.0.0-beta'
  const DATA_KEY = 'anchor.slider'
  const EVENT_KEY = `.${DATA_KEY}`
  const DATA_API_KEY = '.data-api'
  const JQUERY_NO_CONFLICT = $.fn[NAME]

  const Default = {
    activeKey: 0
  }

  const Event = {
    LOAD_DATA_API: `load${EVENT_KEY}${DATA_API_KEY}`,
    CLICK_DATA_API: `click${EVENT_KEY}${DATA_API_KEY}`,
    MOUSE_UP_DATA_API: `mouseup${EVENT_KEY}${DATA_API_KEY}`,
    MOUSE_DOWN_DATA_API: `mousedown${EVENT_KEY}${DATA_API_KEY}`,
    MOUSE_MOVE_DATA_API: `mousemove${EVENT_KEY}${DATA_API_KEY}`
  }

  const Selector = {
    DATA_SLIDER: '[data-toggle="slider"]',
    SLIDER_COMPONENT: '.slider-component',
    SIDER_HANDLE: '.custom-slide-handle',
    RC_SLIDER: '.rc-slider',
    RC_SLIDER_MARK_TEXT: '.rc-slider-mark-text'
  }

  /**
   * Class Definition
   */

  class Slider {
    constructor(root, config) {
      this._config = this._getConfig(config)
      this.$root = $(root)
      this.activeKey = 0
      this.init()
    }
    // getters

    static get VERSION () {
      return VERSION
    }

    static get Default () {
      return Default
    }

    // public
    init () {
      this.$root.find(Selector.SIDER_HANDLE)
      this.changeSlider(null, 'init', this._config.activeKey)
    }

    getActiveKey() {
      $(Selector.RC_SLIDER_MARK_TEXT).each(function(index) {
        let $this = $(this)
        if($(this).hasClass('active')) this.activeKey = index
      })
      console.log(this.activeKey)
      return this.activeKey
    }

    changeSlider (clientX, action = 'mousemove', index) {
      let siderHandle = $(Selector.SIDER_HANDLE)
      let slider = $(Selector.DATA_SLIDER),
          left = slider.offset().left,
          width = slider.width(),
          perWidth = width/($(Selector.RC_SLIDER_MARK_TEXT).length - 1)
      this.activeKey =  index ? index : Math.round((clientX - left)/perWidth)
      siderHandle.css('left', `${clientX - left}px`)
      if(clientX - left < 0) {
        siderHandle.css('left', 0)
      }
      if(clientX - left > width) {
        siderHandle.css('left', width)
      }
      if(action !== 'mousemove') {
        siderHandle.css('left', `${this.activeKey*perWidth}px`)
        $(Selector.RC_SLIDER_MARK_TEXT).removeClass('active').eq(this.activeKey).addClass('active')
      }
    }

    toggleSlider (event) {
      $(document).on('mousemove', (e) => {
        this.changeSlider(e.clientX)
      })

      $(document).on('mouseup', (e) => {
        this.changeSlider(e.clientX)
        $(document).off('mousemove')
        $(document).off('mouseup')
      })
    }

    // private

    _getConfig (config) {
      config = $.extend({}, Default, config)

      return config
    }

    // static

    static _getNameFromClass (className) {
      className = className.replace(/\./g, '')

      return className
    }

    static _jQueryInterface (config) {
      let funcResult

      let defaultResult = this.each((i, el) => {
        let data = $(el).data(DATA_KEY)
        let _config = $.extend(
          {},
          Slider.Default,
          $(el).data(),
          typeof config === 'object' && config
        )

        if (!data) {
          data = new Slider(el, _config)
          $(el).data(DATA_KEY, data)
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new Error(`No method named "${config}"`)
          }
          funcResult = data[config]()
        }
      })

      return funcResult === undefined ? defaultResult : funcResult
    }

    static  _siderHandleMouseDownHandler (event) {
      let target = $(event.target).closest(Selector.DATA_SLIDER)[0]
      if (!$(target).length) return

      let config = $.extend({}, $(target).data())
      Slider._jQueryInterface.call($(target), config)

      $(target).data(DATA_KEY).toggleSlider(event)
    }

    static  _siderHandleClickHandler (event) {
      let target = $(event.target).closest(Selector.DATA_SLIDER)[0]
      if (!$(target).length) return

      let config = $.extend({}, $(target).data())
      Slider._jQueryInterface.call($(target), config)

      $(target).data(DATA_KEY).changeSlider(event.clientX, 'click')
    }
  }


/**
 * Data Api
 */
$(document)
  .on(Event.MOUSE_DOWN_DATA_API, Selector.SIDER_HANDLE, Slider._siderHandleMouseDownHandler)
  .on(Event.CLICK_DATA_API, Selector.RC_SLIDER, Slider._siderHandleClickHandler)

$(document).ready(() => {
  $(Selector.DATA_SIDEBAR).each((i, el) => {
    let $slider = $(el)

    Slider._jQueryInterface.call($slider, $slider.data())
  })
})

/**
 * jQuery
 */

$.fn[NAME] = Slider._jQueryInterface
$.fn[NAME].Constructor = Slider
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Slider._jQueryInterface
}

return Slider

})(jQuery)

