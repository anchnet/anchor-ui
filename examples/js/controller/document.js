import { Header, Footer } from 'examples/template'
import { Main } from 'examples/template/pages/document'
import Document from 'examples/js/src/document'

document.getElementById('header').innerHTML = Header()
document.getElementById('footer').innerHTML = Footer()

document.getElementById('main').innerHTML = Main()