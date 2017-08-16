import { Main } from 'examples/template/pages/layout'

let data = {
  menus: [
    {
      title: '菜单组A',
      children: [
        {
          title: '菜单组A1',
          children: [
            {title: '菜单项A11', link: '/'},
            {title: '菜单项A12', link: '/'},
          ]
        },
        {title: '菜单项A2', link: '/'},
      ]
    },
    {
      title: '菜单组B',
      children: [
        {title: '菜单项B1', link: '/'},
        {title: '菜单项B2', link: '/'},
      ]
    }
  ]
}

document.getElementById('main').innerHTML = Main(data)
