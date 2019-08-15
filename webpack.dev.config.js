const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack');

const cesiumSource = 'Cesium';
const env = 'development';
const production = env && env === 'production';

module.exports = {
	mode: env,
	devtool: 'inline-source-map',
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
			},
			{
				test: /\.(js|jsx)$/,
				loader: 'babel-loader',
				include: [
					path.resolve(__dirname, 'src'),
				],
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
		new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: production ? '[name].[hash].css' : '[name].css',
      chunkFilename: production ? '[id].[hash].css' : '[id].css',
    }),
		new webpack.HotModuleReplacementPlugin(),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        libs: {
          name: "chunk-libs",
          test: /[\\/]node_modules[\\/]/,
          priority: 20,
          chunks: "initial" // 只打包初始时依赖的第三方
        },
        commons: {
          name: "chunk-commons",
          test: path.resolve("src/components"), // 可自定义拓展你的规则
          minChunks: 2, // 最小共用次数
          priority: 5,
          reuseExistingChunk: true
        },
        echartsVendor: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]echarts[\\/]/,
          priority: 120,
          name: 'echartsVendor',
          reuseExistingChunk: true
        },
        supermapVendor: {
          chunks: 'all',
          test: (module) => {
            if (module.resource) return module.resource.includes('@supermap')
          },
          priority: 110,
          name: 'supermapVendor',
          reuseExistingChunk: true
        },
        mapboxglVendor: {
          test: (module) => {
            if (module.resource) {
              return module.resource.includes('mapbox-gl')
                && !module.resource.includes('react-map-gl')
            }
          },
          priority: 100,
          name: 'mapboxglVendor',
          reuseExistingChunk: true
        },
        antdVendor: {
          test: /[\\/]node_modules[\\/]antd[\\/]/,
          priority: 100,
          name: 'antdVendor'
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
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  }
}
