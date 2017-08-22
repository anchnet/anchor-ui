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
    CLICK_DATA_API: `click${EVENT_KEY}${DATA_API_KEY}`
  }

  const Selector = {
    DATA_TABLE: '[data-toggle="table"]',
    TABLE_CONFIG: '.table-config'
  }

  const Template = (id, options = {}) => {
    const Templates = {
      TABLE_CONFIG: `
        <th style="width: 36px;">
          <span class="${options.className} glyphicon glyphicon-cog" data-toggle="modal" data-target="#${options.modalId}"></span>
        </th>
      `,
      TABLE_ROW_SELECT: `
        <td>
          <input type="checkbox"/>
        </td>
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
                内容
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary">确定</button>
              </div>
            </div>
          </div>
        </div>
      `
    }
    return Templates[id]
  }

  /**
   * Class Definition
   */

  class Table {
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
      let $table = this.$root.find('table')
      let $thead = $table.find('thead')
      let $tbody = $table.find('tbody')
      let modalId =  `tableConfigModal-${Math.random().toString(36).substr(2)}`

      this.$root.append(Template('TABLE_CONFIG_MODAL', {modalId}))
      $thead.find('tr').prepend(Template('TABLE_CONFIG', {
        className: this._getNameFromClass(Selector.TABLE_CONFIG),
        modalId
      }))
      $tbody.find('tr').prepend(Template('TABLE_ROW_SELECT'))
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

    // static

    static _jQueryInterface (config) {
      return this.each(function () {
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
      })
    }
  }

  /**
   * Data Api
   */

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
