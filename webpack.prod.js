const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

module.exports = merge(baseConfig, {
  mode: 'production',
  // devtool: 'cheap-module-source-map',
  output: {
    filename: 'teneo-web-chat.js',
  },
});
