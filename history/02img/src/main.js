require('../../first/src/index.css');
// 会返回一个打包后的地址
let src = require('../img/avator.png');
let img = new Image;
img.src = src;
document.body.appendChild(img);