const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');

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
        exclude: /node_modules\/(?!@artificialsolutions\/tie-api-client)/,
        options: {
          "presets": [
            [
              "@babel/preset-env",
              {
                "corejs": 3,
                "useBuiltIns": "usage",
                "debug": false
              }
            ]
          ],
          plugins: ["@babel/plugin-transform-modules-commonjs"],
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /\.(png|svg)$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
};
