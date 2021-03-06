const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
// 把页面中的CSS文件单独拉出来保存加载
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
let cssExtract = new ExtractTextWebpackPlugin('css/css.css');
let lessExtract = new ExtractTextWebpackPlugin('css/less.css');
let sassExtract = new ExtractTextWebpackPlugin('css/sass.css');


module.exports = {
    // 单入口 字符串/数组 ['./src/index.js', './src/base.js']
    // 多入口 对象 先找到每个入口 从各个入口分别出发找到依赖的模块
    // 生成一个代码块chunk，最后把代码块写到文件系统中(Assets)
    entry: './src/main.js',
    // 输出 经过一系列处理得出最终想要的代码结果
    output: {
        path: path.join(__dirname, 'dist'),
        // name是entry的名字main hash根据打包后的文件计算出来的一个hash值
        // [name].[hash].js
        filename: "[name].[hash].js"
    },
    // devtool: 'source-map' // 单独文件，可以定位错误到某一行某一列
    // devtool: 'cheap-module-source-map' // 单独文件，体积更小，但错误职能定位到行
    // devtool: 'source-map'  // 无单独文件，可以定位错误到某一行某一列
    // devtool: 'source-map'  // 无单独文件，只定位到行
    // 监控文件的变化 当源文件发生改变，则重新打包
    watch: false,
    watchOptions: {
        ignored: /node_modules/,
        poll: 1000, // 每秒钟询问的次数
        aggregateTimeout: 500 // 相当于节流的功能
    },

    // 可以起别名
    // resolve: {
    //     // 引入模块的时候可以不用扩展名
    //     extensions: ['', '.js', 'css', 'less', 'json'],
    //     alias: {
    //         "bootstrap": "path"
    //     }
    // },

    // 模块转换器
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    query: {
                        presets: ["env", "stage-0", "react"]
                    }
                }
            },
            {
                test: /\.css$/, // 转换文件的匹配正则
                // css-loader用来解析CSS文件中的url路径
                // style-loader 可以把CSS文件编程style标签插入HEAD中
                // 多个loader是从右往左处理的
                // 此插件先用css-loader处理以下css文件
                loader: cssExtract.extract(["css-loader"])
            },
            {
                test: /\.less$/,
                loader: lessExtract.extract(["css-loader?minimize", "less-loader"])
            },
            {
                test: /\.scss$/,
                loader: sassExtract.extract(["css-loader?minimize", "sass-loader"])
            },
            {
                // file-loader是解析图片地址 把图片从原位置拷贝到目标位置
                // 并且修改原引用位置 可以处理任意二进制 bootstrap里的字体
                // url-loader 可以把小图片变成base64字符串内嵌到页面中
                test: /\.(png|jpg|gif|svg|jpeg|bmp)$/,
                use: {
                    loader: 'url-loader',
                    // 指定拷贝文件的输出目录
                    options: {
                        limit: 9 * 1024,
                        outputPath: 'img/'
                    }
                }
            },
            {
                test: /\.(html|htm)/,
                loader: 'html-withimg-loader'
            }
        ]
    },
    // 扩展插件
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [path.join(__dirname, 'dist')]
        }),
        // 此插件可以自动产出html文件 如果是多个并且生成多个页面分别引用
        // 这里要用chunks对应起来 一个entry对应一个chunk
        new HtmlWebpackPlugin({
            // 指定模板
            template: './src/index.html',
            // 指定产出
            filename: 'index.html',
            // chunks: ['index', 'common'], // 在产出的html文件中加那些代码块
            title: 'webpack images',
            hash: true, // 会在引入的js里加入查询字符串避免缓存
            minify: { // 会在引用时去掉双引号
                removeAttributeQuotes: true
            }
        }),
        cssExtract,
        lessExtract,
        sassExtract,
        // 拷贝
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, 'public'),
                to: path.join(__dirname, 'dist', 'public')
            }
        ]),
        // 压缩js文件
        new UglifyjsWebpackPlugin(),

    ],
    // 配置此静态文件服务器 可以用来预览打包后的项目
    devServer: {
        contentBase: './dist',
        host: 'localhost',
        port: 8080,
        compress: true, // 服务器返回给浏览器的时候是否启动gzip压缩
    }
};