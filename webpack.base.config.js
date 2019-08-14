const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');

const cesiumSource = 'Cesium';
const env = 'production';
const production = env && env === 'production';

module.exports = {
	mode: env,
	entry: {
			app: ['@babel/polyfill', './src/index.jsx']
	},
	output: {
			filename: '[name].js',
			path: path.resolve(__dirname, 'dist'),
			libraryTarget: 'umd'
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
					path.resolve(__dirname, 'src')
				],
				exclude: /(dist)/
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
			filename: production ? 'index.html' : '../index.html',
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
		new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: production ? '[name].[hash].css' : '[name].css',
      chunkFilename: production ? '[id].[hash].css' : '[id].css',
    }),
		new webpack.HotModuleReplacementPlugin(),
		new BundleAnalyzerPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: 'initial',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
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
	}
}
