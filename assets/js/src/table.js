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
    TABLE_WRAPPER: '.table-wrapper',
    TABLE_BOTTOM: '.table-bottom',
    CELL_HIDE: '.cell-hide',
    CHECK_ROW: '.check-row',
    CHECK_ALL: '.check-all',
    CHECK_LABEL: '.checkbox-label'
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
        <div class="checkbox-wrapper">
          <label class="${Table._getNameFromClass(Selector.CHECK_LABEL)}">
            <input class="${Table._getNameFromClass(Selector.CHECK_ROW)}" type="checkbox"/>
          </label>
        </div>
        </td>
      `,
      TABLE_ALL_CHECKBOX: `
        <span class="check-all-wrapper">
          <label class="${Table._getNameFromClass(Selector.CHECK_LABEL)}">
            <input class="${Table._getNameFromClass(Selector.CHECK_ALL)}" type="checkbox"/>
          </label>
        </span>
      `,
      TABLE_CONFIG_MODAL: `
        <div class="modal fade" id="${options.modalId}" tabindex="-1" role="dialog">
          <div class="modal-dialog modal-rlg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">表格设置</h4>
              </div>
              <div class="modal-body">
                <div data-toggle="transfer">
                  <div class="transfer-left">
                    <div>可选</div>
                    <select multiple="multiple">${options.leftOptions}</select>
                  </div>
                  <div class="transfer-right">
                    <div>已选</div>
                    <select multiple="multiple">${options.rightOptions}</select>
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
      let modalId = `tableConfigModal-${Math.random().toString(36).substr(2)}`
      let modalSelector = `#${modalId}`
      let options = []

      this.$thead.find('th').each((i, el) => {
        let text = $(el).data('text') || $(el).text()
        let value = $(el).data('value') || text

        options.push(Template('SELECT_OPTION', {text, value}))
      })

      this.$root.addClass(Table._getNameFromClass(Selector.TABLE_WRAPPER))
      this.$table.wrap('<div class="table-element-wrapper"></div>')
      this.$thead.find('tr').prepend(Template('TABLE_CONFIG', {modalId}))
      this.$tbody.find('tr').prepend(Template('TABLE_ROW_CHECKBOX'))
      this.$bottom.prepend(Template('TABLE_ALL_CHECKBOX'))
      this.$root.append(Template('TABLE_CONFIG_MODAL', {
        modalId,
        leftOptions: this.$root.find(Selector.DATA_TRANSFER_SELECT).html(),
        rightOptions: options.join('')
      }))

      this.$root.find(Selector.DATA_TRANSFER).transfer()

      this.$root.find(`${modalSelector} .submit-btn`).on('click', () => {
        this.$root.find(modalSelector).modal('hide')

        let data = this.$root.find(Selector.DATA_TRANSFER).transfer('val')
        this.$root.trigger(Event.FILTER_CHANGED, {data})
      })

      this.$root.find(modalSelector).on('hidden.bs.modal', () => {
        this.$root.find(Selector.DATA_TRANSFER).transfer('deselectAll')
      })

      if (!$('<div>').append(this.$root.clone()).find(Selector.DATA_TABLE).length) {
        this.$root.attr('data-toggle', 'table')
      }

      this.$root.addClass('table-component-inited')
    }

    checkItems (element, type) {
      let checkData = JSON.parse(JSON.stringify(this.checkData))
      let len = this.$tbody.find('tr').length
      let $checkboxLabel = $(Selector.CHECK_LABEL)
      let activeClass = 'active'

      switch (type) {
        case 'row':
          let index = $(element).closest('tr').index(),
              $checkboxRow = $(element).closest(Selector.CHECK_LABEL)

          if (checkData.includes(index)) {
            checkData.splice(checkData.indexOf(index), 1)
            $checkboxRow.removeClass(activeClass)
          } else {
            checkData.push(index)
            $checkboxRow.addClass(activeClass)
          }
          break

        case 'all':
          let checked = $(element).is(':checked')

          checkData = []

          if (checked) {
            for (let i = 0; i < len; i++) {
              checkData.push(i)
            }
            $checkboxLabel.addClass(activeClass)
          }else {
            $checkboxLabel.removeClass(activeClass)
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
          $checkboxLabel.removeClass(activeClass)
          break

        case len:
          this
            .$root
            .find(Selector.CHECK_ROW)
            .add(this.$root.find(Selector.CHECK_ALL))
            .prop('checked', true)
          $checkboxLabel.addClass(activeClass)
          break

        default:
          this.$root.find(Selector.CHECK_ALL).prop('checked', false)
          $(Selector.CHECK_ALL).parent(Selector.CHECK_LABEL).removeClass(activeClass)
      }

      this.checkData = checkData
    }

    selected () {
      let selected = this.checkData.map((index) => {
        let data = this.$tbody.find('tr').eq(index).data('id') || index
        return data
      })

      return selected
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
          Table.Default,
          typeof config === 'object' && config
        )

        if (!data) {
          data = new Table(el, _config)
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

    static _checkHandler (event) {
      let target = $(event.target).closest(Selector.DATA_TABLE)[0]
      if (!$(target).length) return

      let config = $.extend({}, $(target).data())
      Table._jQueryInterface.call($(target), config)

      $(target).data(DATA_KEY).checkItems(event.target, event.data.type)
    }
  }

  /**
   * Data Api
   */

  $(document)
    .on(Event.CHANGE_DATA_API, Selector.CHECK_ROW, {type: 'row'}, Table._checkHandler)
    .on(Event.CHANGE_DATA_API, Selector.CHECK_ALL, {type: 'all'}, Table._checkHandler)

  $(document).ready(() => {
    $(Selector.DATA_TABLE).each((i, el) => {
      let $table = $(el)

      Table._jQueryInterface.call($table, $table.data())
    })
  })

  /**
   * jQuery
   */

  $.fn[NAME] = Table._jQueryInterface
  $.fn[NAME].Constructor = Table
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Table._jQueryInterface
  }

  return Table

})(jQuery)

export default Table
