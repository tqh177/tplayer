const webpack = require('webpack');

/* eslint-disable no-undef */
module.exports = {
    devtool: 'cheap-module-source-map',
    entry: {
        'tplayer': './src/index.js'
    },  // 入口文件
    output: {  // 输出文件路径设置
        path: __dirname,
        filename: 'dist/[name].min.js',
        library: '[name]',
        libraryTarget: 'umd',
        libraryExport: 'default',
        umdNamedDefine: true,
        publicPath: '/'
    },
    module: {
        strictExportPresence: true,
        // webpack使用loader的方式处理各种各样的资源
        rules: [{
            test: /\.svg$/,
            loader: 'svg-inline-loader'
        }]
    },
    mode: 'development',
    plugins: [
        new webpack.DefinePlugin({
            __VERSION__: `"${require('./package.json').version}"`,
        })
    ]
};