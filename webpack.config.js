const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ZipWebpackPlugin = require('zip-webpack-plugin')
const DefineWebpackPlugin = require('webpack').DefinePlugin

const DotEnv = require('dotenv').config()
const Package = require('./package.json')

module.exports = {
    devtool: process.env.NODE_ENV === 'development' ? 'cheap-module-source-map' : 'none',
    mode: process.env.NODE_ENV,
    entry: {
        popup: './app/src/popup/index.tsx',
        background: './app/src/background/index.ts',
        options: './app/src/options/index.tsx',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].bundle.js',
        path: path.join(__dirname, 'build')
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [{
                loader: 'style-loader',
            }, {
                loader: 'css-loader',
            }]
        }, {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }, {
            test: /\.(eot|ttf|woff)$/,
            use: 'file-loader',
        }, {
            test: /\.mp3$/,
            use: [
                {
                    loader: 'file-loader',
                    query: {
                        name: '[name].[ext]'
                    }
                }
            ],
        }]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([{
            context: 'app/',
            from: '_locales',
            to: path.join(__dirname, 'build', '_locales')
        }, {
            context: 'app/',
            from: 'images',
            to: path.join(__dirname, 'build', 'images')
        }, {
            context: 'app/',
            from: 'manifest.json',
            to: path.join(__dirname, 'build', 'manifest.json')
        }]),
        new HtmlWebpackPlugin({
            chunks: ['background'],
            filename: 'background.html',
            title: Package.productName,
        }),
        new HtmlWebpackPlugin({
            chunks: ['popup'],
            filename: 'popup.html',
            title: Package.productName
        }),
        new HtmlWebpackPlugin({
            chunks: ['options'],
            filename: 'options.html',
            title: Package.productName
        }),
        new DefineWebpackPlugin({
            __GMAPS_API_KEY__: JSON.stringify(process.env.GMAPS_API_KEY),
        }),
        new ZipWebpackPlugin({
            path: path.join(__dirname, 'dist'),
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
}