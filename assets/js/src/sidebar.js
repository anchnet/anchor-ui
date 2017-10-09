/**
 * sidebar
 */

const Sidebar = (($) => {

  /**
   * Constants
   */

  const NAME = 'sidebar'
  const VERSION = '1.0.0-beta'
  const DATA_KEY = 'anchor.sidebar'
  const EVENT_KEY = `.${DATA_KEY}`
  const DATA_API_KEY = '.data-api'
  const DATA_HIERARCHY = '[data-hierarchy]'
  const JQUERY_NO_CONFLICT = $.fn[NAME]
  const TRANSITION_UNIT_DURATION = 13.5

  const Default = {}

  const Event = {
    LOAD_DATA_API: `load${EVENT_KEY}${DATA_API_KEY}`,
    CLICK_DATA_API: `click${EVENT_KEY}${DATA_API_KEY}`
  }

  const Selector = {
    DATA_SIDEBAR: '[data-toggle="sidebar"]',
    MENU_WRAPPER: '.menu-wrapper',
    MENU_GROUP: '.menu-group',
    MENU_TITLE: '.menu-title',
    MENU_SUB_TITLE: '.menu-sub-title',
    MENU_DOT: '.menu-dot',
    MENU_TRIANGLE: '.menu-triangle',
    ACTIVE: '.active',
    SELECTED: '.selected',
    NO_TRANSITION: '.no-transition'
  }

  /**
   * Class Definition
   */

  class Sidebar {
    constructor (root, config) {
      this._config = this._getConfig(config)
      this.$root = $(root)

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
      let hierarchies = []

      this.$root.find(Selector.MENU_TITLE).each((i, el) => {
        let $menuGroup = $(el).closest(Selector.MENU_GROUP)
        let groupNum = $(el).parents(Selector.MENU_GROUP).length

        while ($menuGroup.find(Selector.MENU_TITLE).length <= 1 && groupNum > 0) {
          groupNum -= 1
          $menuGroup = $menuGroup.parent().closest(Selector.MENU_GROUP)
        }

        let isFirst = $(el).index($menuGroup.find(Selector.MENU_TITLE)) === 0
        let hierarchyNum = groupNum + (isFirst ? 0 : 1)

        if (!hierarchies[hierarchyNum]) hierarchies[hierarchyNum] = []
        hierarchies[hierarchyNum].push(el)
      })

      let hierarchyCount = 0
      hierarchies.forEach((hierarchyItems) => {
        if (hierarchyItems) {
          hierarchyItems.forEach((element) => {
            if (hierarchyCount) {
              $(element)
                .addClass(Sidebar._getNameFromClass(Selector.MENU_SUB_TITLE))
                .removeClass(Sidebar._getNameFromClass(Selector.MENU_TITLE))
              if (hierarchyCount > 1) $(element).addClass(`sub-${hierarchyCount}`)
            }
          })
          hierarchyCount ++
        }
      })

      this.$root.find(Selector.MENU_TITLE).append(`<i class="${Sidebar._getNameFromClass(Selector.MENU_DOT)}"></i>`)
      this.$root.find(Selector.MENU_SUB_TITLE).each((i, el) => {
        let $menuGroup = $(el).closest(Selector.MENU_GROUP)
        let isFirst = $(el).index($menuGroup.find(Selector.MENU_SUB_TITLE)) === 0
        let hasChildren = $menuGroup.find(Selector.MENU_SUB_TITLE).length > 1

        if (!isFirst) return
        else if (!hasChildren) return

        $(el).append(`<i class="${Sidebar._getNameFromClass(Selector.MENU_TRIANGLE)}"></i>`)
      })

      let $selected = this.$root.find(`${Selector.MENU_SUB_TITLE}${Selector.SELECTED}`)
      if ($selected.length) {
        let activeClass = Sidebar._getNameFromClass(Selector.ACTIVE)
        $selected.parents(Selector.MENU_GROUP).each((i, el) => {
          let $el = $(el).find(Selector.MENU_SUB_TITLE).first()
          let $menuTitle = $(el).find(Selector.MENU_TITLE)

          if (!$el.length) return
          else if ($el.attr('href')) return
          else if ($menuTitle.length) return

          $el.addClass(Sidebar._getNameFromClass(Selector.NO_TRANSITION))
          this.toggleMenuGroup($el[0], false)
        })
        $selected.parents(Selector.MENU_GROUP).each((i, el) => {
          let $el = $(el).find(Selector.MENU_TITLE).first()

          if (!$el.length) return

          this.toggleMenuGroup($el[0], false)
        })
      }

      this.$root.addClass('sidebar-component-inited')

      if (!$('<div>').append(this.$root.clone()).find(Selector.DATA_SIDEBAR).length) {
        this.$root.attr('data-toggle', 'sidebar')
      }
    }

    toggleMenuGroup (element, transition = true) {
      let $element = $(element)
      let $menuGroup = $element.closest(Selector.MENU_GROUP)
      let activeClass = Sidebar._getNameFromClass(Selector.ACTIVE)
      let isActive = $element.hasClass(activeClass)
      let currentHeight = $menuGroup.height()
      let targetHeight

      if (isActive) {
        targetHeight = 34
      } else {
        targetHeight = 0
        $menuGroup.children().each((i, el) => {
          targetHeight += $(el).height()
        })
      }

      let transitionDuration
      if (transition) {
        let heightDiff = targetHeight - currentHeight
        if (heightDiff < 0) heightDiff = heightDiff * -1
        transitionDuration = TRANSITION_UNIT_DURATION * Math.sqrt(heightDiff)
      } else {
        transitionDuration = 0
      }

      $element.toggleClass(activeClass)
      setTimeout(() => {
        $element.removeClass(Sidebar._getNameFromClass(Selector.NO_TRANSITION))
      }, 0)
      $menuGroup.animate({height: targetHeight}, transitionDuration, () => {
        if (isActive) {}
        else {
          setTimeout(() => {
            $menuGroup.css({height: 'auto'})
          }, 0)
        }
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
      return this.each((i, el) => {
        let data = $(el).data(DATA_KEY)
        let _config = $.extend(
          {},
          Sidebar.Default,
          typeof config === 'object' && config
        )

        if (!data) {
          data = new Sidebar(el, _config)
          $(el).data(DATA_KEY, data)
        }
      })
    }

    static _menuTitleClickHandler (event) {
      let target = $(event.target).closest(Selector.DATA_SIDEBAR)[0]
      if (!$(target).length) return

      if ($(event.target).attr('href')) return
      event.preventDefault()

      let config = $.extend({}, $(target).data())
      Sidebar._jQueryInterface.call($(target), config)

      $(target).data(DATA_KEY).toggleMenuGroup(event.target)
    }
  }

  /**
   * Data Api
   */

  $(document)
    .on(Event.CLICK_DATA_API, Selector.MENU_TITLE, Sidebar._menuTitleClickHandler)
    .on(Event.CLICK_DATA_API, Selector.MENU_SUB_TITLE, Sidebar._menuTitleClickHandler)

  $(document).ready(() => {
    $(Selector.DATA_SIDEBAR).each((i, el) => {
      let $sidebar = $(el)

      Sidebar._jQueryInterface.call($sidebar, $sidebar.data())
    })
  })

  /**
   * jQuery
   */

  $.fn[NAME] = Sidebar._jQueryInterface
  $.fn[NAME].Constructor = Sidebar
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Sidebar._jQueryInterface
  }

  return Sidebar

})(jQuery)

export default Sidebar
