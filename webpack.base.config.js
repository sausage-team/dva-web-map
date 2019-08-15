const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const cesiumSource = 'Cesium';
const env = 'production';

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
            loader : 'url-loader',
            options: {
              limit: 8192,
              name: '[name].[hash:8].[ext]'
            }
					}
				]
			},
			{
				test: /\.(js|jsx)$/,
				loader: 'babel-loader',
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
		new CopyWebpackPlugin([
			{
				from: path.join(cesiumSource),
				to: 'Cesium'
			},
		])
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
          chunks: 'initial',
          test: /[\\/]node_modules[\\/]echarts[\\/]/,
          priority: 120,
          name: 'echartsVendor',
          reuseExistingChunk: true
        },
        mapboxglVendor: {
          chunks: 'initial',
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
        reactMapboxglVendor: {
          test: (module) => {
            if (module.resource) {
              return !module.resource.includes('mapbox-gl')
                && module.resource.includes('react-map-gl')
            }
          },
          priority: 100,
          name: 'reactmapboxglVendor',
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
	}
}
