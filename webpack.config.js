const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const cesiumSource = 'Cesium';
const cesiumWorkers = './Workers';
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = (webpackConfig, env) => {
  console.log('--------env--------', env)
    const production = env === 'production'
    // FilenameHash
    if (webpackConfig.module) {
        // ClassnameHash
        webpackConfig.context = __dirname,
            webpackConfig.entry = {
                app: ['babel-polyfill', './src/index.js'],
                // cesium:'./Cesium/Cesium.js'
            };
        webpackConfig.output = {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist'),
            // Needed by Cesium for multiline strings
        }
        webpackConfig.amd = { toUrlUndefined: true };
        webpackConfig.node = { fs: 'empty' };
        webpackConfig.module.rules.map((item) => {
            if (String(item.test) === '/\\.less$/' || String(item.test) === '/\\.css/') {
                item.use.filter(iitem => iitem.loader === 'css')[0].options.localIdentName = '[hash:base64:5]'
            }
            return item
        })
        webpackConfig.module.rules.push({
            test: /\.js[x]?$/,
            include: [path.resolve(__dirname, 'node_modules/@supermap'), path.resolve(__dirname, 'node_modules/mapbox-gl-draw')],
            exclude: /('node_modules|dist|Cesium)/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015'],
                    }
                }
            ],
        })
        // 打包报错处理：Uncaught ReferenceError: t is not defined 
        webpackConfig.module.noParse = /(mapbox-gl)\.js$/
    }
    webpackConfig.plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        })
    )
    webpackConfig.plugins = webpackConfig.plugins.concat([
        new HtmlWebpackPlugin({
            template: production ? `${__dirname}/src/indexPro.ejs` : `${__dirname}/src/index.ejs`,
            // template: `${__dirname}/src/indexPro.ejs`,
            // filename: production ? 'index.html' : '../index.html',
            filename: 'index.html',
            minify: production ? {
                collapseWhitespace: true,
            } : null,
            hash: true,
            headScripts: production ? null : ['/roadhog.dll.js'],
        }),
        new CopyWebpackPlugin([
            {
                from: path.join(cesiumSource),
                to: 'Cesium'
            },
        ])
    ])
    // Alias
    webpackConfig.resolve.alias = {
        components: `${__dirname}/src/components`,
        utils: `${__dirname}/src/utils`,
        config: `${__dirname}/src/utils/config`,
        enums: `${__dirname}/src/utils/enums`,
        services: `${__dirname}/src/services`,
        models: `${__dirname}/src/models`,
        routes: `${__dirname}/src/routes`,
        themes: `${__dirname}/src/themes`,
        //cesium: path.resolve(__dirname, cesiumSource),
    }
    // webpackConfig.babel.plugins.push(['import', {
    //     libraryName: 'antd',
    // }]);
    webpackConfig.devServer = {
        contentBase: path.join(__dirname, "dist")
    }
    return webpackConfig
}
