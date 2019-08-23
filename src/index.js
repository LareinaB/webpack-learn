// 加载全局变量 会先将该模块加载出来 然后将模块导出的对象挂载到window下面
// 在其他页面使用的时候window.$就可以
let $ = require('expose-loader?$!jquery');

console.log('hello');
document.getElementById('app').innerHTML = 'javascript';

// CSS不是JS模块所以需要转换 loader工具
require('./index.css');