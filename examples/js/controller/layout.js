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
          ]
        },
        {
          title: '菜单项A2',
          children: [
            {title: '菜单项A21', link: '/'},
            {title: '菜单项A22', link: '/'},
          ]
        },
        {
          title: '菜单项A3',
          children: [
            {title: '菜单项A31', link: '/'},
            {title: '菜单项A32', link: '/'},
            {title: '菜单项A32', link: '/'},
          ]
        },
        {title: '菜单项A4', link: '/'},
        {title: '菜单项A5', link: '/'},
        {title: '菜单项A6', link: '/'},
        {title: '菜单项A7', link: '/'},
        {title: '菜单项A8', link: '/'},
        {title: '菜单项A9', link: '/'},
        {title: '菜单项A10', link: '/'},
      ]
    },
    {
      title: '菜单组B',
      children: [
        {title: '菜单项B1', link: '/'},
      ]
    }
  ]
}

document.getElementById('main').innerHTML = Main(data)
