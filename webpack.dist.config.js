/* eslint-env node */
var webpack = require('webpack');
var config = require('./webpack.config');

// Fingerprint filenames
config.output.filename = '[name]-[hash].js';

// Remove sourcemaps
config.devtool = 'none';




// =================================
// Modifications to loaders
// =================================

// Remove HMR plugin
config.plugins = config.plugins.filter(function (plugin) {
	return plugin instanceof webpack.HotModuleReplacementPlugin === false;
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
