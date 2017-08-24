/**
 * table
 */

const Table =(($) => {

  /**
   * Constants
   */

  const NAME = 'table'
  const VERSION = '1.0.0-beta'
  const DATA_KEY = 'anchor.table'
  const EVENT_KEY = `.${DATA_KEY}`
  const DATA_API_KEY = '.data-api'
  const JQUERY_NO_CONFLICT = $.fn[NAME]

  const Default = {}

  const Event = {
    LOAD_DATA_API: `load${EVENT_KEY}${DATA_API_KEY}`,
    CLICK_DATA_API: `click${EVENT_KEY}${DATA_API_KEY}`,
    CHANGE_DATA_API: `change${EVENT_KEY}${DATA_API_KEY}`,
    FILTER_CHANGED: `filter.changed${EVENT_KEY}`
  }

  const Selector = {
    DATA_TABLE: '[data-toggle="table"]',
    DATA_TRANSFER: '[data-toggle="transfer"]',
    DATA_TRANSFER_SELECT: '[data-for="transfer"]',
    TABLE_BOTTOM: '.table-bottom',
    CELL_HIDE: '.cell-hide',
    CHECK_ROW: '.check-row',
    CHECK_ALL: '.check-all'
  }

  const Template = (id, options = {}) => {
    let templates = {
      TABLE_CONFIG: `
        <th class="first-column" data-renderer="plugin">
          <span class="table-config glyphicon glyphicon-cog" data-toggle="modal" data-target="#${options.modalId}"></span>
        </th>
      `,
      TABLE_ROW_CHECKBOX: `
        <td data-renderer="plugin">
          <input class="${Table._getNameFromClass(Selector.CHECK_ROW)}" type="checkbox"/>
        </td>
      `,
      TABLE_ALL_CHECKBOX: `
        <span class="check-all-wrapper">
          <input class="${Table._getNameFromClass(Selector.CHECK_ALL)}" type="checkbox"/>
        </span>
      `,
      TABLE_CONFIG_MODAL: `
        <div class="modal fade" id="${options.modalId}" tabindex="-1" role="dialog">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">表格设置</h4>
              </div>
              <div class="modal-body">
                <div class="transfer-wrapper" data-toggle="transfer">
                  <div class="transfer-left">
                    <div>可选</div>
                    <select class="selectpicker" multiple="multiple">${options.leftOptions}</select>
                  </div>
                  <div class="transfer-right">
                    <div>已选</div>
                    <select class="selectpicker" multiple="multiple">${options.rightOptions}</select>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary submit-btn">确定</button>
              </div>
            </div>
          </div>
        </div>
      `,
      SELECT_OPTION: `<option value="${options.value}">${options.text}</option>`
    }
    return templates[id]
  }

  /**
   * Class Definition
   */

  class Table {
    constructor (root, config) {
      this._config = this._getConfig(config)
      this.$root = $(root)
      this.$table = this.$root.find('table')
      this.$thead = this.$table.find('thead')
      this.$tbody = this.$table.find('tbody')
      this.$bottom = this.$root.find(Selector.TABLE_BOTTOM)
      this.checkData = []

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
      let modalId = `tableConfigModal-${Math.random().toString(36).substr(2)}`
      let modalSelector = `#${modalId}`
      let options = []

      this.$thead.find('th').each(function (index) {
        let text = $(this).data('text') || $(this).text()

        options.push(Template('SELECT_OPTION', {
          text,
          value: text
        }))
      })

      this.$thead.find('tr').prepend(Template('TABLE_CONFIG', {modalId}))
      this.$tbody.find('tr').prepend(Template('TABLE_ROW_CHECKBOX'))
      this.$bottom.prepend(Template('TABLE_ALL_CHECKBOX'))
      this.$root.append(Template('TABLE_CONFIG_MODAL', {
        modalId,
        leftOptions: this.$root.find(Selector.DATA_TRANSFER_SELECT).html(),
        rightOptions: options.join('')
      }))

      this.$root.find(Selector.DATA_TRANSFER).transfer()

      this.$root.find(`${modalSelector} .submit-btn`).on('click', function () {
        _class.$root.find(modalSelector).modal('hide')

        let data = _class.$root.find(Selector.DATA_TRANSFER).transfer('val')
        _class.$root.trigger(Event.FILTER_CHANGED, {data})
      })

      this.$root.find(modalSelector).on('hidden.bs.modal', function () {
        _class.$root.find(Selector.DATA_TRANSFER).transfer('deselectAll')
      })
    }

    checkItems (element, type) {
      let checkData = JSON.parse(JSON.stringify(this.checkData))
      let len = this.$tbody.find('tr').length

      switch (type) {
        case 'row':
          let index = $(element).closest('tr').index()

          if (checkData.includes(index)) {
            checkData.splice(checkData.indexOf(index), 1)
          } else {
            checkData.push(index)
          }
          break

        case 'all':
          let checked = $(element).is(':checked')

          if (checked) {
            for (let i = 0; i < len; i++) {
              checkData.push(i)
            }
          } else {
            checkData = []
          }
          break
      }

      checkData.sort((a, b) => a - b)

      switch (checkData.length) {
        case 0:
          this
            .$root
            .find(Selector.CHECK_ROW)
            .add(this.$root.find(Selector.CHECK_ALL))
            .prop('checked', false)
          break

        case len:
          this
            .$root
            .find(Selector.CHECK_ROW)
            .add(this.$root.find(Selector.CHECK_ALL))
            .prop('checked', true)
          break

        default:
          this.$root.find(Selector.CHECK_ALL).prop('checked', false)
      }

      this.checkData = checkData
    }

    val () {
      return this.checkData
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

      let defaultResult = this.each(function () {
        let data = $(this).data(DATA_KEY)
        let _config = $.extend(
          {},
          Table.Default,
          typeof config === 'object' && config
        )

        if (!data) {
          data = new Table(this, _config)
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

    static _checkHandler (event) {
      let target = $(this).closest(Selector.DATA_TABLE)[0]
      if (!$(target).length) return

      let config = $.extend({}, $(target).data())
      Table._jQueryInterface.call($(target), config)

      $(target).data(DATA_KEY).checkItems(this, event.data.type)
    }
  }

  /**
   * Data Api
   */

  $(document)
    .on(Event.CHANGE_DATA_API, Selector.CHECK_ROW, {type: 'row'}, Table._checkHandler)
    .on(Event.CHANGE_DATA_API, Selector.CHECK_ALL, {type: 'all'}, Table._checkHandler)

  $(window).on(Event.LOAD_DATA_API, () => {
    $(Selector.DATA_TABLE).each(function () {
      let $table = $(this)

      Table._jQueryInterface.call($table, $table.data())
    })
  })

  /**
   * jQuery
   */

  $.fn[NAME] = Table._jQueryInterface
  $.fn[NAME].Constructor = Table
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Table._jQueryInterface
  }

  return Table

})(jQuery)

export default Table
