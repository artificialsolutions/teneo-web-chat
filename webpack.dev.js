const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.base.js');

require('dotenv').config();

const dotenv = require('dotenv').config({ path: `${__dirname}/.env` });

//Host set to 0.0.0.0 to allow for connections over LAN. Public IP is set to the address of the machine in the network (ip addr or ifconfig to get it)
module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
 //   host: '0.0.0.0',
   // public: '192.168.0.27'

  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.parsed)
    }),
    new HtmlWebpackPlugin({
      template: './views/index.ejs',
    }),
  ],
});
