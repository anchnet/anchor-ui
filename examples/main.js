import { headerTemplate } from './template'
import headerData from './js/model/header'
import index from './js/src/index'

document.getElementById('header').innerHTML = headerTemplate(headerData)