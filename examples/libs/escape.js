export default {
  encode (str) {
    let s = ''
    if (str.length == 0) return ''
    s = str.replace(/&gt;/g, '>')
    s = s.replace(/&lt;/g, '<')
    s = s.replace(/&#x27;/g, "'")
    s = s.replace(/&quot;/g, '"')
    s = s.replace(/\n/g, '<br/>')
    s = s.replace(/^<br\/?>|<br\/?>$/g, '')
    return s
  },

  decode (str) {
    let s = ''
    if (str.length == 0) return ''
    s = str.replace(/>/g, '&gt;')
    s = s.replace(/</g, '&lt;')
    s = s.replace(/'/g, '&#x27;')
    s = s.replace(/"/g, '&quot;')
    s = s.replace(/<br\/?>/g, '\n')
    s = s.replace(/^\n+|\n+$/g, '')
    return s
  }
}
