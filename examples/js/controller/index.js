import { Header, Footer } from 'examples/template'
import { Main } from 'examples/template/pages/home'
import index from 'examples/js/src/index'

document.getElementById('header').innerHTML = Header()
document.getElementById('footer').innerHTML = Footer()
document.getElementById('main').innerHTML = Main()