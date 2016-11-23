const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [
  {
    test: /\.(js|jsx)$/,
    loader: 'babel',
		exclude: /(node_modules|bower_components)/,
  },
	{
		test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
		exclude: /(node_modules|bower_components)/,
		loader: 'file',
	},
	{
		test: /\.(woff|woff2)$/,
		exclude: /(node_modules|bower_components)/,
		loader: 'url?prefix=font/&limit=5000'
	},
	{
		test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
		exclude: /(node_modules|bower_components)/,
		loader: 'url?limit=10000&mimetype=application/octet-stream',
	},
	{
		test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
		exclude: /(node_modules|bower_components)/,
		loader: 'url?limit=10000&mimetype=image/svg+xml',
	},
	{
		test: /\.gif/,
		exclude: /(node_modules|bower_components)/,
		loader: 'url-loader?limit=10000&mimetype=image/gif',
	},
	{
		test: /\.jpg/,
		exclude: /(node_modules|bower_components)/,
		loader: 'url-loader?limit=10000&mimetype=image/jpg',
	},
	{
		test: /\.png/,
		exclude: /(node_modules|bower_components)/,
		loader: 'url-loader?limit=10000&mimetype=image/png',
	},
  {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
		exclude: /(node_modules|bower_components)/,
  },
  {
    test: /\.sass/,
    loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader'),
		exclude: /(node_modules|bower_components)/,
  },
  {
    test: /\.less$/,
    loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader'),
		exclude: /(node_modules|bower_components)/,
  },
];