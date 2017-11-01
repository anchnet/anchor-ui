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

  const Default = {
    maxWidth: 960,
    minWidth: 240
  }

  const Event = {
    LOAD_DATA_API: `load${EVENT_KEY}${DATA_API_KEY}`,
    CLICK_DATA_API: `click${EVENT_KEY}${DATA_API_KEY}`
  }

  const Selector = {
    DATA_SIDEBAR: '[data-toggle="sidebar"]',
    SEARCH_WRAPPER: '.search-wrapper',
    INPUT_SEARCH: '.input-search',
    MENU_WRAPPER: '.menu-wrapper',
    MENU_GROUP: '.menu-group',
    MENU_TITLE: '.menu-title',
    MENU_SUB_TITLE: '.menu-sub-title',
    MENU_DOT: '.menu-dot',
    MENU_TRIANGLE: '.menu-triangle',
    TOGGLE_SIDEBAR: '.toggle-sidebar',
    ACTIVE: '.active',
    SELECTED: '.selected',
    NO_TRANSITION: '.no-transition',
    APP_MAIN: '.app-main'
  }

  /**
   * Class Definition
   */

  class Sidebar {
    constructor (root, config) {
      this._config = this._getConfig(config)
      this.$root = $(root)

      this._currentWidth = null
      this._changingWidth = false
      this._mousePosX = null

      this.init()
      this.initSearch()
      this.initToggleSidebar()

      this.$root.addClass('sidebar-component-inited')
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

      this.toggleSelectedMenuGroup()

      if (!$('<div>').append(this.$root.clone()).find(Selector.DATA_SIDEBAR).length) {
        this.$root.attr('data-toggle', 'sidebar')
      }

      this._currentWidth = this.$root.width()
    }

    initSearch () {
      if (!this.$root.find(Selector.SEARCH_WRAPPER).length) return

      let $wrapper = this.$root.find(Selector.SEARCH_WRAPPER)
      let $input = $wrapper.find(Selector.INPUT_SEARCH)
      let $remove = $wrapper.find('.glyphicon-remove-circle')
      let storageKey = 'sidebarSearchWord'
      let storedSearchWord = sessionStorage.getItem(storageKey)

      this.$root.find(Selector.MENU_WRAPPER).addClass('with-search')

      $input.on('input', (event) => {
        let allMenuTitleSelector = `${Selector.MENU_TITLE}, ${Selector.MENU_SUB_TITLE}`
        let value = $(event.target).val()
        let $groups = this.$root.find(Selector.MENU_GROUP)
        let $menuTitles = this.$root.find(allMenuTitleSelector)
        let validSearchWord

        $groups.each((i, group) => {
          let $firstMenuTitle = $(group).find(allMenuTitleSelector).eq(0)
          this.toggleMenuGroup($firstMenuTitle.get(0), {
            active: false,
            transition: false
          })
        })

        if (value) {
          $remove.addClass('active')
          $groups.addClass('hide')
          $menuTitles.addClass('hide')

          $menuTitles.each((index, menuTitle) => {
            let titleText = $(menuTitle).text().trim()

            if (titleText.toLowerCase().includes(value.toLowerCase())) {
              let $menuGroup = $(menuTitle).closest(Selector.MENU_GROUP)
              let $activeGroups = $(menuTitle).parents(Selector.MENU_GROUP)
              let isFirstTitle = $(menuTitle).index($menuGroup.find(allMenuTitleSelector)) === 0

              $(menuTitle).removeClass('hide')

              $activeGroups.each((i, group) => {
                let $firstMenuTitle = $(group).find(allMenuTitleSelector).eq(0)

                $(group).removeClass('hide')
                $firstMenuTitle.removeClass('hide')

                this.toggleMenuGroup($firstMenuTitle.get(0), {
                  active: true,
                  transition: false
                })
              })

              if (isFirstTitle) {
                $menuGroup.find(Selector.MENU_GROUP).removeClass('hide')
                $menuGroup.find(allMenuTitleSelector).removeClass('hide')
              }

              validSearchWord = value
            }
          })
        } else {
          $remove.removeClass('active')
          $groups.removeClass('hide')
          $menuTitles.removeClass('hide')

          this.toggleSelectedMenuGroup()
        }

        if (validSearchWord) sessionStorage.setItem(storageKey, validSearchWord)
        else sessionStorage.removeItem(storageKey)
      })

      $remove.on('click', (event) => {
        $input.val('').trigger('input')
      })

      if (storedSearchWord !== null) {
        $input.val(storedSearchWord).trigger('input')
      }
    }

    initToggleSidebar () {
      $(document).on('mousedown', (event) => {
        if ($(event.target).closest(Selector.TOGGLE_SIDEBAR).length) {
          this._changingWidth = true
          this._mousePosX = event.clientX
          this.$root
            .addClass('no-select')
            .find('> .component-mask').css({display: 'block'})
          $(Selector.APP_MAIN)
            .addClass('no-select')
            .find('> .component-mask').css({display: 'block'})
          $('html, body').addClass('cursor-ew-resize')
        }
      })

      $(document).on('mouseup', (event) => {
        if (this._changingWidth) {
          this._changingWidth = false
          this._currentWidth = this.$root.width()
          this.$root
            .removeClass('no-select')
            .find('> .component-mask').css({display: 'none'})
          $(Selector.APP_MAIN)
            .removeClass('no-select')
            .find('> .component-mask').css({display: 'none'})
          $('html, body').removeClass('cursor-ew-resize')

          let storageKey = 'sidebarWidth'

          sessionStorage.setItem(storageKey, this._currentWidth)
        }
      })

      $(document).on('mousemove', (event) => {
        if (this._changingWidth) {
          let move = event.clientX - this._mousePosX
          let sidebarWidth = this._currentWidth + move

          if (sidebarWidth > Sidebar.Default.maxWidth) sidebarWidth = Sidebar.Default.maxWidth
          else if (sidebarWidth < Sidebar.Default.minWidth) sidebarWidth = Sidebar.Default.minWidth

          this.$root.css({width: sidebarWidth})
          $(Selector.APP_MAIN).css({'margin-left': sidebarWidth})
        }
      })
    }

    toggleMenuGroup (element, options = {}) {
      let {
        active = null,
        transition = true
      } = options
      let $element = $(element)
      let $menuGroup = $element.closest(Selector.MENU_GROUP)
      let activeClass = Sidebar._getNameFromClass(Selector.ACTIVE)
      let isActive = $element.hasClass(activeClass)
      let currentHeight = $menuGroup.height()
      let targetHeight

      if (active === isActive) return
      if (active === null) active = !isActive

      if (active) {
        targetHeight = 0
        $menuGroup.children().each((i, el) => {
          if ($(el).is(':visible')) targetHeight += $(el).height()
        })
      } else {
        targetHeight = 34
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
        if (active) $menuGroup.css({height: 'auto'})
      })
    }

    toggleSelectedMenuGroup () {
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
          this.toggleMenuGroup($el.get(0), {transition: false})
        })
        $selected.parents(Selector.MENU_GROUP).each((i, el) => {
          let $el = $(el).find(Selector.MENU_TITLE).first()

          if (!$el.length) return

          this.toggleMenuGroup($el.get(0), {transition: false})
        })
      }
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
