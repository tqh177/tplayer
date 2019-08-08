const webpack = require('webpack');

/* eslint-disable no-undef */
module.exports = {
    devtool: 'source-map',
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
        }, {
            test: /\.js$/, // 处理以.js结尾的文件
            exclude: /node_modules/, // 处理除了nodde_modules里的js文件
            loader: 'babel-loader', // 用babel-loader处理
            options: {
                cacheDirectory: true,
                presets: ['env']
            }
        }]
    },
    // mode: 'development',
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            __VERSION__: `"${require('./package.json').version}"`,
        })
    ]
};