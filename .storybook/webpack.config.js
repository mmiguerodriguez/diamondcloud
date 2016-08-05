const path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: 'style!css!sass',
        exclude: /node_modules/,
        include: path.resolve(__dirname, '../../')
      },
      {
        test: /\.(jpe?g|jpg|gif|png|woff|woff2|eot|ttf|svg)$/,
        loaders: [
          'url?limit=10000',
          'img'
        ],
        include: __dirname
      }
    ]
  }
};
