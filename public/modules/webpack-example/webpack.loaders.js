const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [
    {
      test: /\.(js|jsx)$/,
      loader: 'babel',
      include: [
        path.resolve(__dirname, './src')
      ],
      /*query: {
        presets: ['react', 'es2015'],
      },*/
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
		test: /[\/\\]src[\/\\].*\.css/,
		exclude: /(node_modules|bower_components|public)/,
		loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!css-loader'),
	},
	{
		test: /[\/\\]src[\/\\].*\.scss/,
		exclude: /(node_modules|bower_components|public)/,
		loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass'),
	},
	{
		test: /[\/\\](node_modules|global)[\/\\].*\.css$/,
		loader: ExtractTextPlugin.extract('style', 'css'),
	},
];