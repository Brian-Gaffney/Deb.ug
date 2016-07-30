var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

	entry: [
		'main.js'
	],

	output: {
		path: __dirname + '/build',
		filename: '[name].js',
		publicPath: '/'
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
		port: 3000
	},

	eslint: {
		formatter: require('eslint-friendly-formatter')
	},

	module: {

		loaders: [
			{
				test: /\.(js|jsx|svg)$/,
				loader: 'babel',
				include: [
					path.resolve(__dirname, 'src'),
				],
				query: {
					presets: ['react', 'es2015']
				}
			},

			{
				// Use regular scss (no modules) for 'styles/**/*.scss'
				test: /styles\/.+\.scss$/,
				loader: 'style!css!resolve-url!autoprefixer!sass?' +
				'includePaths[]=' + encodeURIComponent(path.resolve(__dirname, './src')) +
				'&includePaths[]=' + encodeURIComponent(path.resolve(__dirname, './node_modules'))
			},

			// Load regular css
			{
				test: /\.css$/,
				loader: 'style!css!autoprefixer'
			},

			// User the url loader for images
			{
				test: /\.(jpg|png)$/,
				loader: 'url?limit=20000' + // inline as base64 if < 20kb
				'&name=[name]-[hash].[ext]'
			},

			// Load SVGs as react components
			{
				test: /\.svg$/,
				loaders: [
					'svg-jsx'
				]
			}
		]
	},

	resolve: {

		root: __dirname,

		// Resolve extensionless files with the list below.
		// Eg. require('foo') will resolve to 'foo.js', 'foo/index.jsx' etc.
		extensions: ['', '.js', '.jsx', '.es6'],

		// Add the src directory as a modules location
		modulesDirectories: [
			'src/',
			'node_modules'
		]
	},

	plugins: [
		new webpack.HotModuleReplacementPlugin(),

		new HtmlWebpackPlugin({
			template: './src/index.html',
			inject: 'body',
			minify: {
				collapseWhitespace: true,
				removeComments: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true
			}
		})
	]

};
