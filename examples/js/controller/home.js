import { Header, Footer } from '../../template'
import { Main } from '../../template/pages/home'
import home from '../src/home'

document.getElementById('header').innerHTML = Header()
document.getElementById('footer').innerHTML = Footer()
document.getElementById('main').innerHTML = Main()