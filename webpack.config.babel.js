import path from 'path'

import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

console.log('###', `${__dirname  }./build`)

module.exports = {

	entry: [
		`${__dirname  }/src/main.js`,
	],

	output: {
		path: `${__dirname  }/build`,
		filename: '[name].js',
		publicPath: '/',
	},

	devtool: 'cheap-module-source-map',

	devServer: {
		hot: true,
		inline: true,
		quiet: false,
		noInfo: false,
		compress: true, // Enables gzip
		historyApiFallback: true,
		host: '0.0.0.0',
		port: 3000,
	},

	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [
					path.resolve(__dirname, './src'),
				],
			},

			// Use the url loader for images
			{
				test: /\.(jpg|png)$/,
				loader: 'url-loader?limit=20000' + // inline as base64 if < 20kb
				'&name=[name]-[hash].[ext]',
			},
		],
	},

	resolve: {
		modules: [
			__dirname,
			'node_modules',
		],
	},

	plugins: [
		new webpack.HotModuleReplacementPlugin(),

		new HtmlWebpackPlugin({
			// template: './index.html',
			template: `${__dirname  }/src/index.html`,
			inject: 'body',
			minify: {
				collapseWhitespace: true,
				removeComments: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
			},
		}),
	],

}
