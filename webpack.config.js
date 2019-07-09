const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Package = require('./package.json')

module.exports = {
    devtool: 'cheap-module-source-map',
    mode: process.env.NODE_ENV,
    entry: {
        popup: './app/src/popup/index.tsx',
        background: './app/src/background/index.ts'
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
        })
    ]
}