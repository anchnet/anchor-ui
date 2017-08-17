import SourceMap from './sourceMap.json'

const options = {
  getFiles () {
    return SourceMap.files
  },

  getHtmlSource () {
    let source = []
    this.getFiles().map((name) => {

    })
  }
}

module.exports = options