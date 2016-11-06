const webpack = require('webpack');
const path = require('path');
const loaders = require('./webpack.loaders');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || "8888";

module.exports = {
	entry: [
		'react-hot-loader/patch',
		'./src/main.js',
	],
	devtool: process.env.WEBPACK_DEVTOOL || 'cheap-module-source-map',
	output: {
		path: path.join(__dirname, 'public'),
		filename: 'bundle.js',
	},
	resolve: {
		extensions: ['', '.js', '.jsx'],
	},
	module: {
		loaders,
	},
	devServer: {
		contentBase: "./public",
		noInfo: true,
		hot: true,
		inline: true,
		historyApiFallback: true,
		port: PORT,
		host: HOST,
	},
	plugins: [
		new webpack.NoErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template: './src/main.html',
		}),
	],
};