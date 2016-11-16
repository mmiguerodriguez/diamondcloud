const webpack = require('webpack');
const path = require('path');
const loaders = require('./webpack.loaders');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

module.exports = {
	entry: [
	  './src/main.sass',
		'./src/main.js',
	],
	output: {
		path: path.join(__dirname, 'dev'),
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
				NODE_ENV: '"development"',
			},
		}),
		new ExtractTextPlugin('[contenthash].css'),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			title: 'Webpack example',
		}),
	],
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-router': 'ReactRouter',
    classNames: 'classNames',
  },
};