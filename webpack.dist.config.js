/* eslint-env node */
var webpack = require('webpack');
var config = require('./webpack.config');

// Fingerprint filenames
config.output.filename = '[name]-[hash].js';

// Remove sourcemaps
config.devtool = 'none';




// =================================
// Remove hot module replacement code
// =================================
config.module.loaders = config.module.loaders
	// Find react-hot! loaders and remove them
	.map(function (loaderConfig) {
		if (/^react\-hot\!/.test(loaderConfig.loader)) {
			loaderConfig.loader = loaderConfig.loader.replace(/^react\hot\!/, '');
		}
		return loaderConfig;
	});

config.plugins = config.plugins.filter(function (plugin) {
	return plugin instanceof webpack.HotModuleReplacementPlugin === false;
});


// =================================
// Disable 'friendly' CSS class names
// =================================
config.module.loaders = config.module.loaders
	// Find css style! loaders and replace with extract-text-plugin config
	.map(function (loaderConfig) {
		loaderConfig.loader = loaderConfig.loader.replace('localIdentName=[local]__[hash:base64]!', '[hash:base64]');
		return loaderConfig;
	});




// =================================
//  General optimizations
// =================================

config.plugins.push(
	new webpack.DefinePlugin({
		'process.env': {
			// This has effect on the react lib size
			'NODE_ENV': JSON.stringify('production')
		}
	})
);

// Dedupe modules
config.plugins.push(
	new webpack.optimize.DedupePlugin()
);

// Prioritise entry chunks
config.plugins.push(
	new webpack.optimize.OccurenceOrderPlugin(true)
);

// Uglify the output
config.plugins.push(
	new webpack.optimize.UglifyJsPlugin({
		sourceMap: false,
		compress: {
			warnings: false,
			drop_console: true
		},
		mangle: {
			except: ['$super', '$', 'exports', 'require']
		}
	})
);

// =================================


module.exports = config;
