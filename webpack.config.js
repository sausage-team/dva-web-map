const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const cesiumSource = 'Cesium';

const env = 'development'
const production = env && env === 'production'

module.exports = {
	mode: env,
	context: __dirname,
	entry: {
			app: ['@babel/polyfill', './src/index.jsx']
	},
	output: {
			filename: '[name].js',
			path: path.resolve(__dirname, 'dist'),
	},
	amd: {
			toUrlUndefined: true
	},
	node: {
			fs: 'empty'
	},
	module: {
		rules: [
			{
        test: /\.(gltf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
			{
				test: /\.(png|jpg|gif|ico|eot|svg|ttf|woff)$/,
				use : [
					{
						loader : 'url-loader'
					}
				]
			},
			{
				test: /\.(css)$/,
				use: [
					'style-loader',
					{ 
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					}
				],
				include: [
					path.resolve(__dirname, 'src'),
					path.resolve(__dirname, 'node_modules/mapbox-gl-compare'),
					path.resolve(__dirname, 'node_modules/mapbox-gl')
				]
			},
			{
				test: /\.(less)$/,
				use: [
					'style-loader',
					{ 
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{ 
						loader: 'less-loader',
						options: {
							javascriptEnabled: true,
						}
					}
				],
				include: [
					path.resolve(__dirname, 'src'),
					path.resolve(__dirname, 'node_modules/antd'),
					path.resolve(__dirname, 'node_modules/mapbox-gl-compare'),
					path.resolve(__dirname, 'node_modules/mapbox-gl'),
				]
			},
			{
				test: /\.(js|jsx)$/,
				loader: 'babel-loader',
				options: {
					presets: [
            '@babel/preset-env',
            {
              plugins: [
								'@babel/plugin-proposal-class-properties'
              ]
            }
          ]
				},
				include: [
					path.resolve(__dirname, 'src'),
					path.resolve(__dirname, 'node_modules/@supermap'),
					path.resolve(__dirname, 'node_modules/mapbox-gl-draw')
				],
				// exclude: /(node_modules|dist|Cesium)/
			}
		],
		noParse: /(mapbox-gl)\.js$/
	},
	plugins: [
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false,
		}),
		new HtmlWebpackPlugin({
			template: production ? `${__dirname}/src/indexPro.ejs` : `${__dirname}/src/index.ejs`,
			// filename: production ? 'index.html' : '../index.html',
			filename: 'index.html',
			minify: production ? {
					collapseWhitespace: true,
			} : null,
			hash: true,
		}),
		new CopyWebpackPlugin([
			{
				from: path.join(cesiumSource),
				to: 'Cesium'
			},
		]),
		new webpack.HotModuleReplacementPlugin()
	],
	resolve: {
		alias: {
			components: `${__dirname}/src/components`,
			utils: `${__dirname}/src/utils`,
			config: `${__dirname}/src/utils/config`,
			enums: `${__dirname}/src/utils/enums`,
			services: `${__dirname}/src/services`,
			models: `${__dirname}/src/models`,
			routes: `${__dirname}/src/routes`,
			themes: `${__dirname}/src/themes`,
		},
		extensions: ['*', '.js', '.jsx']
	},
	devServer: {
			contentBase: path.join(__dirname, "dist"),
			compress: true,
			port: 9000,
			hot: true
	}
}
