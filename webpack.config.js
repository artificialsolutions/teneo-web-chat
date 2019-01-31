const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: 'development',

  resolve: {
    alias: {
      vue$: 'vue/dist/vue.common.js',
    },
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },

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
        test: /\.scss$/,
        loader: ['css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg)$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
};
