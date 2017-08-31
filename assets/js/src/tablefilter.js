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
    TABLEFILTER_BLOCK: '.tablefilter-block',
    TABLEFILTER_BOTTOM: '.tablefilter-bottom',
    SHOW_TABLEFILTER: '.show-tablefilter'
  }

  const FieldTypeData = [
    {
      typeId: 'keyword',
      operators: ['EQUALS'],
      formType: 'text'
    },
    {
      typeId: 'string',
      operators: [
        'EQUALS', 'NOT_EQUALS', 'LT_AND_EQUALS', 'GT_AND_EQUALS',
        'LT', 'GT', 'STARTSWITH', 'ENDSWITH',
        'LIKE', 'NOTLIKE', 'ISEMPTY', 'ISNOTEMPTY',
        'IN', 'NOT_IN', 'EMPTYSTRING', 'BETWEEN',
        'SAMEAS', 'NSAMEAS'
      ],
      formType: 'text'
    },
    {
      typeId: 'date',
      operators: [
        'EQUALS', 'NOT_EQUALS', 'LT_AND_EQUALS', 'GT_AND_EQUALS',
        'LT', 'GT', 'ISEMPTY', 'ISNOTEMPTY',
        'BETWEEN', 'SAMEAS', 'NSAMEAS'
      ],
      formType: 'datetime'
    },
  ]

  const OperatorData = [
    {text: '等于 =', operator: 'EQUALS'},
    {text: '不等于 !=', operator: 'NOT_EQUALS'},
    {text: '小于等于 <=', operator: 'LT_AND_EQUALS'},
    {text: '大于等于 >=', operator: 'GT_AND_EQUALS'},
    {text: '小于 <', operator: 'LT'},
    {text: '大于 >', operator: 'GT'},
    {text: '以 X 字符开始', operator: 'STARTSWITH'},
    {text: '以 X 字符结束', operator: 'ENDSWITH'},
    {text: '含有', operator: 'LIKE'},
    {text: '不含有', operator: 'NOTLIKE'},
    {text: '为 NULL', operator: 'ISEMPTY'},
    {text: '非 NULL', operator: 'ISNOTEMPTY'},
    {text: '在数组中', operator: 'IN'},
    {text: '不在数组中', operator: 'NOT_IN'},
    {text: '空字符串', operator: 'EMPTYSTRING'},
    {text: '在 X 与 Y 之间', operator: 'BETWEEN'},
    {text: '与 X 字段相同', operator: 'SAMEAS'},
    {text: '与 X 字段不相同', operator: 'NSAMEAS'},
    {text: '大于 X 字段', operator: 'GT_FIELD'},
    {text: '小于 X 字段', operator: 'LT_FIELD'},
    {text: '大于等于 X 字段', operator: 'GT_OR_EQUALS_FIELD'},
    {text: '小于等于 X 字段', operator: 'LT_OR_EQUALS_FIELD'}
  ]

  const Template = (id, options = {}) => {
    let templates = {
      BODY: `
        <div class="${TableFilter._getNameFromClass(Selector.TABLEFILTER_BODY)}"></div>
      `,
      BOTTOM: `
        <div class="${TableFilter._getNameFromClass(Selector.TABLEFILTER_BOTTOM)}">
          <button type="button" class="btn btn-primary-base-border" data-action="and">AND</button><!--
          --><button type="button" class="btn btn-primary-base-border" data-action="or">OR</button><!--
          --><button type="button" class="btn btn-primary-base-border" data-action="search">搜索</button>
        </div>
      `,
      BLOCK: `
        <div class="${TableFilter._getNameFromClass(Selector.TABLEFILTER_BLOCK)}">
          ${options.text}
          <div class="tablefilter-rows"></div>
        </div>
      `,
      ROW: `
        <div class="tablefilter-row"></div>
      `,
      SECTION_FIELD: `
        <span class="tablefilter-row-section field-section">
          <select class="select-field selectpicker" title="请选择字段">${options.options}</select>
        </span>
      `,
      SECTION_OPERATOR: `
        <span class="tablefilter-row-section operator-section">
          <select class="select-operator selectpicker" title="关系" disabled></select>
        </span>
      `,
      SECTION_VALUE: `
        <span class="tablefilter-row-section value-section">
          <input class="input-value form-control" placeholder="值" disabled/>
        </span>
      `,
      SECTION_BUTTON: `
        <span class="tablefilter-row-section btn-section">
          <button type="button" class="btn btn-default hide" data-action="and">and</button>
          <button type="button" class="btn btn-default hide" data-action="or">or</button>
          <button type="button" class="btn btn-default hide" data-action="delete">×</button>
        </span>
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
      this.$root.addClass(`${TableFilter._getNameFromClass(Selector.TABLEFILTER_WRAPPER)} form-inline`)
      this.$root
        .append(Template('BODY'))
        .append(Template('BOTTOM'))

      this.$body = this.$root.find(Selector.TABLEFILTER_BODY)
      this.$bottom = this.$root.find(Selector.TABLEFILTER_BOTTOM)

      this.getFieldsOptions()
      this.addBlock()
      this.addRow()
    }

    getFieldsOptions () {
      let $fieldsOptions = this.$root.find(Selector.DATA_FIELDS).children()

      this.fieldsOptions = $('<div>').append($fieldsOptions).html()
    }

    addBlock () {
      let text = this._getCurrentBlocksNum() ? `<div class="tablefilter-block-text">OR</div>` : ``

      let block = Template('BLOCK', {text})
      let $block = $(block)

      this.$body.append($block)
    }

    deleteBlock (index) {
      let $block = this.$body.find(Selector.TABLEFILTER_BLOCK).eq(index)

      $block.remove()
    }

    addRow (options = {}) {
      options = {
        blockIndex: 0,
        rowIndex: -1,
        type: 'and',
        ...options
      }

      let $block = this.$body.find(Selector.TABLEFILTER_BLOCK).eq(options.blockIndex)
      let row = Template('ROW')
      let $row = $(row)
      let section = {
        field: Template('SECTION_FIELD', {
          options: this.fieldsOptions
        }),
        operator: Template('SECTION_OPERATOR'),
        value: Template('SECTION_VALUE'),
        btn: Template('SECTION_BUTTON')
      }

      switch (options.type) {
        case 'and':
          section.type = ''
          break

        case 'or':
          section.type = '<span class="row-type">or</span>'
          break
      }

      $row
        .append(section.type)
        .append(section.field)
        .append(section.operator)
        .append(section.value)
        .append(section.btn)

      $row.find('select.select-field').on('changed.bs.select', (event) => {
        let type = $(event.target).find('option:selected').data('type')
        let operators = FieldTypeData.find((item) => item.typeId === type).operators
        let $selectOperator = $row.find('select.select-operator')
        let $btns = $row.find('.btn-section .btn')

        $selectOperator.empty()
        $selectOperator.prop('disabled', false)
        $btns.removeClass('hide')

        {
          let i = 0

          operators.forEach((operator) => {
            let data = OperatorData.find((opt) => opt.operator === operator)
            let option = `<option value="${data.operator}">${data.text}</option>`
            let $option = $(option)
            if (!i) $option.attr('selected', 'selected')

            $selectOperator.append($option)

            i ++
          })
        }

        $btns.on('click', (event) => {
          let action = $(event.target).data('action')
          let $block = $(event.target).closest(Selector.TABLEFILTER_BLOCK)
          let $row = $(event.target).closest('.tablefilter-row')
          let blockIndex = $block.index()
          let rowIndex = $row.index()

          switch (action) {
            case 'and':
              this.addRow({blockIndex})
              break

            case 'or':
              this.addRow({
                blockIndex,
                rowIndex: rowIndex + 1,
                type: 'or'
              })
              break

            case 'delete':
              this.deleteRow({blockIndex, rowIndex})
              break
          }
        })

        $row.find('select.select-operator').trigger('changed.bs.select')
        this._refreshFormEl()
      })

      $row.find('select.select-operator').on('changed.bs.select', (event) => {
        let operator = $(event.target).selectpicker('val')
        let type = $row.find('select.select-field option:selected').data('type')
        let formType = FieldTypeData.find((item) => item.typeId === type).formType
        let $inputValue = $row.find('input.input-value')

        $inputValue.prop('disabled', false)

        this.renderValueSection($row, operator, formType)
        this._refreshFormEl()
      })

      if (options.rowIndex === -1) $block.find('.tablefilter-rows').append($row)
      else {
        let $el = $block.find('.tablefilter-row').eq(options.rowIndex)
        if ($el.length) $el.before($row)
        else $block.find('.tablefilter-rows').append($row)
      }
      this._refreshFormEl()
    }

    deleteRow (options = {}) {
      if ([options.blockIndex, options.rowIndex].includes(undefined)) return

      let $block = this.$body.find(Selector.TABLEFILTER_BLOCK).eq(options.blockIndex)
      let $row = $block.find('.tablefilter-row').eq(options.rowIndex)

      $row.remove()

      if (!$block.find('.tablefilter-row').length) this.deleteBlock(options.blockIndex)
    }

    renderValueSection ($row, operator, formType) {
      let group = {
        zeroInput: [
          'ISEMPTY', 'ISNOTEMPTY', 'EMPTYSTRING'
        ],
        oneInput: [
          'EQUALS', 'NOT_EQUALS', 'LT_AND_EQUALS', 'GT_AND_EQUALS',
          'LT', 'GT', 'STARTSWITH', 'ENDSWITH',
          'LIKE', 'NOTLIKE'
        ],
        twoInput: [
          'BETWEEN'
        ],
        tagsInput: [
          'IN', 'NOT_IN'
        ],
        selectField: [
          'SAMEAS', 'NSAMEAS', 'GT_FIELD', 'LT_FIELD',
          'GT_OR_EQUALS_FIELD', 'LT_OR_EQUALS_FIELD'
        ]
      }
      let formElMap = {
        text: `<input class="form-control"/>`,
        datetime: `<input class="form-control datetimepicker"/>`
      }
      let formEl = formElMap[formType]
      let $section = $row.find('.value-section')

      $section.empty()

      if (group.zeroInput.includes(operator)) {}
      else if (group.oneInput.includes(operator)) {
        $section.append(formEl)
      } else if (group.twoInput.includes(operator)) {
        $section.append(new Array(2).fill(formEl).join(' 与 '))
      } else if (group.tagsInput.includes(operator)) {
        let input = `<input class="form-control tagsinput"/>`

        $section.append(input)
      } else if (group.selectField.includes(operator)) {
        let select = `<select class="selectpicker"></select>`
        let $select = $(select)

        $select.append(this.fieldsOptions)
        $section.append($select)
      }
    }

    actionBtnClick (element) {
      let action = $(element).data('action')

      switch (action) {
        case 'and':
          this.addRow()
          break
        case 'or':
          this.addBlock()
          this.addRow({
            blockIndex: this._getCurrentBlocksNum() - 1
          })
          break
        case 'search':
          break
      }
    }

    toggle () {
      this.$root.toggleClass(TableFilter._getNameFromClass(Selector.SHOW_TABLEFILTER))
    }

    // private

    _getConfig (config) {
      config = $.extend({}, Default, config)
      return config
    }

    _getCurrentBlocksNum () {
      let $blocks = this.$body.find(Selector.TABLEFILTER_BLOCK)
      return $blocks.length
    }

    _getCurrentRowsNum (blockIndex) {
      let $block = this.$body.find(Selector.TABLEFILTER_BLOCK).eq(blockIndex)
      let $rows = $block.find('.tablefilter-row')
      return $rows.length
    }

    _refreshFormEl () {
      this.$body
        .find('.selectpicker').selectpicker('refresh')
        .end().find('.datetimepicker').datetimepicker({
          locale: 'zh-cn'
        })
        .end().find('.tagsinput').tagsinput()
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

    static _actionBtnClickHandler (event) {
      let target = $(event.target).closest(Selector.DATA_TABLEFILTER)[0]
      if (!$(target).length) return

      let config = $.extend({}, $(target).data())
      TableFilter._jQueryInterface.call($(target), config)

      $(target).data(DATA_KEY).actionBtnClick(event.target)
    }
  }

  /**
   * Data Api
   */

  $(document).on(Event.CLICK_DATA_API, `${Selector.TABLEFILTER_BOTTOM} [data-action]`, TableFilter._actionBtnClickHandler)

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
