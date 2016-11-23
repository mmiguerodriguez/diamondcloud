const webpack = require('webpack');
const path = require('path');
const loaders = require('../webpack.loaders');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

module.exports = {
	entry: [
	  './src/main.css',
		'./src/main.js',
	],
	output: {
		path: path.join(__dirname, 'public'),
		filename: '[chunkhash].js',
	},
	resolve: {
		extensions: ['', '.js', '.jsx'],
	},
	module: {
		loaders,
	},
	plugins: [
		new WebpackCleanupPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"',
			},
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				screw_ie8: true,
				drop_console: true,
				drop_debugger: true,
			}
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new ExtractTextPlugin('[contenthash].css'),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			title: 'Webpack example',
		}),
		new webpack.optimize.DedupePlugin(),
	],
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-router': 'ReactRouter',
  },
};