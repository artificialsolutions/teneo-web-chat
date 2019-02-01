const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        loader: ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg)$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
};
