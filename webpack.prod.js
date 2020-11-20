const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: false,
  output: {
    filename: 'teneo-web-chat.js',
  },
  performance: {
    hints: false,
  }
});
