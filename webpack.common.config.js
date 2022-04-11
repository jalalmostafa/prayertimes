const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
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
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            }],
        }]
    },
    plugins: [
        new CleanWebpackPlugin(),
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
        })
    ]
}