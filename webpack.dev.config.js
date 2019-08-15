const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config')

const env = 'development';
const production = env && env === 'production';

const mergeConfig =  merge(baseConfig, {
	mode: env,
	devtool: 'inline-source-map',
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
							// sourceMap: true,
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
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: {
								mode: 'local',
                localIdentName: '[path][name]__[local]--[hash:base64:5]'
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
			minify: production ? {
					collapseWhitespace: true,
			} : null,
			hash: true,
		}),
		new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: production ? '[name].[hash].css' : '[name].css',
      chunkFilename: production ? '[id].[hash].css' : '[id].css',
    }),
		new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  }
})

module.exports = mergeConfig