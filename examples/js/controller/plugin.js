import { Header, Footer } from 'examples/template'
import { Main } from 'examples/template/pages/plugin'
import plugin from 'examples/js/src/plugin'

document.getElementById('header').innerHTML = Header()
document.getElementById('footer').innerHTML = Footer()

document.getElementById('main').innerHTML = Main()