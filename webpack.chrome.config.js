const path = require('path')
const ZipWebpackPlugin = require('zip-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpackMerge = require('webpack-merge')
const commonConfig = require('./webpack.common.config')
const Package = require('./package.json')

module.exports = webpackMerge(commonConfig, {
    output: {
        filename: '[name].bundle.js',
        path: path.join(__dirname, 'build', 'chrome')
    },
    plugins: [
        new CopyWebpackPlugin([{
            context: 'app/',
            from: '_locales',
            to: path.join(__dirname, 'build', 'chrome', '_locales')
        }, {
            context: 'app/',
            from: 'images',
            to: path.join(__dirname, 'build', 'chrome', 'images')
        }, {
            context: 'app/',
            from: 'manifest_chrome.json',
            to: path.join(__dirname, 'build', 'chrome', 'manifest.json')
        }]),
        new ZipWebpackPlugin({
            path: path.join(__dirname, 'dist', 'chrome'),
            filename: Package.name,
            exclude: [/\.map$/],
            // OPTIONAL: see https://github.com/thejoshwolfe/yazl#addfilerealpath-metadatapath-options
            fileOptions: {
                mtime: new Date(),
                mode: 0o100664,
                compress: true,
                forceZip64Format: false,
            },

            // OPTIONAL: see https://github.com/thejoshwolfe/yazl#endoptions-finalsizecallback
            zipOptions: {
                forceZip64Format: false,
            },
        })
    ]
})