const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ZipWebpackPlugin = require('zip-webpack-plugin')
const webpackMerge = require('webpack-merge')
const commonConfig = require('./webpack.common.config')
const Package = require('./package.json')

module.exports = webpackMerge.merge(commonConfig, {
    output: {
        filename: '[name].bundle.js',
        path: path.join(__dirname, 'build', 'edge')
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{
                context: 'app/',
                from: '_locales',
                to: path.join(__dirname, 'build', 'edge', '_locales')
            }, {
                context: 'app/',
                from: 'images',
                to: path.join(__dirname, 'build', 'edge', 'images')
            }, {
                context: 'app/',
                from: 'manifest_edge.json',
                to: path.join(__dirname, 'build', 'edge', 'manifest.json')
            }],
        }),
        new ZipWebpackPlugin({
            path: path.join(__dirname, 'dist', 'edge'),
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