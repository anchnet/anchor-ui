/**
 * transfer
 */

const Transfer = (($) => {

  /**
   * Constants
   */

  const NAME = 'transfer'
  const VERSION = '1.0.0-beta'
  const DATA_KEY = 'anchor.transfer'
  const EVENT_KEY = `.${DATA_KEY}`
  const DATA_API_KEY = '.data-api'
  const JQUERY_NO_CONFLICT = $.fn[NAME]

  const Default = {}

  const Event = {
    LOAD_DATA_API: `load${EVENT_KEY}${DATA_API_KEY}`,
    CLICK_DATA_API: `click${EVENT_KEY}${DATA_API_KEY}`
  }

  const Selector = {
    DATA_TRANSFER: '[data-toggle="transfer"]',
    BLOCK_LEFT: '.transfer-left',
    BLOCK_RIGHT: '.transfer-right',
    TRANSFER_TO_RIGHT: '.transfer-to-right',
    TRANSFER_TO_LEFT: '.transfer-to-left',
    SORT_UP: '.sort-up',
    SORT_DOWN: '.sort-down'
  }

  const Template = (id, options) => {
    let templates = {
      LEFT_BUTTONS: `<div class="transfer-btns">
        <button class="${options.className.right} btn btn-default" type="button">
          <span class="glyphicon glyphicon-menu-right"></span>
        </button>
        <button class="${options.className.left} btn btn-default" type="button">
          <span class="glyphicon glyphicon-menu-left"></span>
        </button>
      </div>`,
      RIGHT_BUTTONS: `<div class="transfer-btns">
        <button class="${options.className.up} btn btn-default" type="button">
          <span class="glyphicon glyphicon-menu-up"></span>
        </button>
        <button class="${options.className.down} btn btn-default" type="button">
          <span class="glyphicon glyphicon-menu-down"></span>
        </button>
      </div>`
    }
    return templates[id]
  }

  /**
   * Class Definition
   */

  class Transfer {
    constructor (root, config) {
      this._config = this._getConfig(config)
      this.$root = $(root)
      this.$block = {}
      this.$block.left = this.$root.find(Selector.BLOCK_LEFT)
      this.$block.right = this.$root.find(Selector.BLOCK_RIGHT)
      this.$select = {}
      this.$select.left = this.$block.left.find('select')
      this.$select.right = this.$block.right.find('select')

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
      let _class = this

      this.$block.left.append(Template('LEFT_BUTTONS', {
        className: {
          right: this._getNameFromClass(Selector.TRANSFER_TO_RIGHT),
          left: this._getNameFromClass(Selector.TRANSFER_TO_LEFT)
        }
      }))

      this.$block.right.append(Template('RIGHT_BUTTONS', {
        className: {
          up: this._getNameFromClass(Selector.SORT_UP),
          down: this._getNameFromClass(Selector.SORT_DOWN)
        }
      }))

      this.$select.left.add(this.$select.right).each(function () {
        let maxOptions = $(this).data('maxOptions')
        if (maxOptions) {
          $(this).attr({'data-max-options-text': `最多选择${maxOptions}项`})
        }

        $(this).on('changed.bs.select', function (event) {
          let oppositeDirection
          if ($(event.target).closest(Selector.BLOCK_LEFT).length) oppositeDirection = 'right'
          else if ($(event.target).closest(Selector.BLOCK_RIGHT).length) oppositeDirection = 'left'
          _class.$select[oppositeDirection].find('option').prop({'selected': false})
          _class._refreshSelect()
        })
      })

      this._refreshSelect()
    }

    transferItems (element, direction) {
      let directionSideMap = {
        right: {from: 'left', to: 'right'},
        left: {from: 'right', to: 'left'},
        up: {from: 'right', to: 'right'},
        down: {from: 'right', to: 'right'},
      }
      let $selectFrom = this.$select[directionSideMap[direction].from]
      let $selectTo = this.$select[directionSideMap[direction].to]
      let $selectItems = $selectFrom.find('option:selected')

      switch (direction) {
        case 'right':
        case 'left':
          $selectTo.append($selectItems)
          break
        case 'up':
          $selectItems.each(function () {
            let len = $selectTo.find('option').length
            let index = $(this).index()

            if (index) {
              let $prevOption = $selectTo.find('option').eq(index - 1)
              if (!$prevOption.is(':selected')) {
                $prevOption.before($(this))
              }
            }
          })
          break
        case 'down':
          $selectItems = $selectItems.reverse()
          $selectItems.each(function () {
            let len = $selectTo.find('option').length
            let index = $(this).index()

            if (index < len - 1) {
              let $nextOption = $selectTo.find('option').eq(index + 1)
              if (!$nextOption.is(':selected')) {
                $nextOption.after($(this))
              }
            }
          })
          break
      }

      this._refreshSelect()
    }

    val () {
      let val = []
      this.$select.right.find('option').each(function () {
        val.push($(this).attr('value'))
      })
      return val
    }

    deselectAll () {
      this.$select.left.add(this.$select.right).selectpicker('deselectAll')
    }

    // private

    _getConfig (config) {
      config = $.extend({}, Default, config)
      return config
    }

    _getNameFromClass (className) {
      className = className.replace(/\./g, '')
      return className
    }

    _refreshSelect () {
      this.$select.left.add(this.$select.right).each(function () {
        $(this).selectpicker('refresh')
      })
    }

    // static

    static _jQueryInterface (config) {
      let funcResult

      let defaultResult = this.each(function () {
        let data = $(this).data(DATA_KEY)
        let _config = $.extend(
          {},
          Transfer.Default,
          $(this).data(),
          typeof config === 'object' && config
        )

        if (!data) {
          data = new Transfer(this, _config)
          $(this).data(DATA_KEY, data)
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

    static _transferBtnClickHandler (direction, event) {
      let target = $(this).closest(Selector.DATA_TRANSFER)[0]
      if (!$(target).length) return

      let config = $.extend({}, $(target).data())
      Transfer._jQueryInterface.call($(target), config)

      $(target).data(DATA_KEY).transferItems(this, direction)
    }
  }

  /**
   * Data Api
   */

  $(document)
    .on(Event.CLICK_DATA_API, Selector.TRANSFER_TO_RIGHT, function (event) {
      Transfer._transferBtnClickHandler.call(this, 'right', event)
    })
    .on(Event.CLICK_DATA_API, Selector.TRANSFER_TO_LEFT, function (event) {
      Transfer._transferBtnClickHandler.call(this, 'left', event)
    })
    .on(Event.CLICK_DATA_API, Selector.SORT_UP, function (event) {
      Transfer._transferBtnClickHandler.call(this, 'up', event)
    })
    .on(Event.CLICK_DATA_API, Selector.SORT_DOWN, function (event) {
      Transfer._transferBtnClickHandler.call(this, 'down', event)
    })

  $(window).on(Event.LOAD_DATA_API, () => {
    $(Selector.DATA_TRANSFER).each(function () {
      let $transfer = $(this)

      Transfer._jQueryInterface.call($transfer, $transfer.data())
    })
  })

  /**
   * jQuery
   */

  $.fn[NAME] = Transfer._jQueryInterface
  $.fn[NAME].Constructor = Transfer
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Transfer._jQueryInterface
  }

  return Transfer

})(jQuery)
