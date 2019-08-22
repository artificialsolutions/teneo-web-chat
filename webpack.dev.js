const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.base.js');

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
  plugins: [
    new webpack.DefinePlugin({
      TENEO_ENGINE_URL: JSON.stringify(process.env.TENEO_ENGINE_URL),
      CLOSE_TIE_SESSION_ON_EXIT: JSON.stringify(process.env.CLOSE_TIE_SESSION_ON_EXIT),
    }),
    new HtmlWebpackPlugin({
      template: './views/index.ejs',
    }),
  ],
});
