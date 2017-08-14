import { Header, Footer } from '../../template'
import { Main } from '../../template/pages/document'
import Document from '../../js/src/document'

document.getElementById('header').innerHTML = Header()
document.getElementById('footer').innerHTML = Footer()

document.getElementById('main').innerHTML = Main()