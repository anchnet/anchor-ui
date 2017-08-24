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
    DATA_TRANSFER: '[data-toggle="transfer"]',
    CELL_HIDE: '.cell-hide'
  }

  const Template = (id, options = {}) => {
    let templates = {
      TABLE_CONFIG: `
        <th class="first-column" data-renderer="plugin">
          <span class="table-config glyphicon glyphicon-cog" data-toggle="modal" data-target="#${options.modalId}"></span>
        </th>
      `,
      TABLE_ROW_SELECT: `
        <td data-renderer="plugin">
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
      this.fields = []

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
      let options = {
        left: [],
        right: []
      }

      this.$thead.find('th').each(function (index) {
        let text = $(this).data('text') || $(this).text()
        let isShow = $(this).data('display') === 'show'
        let direction = isShow ? 'right' : 'left'

        $(this).attr({'data-field': text})
        _class.$tbody.find(`td:nth-child(${index + 1})`).attr({'data-field': text})
        _class.fields.push({isShow, text})

        options[direction].push(Template('SELECT_OPTION', {
          text,
          value: text,
        }))
      })

      this.$thead.find('tr').prepend(Template('TABLE_CONFIG', {modalId}))
      this.$tbody.find('tr').prepend(Template('TABLE_ROW_SELECT'))
      this.$root.append(Template('TABLE_CONFIG_MODAL', {
        modalId,
        leftOptions: options.left.join(''),
        rightOptions: options.right.join('')
      }))

      this._renderFields()
      this.$root.find(Selector.DATA_TRANSFER).transfer()

      this.$root.find(`${modalSelector} .submit-btn`).on('click', function () {
        _class.$root.find(modalSelector).modal('hide')

        let fieldsShow = _class.$root.find(Selector.DATA_TRANSFER).transfer('val')
        let originFields = JSON.parse(JSON.stringify(_class.fields))
        let targetFields = []

        fieldsShow.forEach((fieldShow) => {
          let index = originFields.findIndex((originField) => originField.text === fieldShow)
          let field = originFields[index]

          field.isShow = true
          targetFields.push(field)
          originFields.splice(index, 1)
        })

        originFields.forEach((field) => {
          field.isShow = false
          targetFields.push(field)
        })

        _class.fields = targetFields
        _class._renderFields()
      })

      this.$root.find(modalSelector).on('hidden.bs.modal', function () {
        _class.$root.find(Selector.DATA_TRANSFER).transfer('deselectAll')
      })
    }

    // private

    _renderFields () {
      let _class = this

      this.$table.find('tr').each(function () {
        let cells = $(this).find('[data-field]').remove()

        _class.fields.forEach((field) => {
          let cell = cells.filter(`[data-field="${field.text}"]`)
          let classHide = _class._getNameFromClass(Selector.CELL_HIDE)

          if (field.isShow) cell.removeClass(classHide)
          else cell.addClass(classHide)

          $(this).append(cell)
        })
      })
    }

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
