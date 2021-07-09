const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    preserveWhitespace: false
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    'presets': [
                        [
                            '@babel/preset-env',
                            {
                                'corejs': 3,
                                'useBuiltIns': 'usage',
                                'debug': false
                            }
                        ]
                    ],
                    plugins: ['@babel/plugin-transform-modules-commonjs'],
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
    watchOptions: {
        ignored: /node_modules/
    }
};
