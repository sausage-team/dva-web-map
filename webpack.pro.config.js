const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const baseConfig = require('./webpack.base.config')
const merge = require('webpack-merge')

const env = 'production';
const production = env && env === 'production';


const mergeConfig =  merge(baseConfig, {
	mode: env,
	module: {
		rules: [
			{
				test: /\.(css|less)$/,
				use: [
					{
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: env === 'development',
            },
          },
					{
						loader: 'css-loader',
						options: {
							modules: false
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
					path.resolve(__dirname, 'node_modules/antd'),
					path.resolve(__dirname, 'node_modules/mapbox-gl-compare'),
					path.resolve(__dirname, 'node_modules/mapbox-gl'),
				]
			},
			{
				test: /\.(css|less)$/,
				use: [
					{
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: env === 'development',
            },
          },
					{
						loader: 'css-loader',
						options: {
							modules: {
								mode: 'local',
            		localIdentName: '[path][name]__[local]--[hash:base64:5]',
							}
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
					path.resolve(__dirname, 'src')
				]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: production ? `${__dirname}/src/indexPro.ejs` : `${__dirname}/src/index.ejs`,
			filename: 'index.html',
			hash: true,
		}),
		new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: production ? '[name].[hash].css' : '[name].css',
      chunkFilename: production ? '[id].[hash].css' : '[id].css',
    }),
		new BundleAnalyzerPlugin()
  ]
})

module.exports = mergeConfig