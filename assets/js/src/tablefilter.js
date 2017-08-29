/**
 * tablefilter
 */

const TableFilter = (($) => {

  /**
   * Constants
   */

  const NAME = 'tablefilter'
  const VERSION = '1.0.0-beta'
  const DATA_KEY = 'anchor.tablefilter'
  const EVENT_KEY = `.${DATA_KEY}`
  const DATA_API_KEY = '.data-api'
  const JQUERY_NO_CONFLICT = $.fn[NAME]

  const Default = {}

  const Event = {
    LOAD_DATA_API: `load${EVENT_KEY}${DATA_API_KEY}`,
    CLICK_DATA_API: `click${EVENT_KEY}${DATA_API_KEY}`
  }

  const Selector = {
    DATA_TABLEFILTER: '[data-toggle="tablefilter"]',
    DATA_FIELDS: '[data-for="fields"]',
    TABLEFILTER_WRAPPER: '.tablefilter-wrapper',
    TABLEFILTER_BODY: '.tablefilter-body',
    TABLEFILTER_BOTTOM: '.tablefilter-bottom',
    SHOW_TABLEFILTER: '.show-tablefilter'
  }

  const Template = (id, options = {}) => {
    let templates = {
      ROW: `
        <div class="tablefilter-row"></div>
      `,
      FIELD_SECTION: `
        <span class="tablefilter-row-section field-section">
          <select class="field-select selectpicker" title="请选择字段">${options.options}</select>
        </span>
      `,
      OPERATOR_SECTION: `
        <span class="tablefilter-row-section operator-section">
          <select class="operator-select selectpicker" title="关系" disabled></select>
        </span>
      `,
      VALUE_SECTION: `
        <span class="tablefilter-row-section value-section">
          <input class="value-select form-control" placeholder="值" disabled/>
        </span>
      `,
      BODY: `
        <div class="${TableFilter._getNameFromClass(Selector.TABLEFILTER_BODY)}"></div>
      `,
      BOTTOM: `
        <div class="${TableFilter._getNameFromClass(Selector.TABLEFILTER_BOTTOM)}">
          <button type="button" class="btn btn-primary-base-border">AND</button><!--
          --><button type="button" class="btn btn-primary-base-border">OR</button><!--
          --><button type="button" class="btn btn-primary-base-border">搜索</button>
        </div>
      `
    }
    return templates[id]
  }

  /**
   * Class Definition
   */

  class TableFilter {
    constructor (root, config) {
      this._config = this._getConfig(config)
      this.$root = $(root)
      this.$body = null
      this.$bottom = null
      this.fieldsOptions = null

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
      this.$root.addClass(TableFilter._getNameFromClass(Selector.TABLEFILTER_WRAPPER))
      this.$root
        .append(Template('BODY'))
        .append(Template('BOTTOM'))

      this.$body = this.$root.find(Selector.TABLEFILTER_BODY)
      this.$bottom = this.$root.find(Selector.TABLEFILTER_BOTTOM)

      this.getFieldsOptions()
      this.addRow()
    }

    getFieldsOptions () {
      this.fieldsOptions = this.$root.find(Selector.DATA_FIELDS).html()
    }

    addRow () {
      let row = Template('ROW')
      let $row = $(row)
      let section = {
        field: Template('FIELD_SECTION', {
          options: this.fieldsOptions
        }),
        operator: Template('OPERATOR_SECTION'),
        value: Template('VALUE_SECTION')
      }

      $row
        .append(section.field)
        .append(section.operator)
        .append(section.value)

      this.$body.append($row)
      this._refreshSelect()
    }

    toggle () {
      this.$root.toggleClass(TableFilter._getNameFromClass(Selector.SHOW_TABLEFILTER))
    }

    // private

    _getConfig (config) {
      config = $.extend({}, Default, config)
      return config
    }

    _refreshSelect () {
      this.$body.find('.selectpicker').selectpicker('refresh')
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
          TableFilter.Default,
          $(el).data(),
          typeof config === 'object' && config
        )

        if (!data) {
          data = new TableFilter(el, _config)
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
  }

  /**
   * Data Api
   */

  $(window).on(Event.LOAD_DATA_API, () => {
    $(Selector.DATA_TABLEFILTER).each((i, el) => {
      let $tablefilter = $(el)

      TableFilter._jQueryInterface.call($tablefilter, $tablefilter.data())
    })
  })

  /**
   * jQuery
   */

  $.fn[NAME] = TableFilter._jQueryInterface
  $.fn[NAME].Constructor = TableFilter
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return TableFilter._jQueryInterface
  }

  return TableFilter

})(jQuery)
