import 'babel-polyfill'

import '../bootstrap/javascripts/bootstrap'
import '../libs/bootstrap-select/bootstrap-select'
import '../libs/bootstrap-tagsinput/bootstrap-tagsinput'
import '../libs/bootstrap-datetimepicker/bootstrap-datetimepicker.min' // 源码（引用方式部分）有修改，更新需注意！
import '../libs/jquery.cookie/jquery.cookie'
import '../libs/jquery.fn.sortable/jquery.fn.sortable'
import './src/sidebar'
import './src/tablefilter'
import './src/transfer'
import './src/table'

import utils from './src/utils'

! function ($) {
  $.fn.reverse = [].reverse

  $.extend({
    utils: utils,
    ANCHOR_VERSION: '0.3.0'
  })
}(jQuery);

// test
console.log('========== test start =============')
const obj1 = {
  a: 1
}

const obj2 = {
  b: 2,
  ...obj1
}
console.log(obj2)

let arr1 = [0, 1, 2];
let arr2 = [3, 4, 5];

const arr3 = [...arr2, ...arr1]

console.log('arr3', arr3) // [3, 4, 5, 0, 1, 2]

// async function asyncPrint(value, ms) {
//   await  new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
//   console.log(value);
// }
// console.log('start')
// asyncPrint('hello world', 1000).then(() => {
//   console.log('done')
// })

const func1 = () => console.log('func1')
func1()

const group = ['jason', 'bob', 'nathan']
const hasNathan = group.includes('nathan')
console.log(hasNathan)

const setArr1 = Array.from(new Set([1, 1, 2, 2, 3, 4, 5]))
console.log(setArr1)

const str1 = '*'.repeat(10)
console.log(str1)

console.log('========== test end =============')
