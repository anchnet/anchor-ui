import { Header, Footer } from 'examples/template'
import { Main } from 'examples/template/pages/home'

document.getElementById('header').innerHTML = Header()
document.getElementById('footer').innerHTML = Footer()
document.getElementById('main').innerHTML = Main()