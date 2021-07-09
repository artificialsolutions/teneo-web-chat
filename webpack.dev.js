const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.base.js');
require('dotenv')
    .config();
const dotenv = require('dotenv')
    .config({path: `${__dirname}/.env`});


let devServerOptions = {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
};

if (dotenv.parsed.ALLOW_LAN_ON_DEV === "true") {
// Host set to 0.0.0.0 with a public IP to allow for connections over LAN.
    process.on('warning', (warning) => {
        console.log(warning.stack);
    });
    process.on('error', (error) => {
        console.log(error.stack);
    });
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    devServerOptions.host = '0.0.0.0';
    devServerOptions.public = '0.0.0.0:9000';
    devServerOptions.disableHostCheck = true;
    Object.keys(networkInterfaces)
        .forEach(function (interfaceName) {
            networkInterfaces[interfaceName].forEach(function (networkInterface) {
                if ('IPv4' !== networkInterface.family || networkInterface.internal !== false) {
                    // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                    return;
                }
                if (networkInterface.address.startsWith('192.168')) {
                    devServerOptions.public = networkInterface.address;
                    console.log('Server on LAN at address: ' + devServerOptions.public);
                }
            });
        });
}
module.exports = merge(baseConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: devServerOptions,
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(dotenv.parsed)
        }),
        new HtmlWebpackPlugin({
            template: './views/index.ejs',
        }),
    ],
});
