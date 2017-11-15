const Utils = (($) => {

  let CLICKED = false

  class _Utils {

    clone (obj = null) {
      return obj ? JSON.parse(JSON.stringify(obj)) : null
    }

    /* 判断变量数据类型 */
    // 已验证通过的变量类型及判断结果：
    // undefined => "undefined", null => "null", true => "true", string => "string",
    // 1234 => "number", [] => "array", {} => "object", ()=>{} => "function",
    // new Map() => "map", new Set() => "Set", new Error() => "error", Math => "math",
    // NaN => "NaN", Infinity => "Infinity"
    getDataType (variable) {
      if (Number.isNaN(variable)) return "NaN"
      if (typeof variable === "number" && !Number.isFinite(variable)) return "Infinity"
      if (variable === null) return String(variable)
      else if (typeof variable !== "object") return typeof variable
      else return Object.prototype.toString.call(variable).toLowerCase().match(/\[\s*object\s*([^\]]*)\s*\]/)[1]
    }

    // 平滑滚动效果
    smoothScroll (scrollElement = $('html, body'), scrollTop, time = 800) {
      try {
        if (!scrollElement) {
          throw 'The scrollElement is not belongs of jquery.'
        }
        CLICKED = true
        scrollElement.animate({scrollTop: scrollTop + 'px'}, time)
        setTimeout(() => {
          CLICKED = false
        }, 50)
      } catch (e) {
        console.error("Error: ", e)
      }
    }

    // 滚动到底部
    scrollToBottom (container, openWatch = false, baseWatch = 300) {
      const $container = $(container)
      const $children = $container.children('*:first-child')
      const parentHeight = $container.height() || 0
      const childHeight = $children.height() || 0
      const scrollTop = childHeight - parentHeight
      const oldScrollTop = $container.scrollTop()
      if (openWatch && scrollTop - oldScrollTop > baseWatch) return
      if (scrollTop !== oldScrollTop) {
        this.smoothScroll($container, scrollTop, 300)
      }
    }

    // 将参数解析为 Object
    parseQueryToObj (data = window.location.search, {action = null, attr = null, value = null} = {}) {
      let urlArray, tempObj = {}
      if (!data) urlArray = []
      else if (data.charAt(0) === "?") urlArray = data.slice(1).split("&")
      else urlArray = data.split("&")
      urlArray.forEach((item, key) => {
        const array = item.split("=")
        tempObj[array[0]] = array[1]
      })

      tempObj = this.handlerObj(tempObj, {action, attr, value})

      return tempObj
    }

    // 将 Object 格式化为参数
    stringfyObjToQuery (obj = {}, {action = null, attr = null, value = null} = {}) {
      let str = ''

      obj = this.handlerObj(obj, {action, attr, value})

      Object.entries(obj).forEach((arr, key) => {
        const query = `${arr[0]}=${arr[1]}`
        str += key === 0 ? query : `&${query}`
      })

      return str
    }

    handlerObj (obj = {}, {action = null, attr = null, value = null} = {}) {
      let newObj = this.clone(obj)
      const attrType = this.getDataType(attr)

      if (attrType === 'string') {
        if (['add', 'update'].includes(action)) {
          newObj[attr] = value
        } else if (action === 'delete') {
          delete newObj[attr]
        }
      } else if (attrType === 'object') {
        newObj = Object.assign({}, newObj, attr)
      }

      return newObj
    }

  }

  return _Utils
})(jQuery)

const utils = (() => new Utils())()

export default utils