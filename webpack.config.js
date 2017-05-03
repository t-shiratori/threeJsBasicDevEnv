var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require("path");

var DIST_DIR = path.resolve(__dirname, "dist");
var SRC_DIR = path.resolve(__dirname, "src");

var config = {
    entry: {
        js: SRC_DIR + "/js/index.js"
    },
    output: {
        path: DIST_DIR,
        filename: "./js/bundle.js"
    },
    devServer: {
        contentBase: "dist",
        inline: true,
        hot: true,
        port: 9999,
        open: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: SRC_DIR + '/index.html'
        }),
        new ExtractTextPlugin({
            filename: 'css/index.css',
            disable: true,
            allChunks: true
        }),
        new webpack.ProvidePlugin({
            THREE: 'three',
            OrbitControls: 'three-orbit-controls',
            SimplexNoise :'simplex-noise'
        })
    ],
    devtool: "source-map",
    module: {
        loaders: [
            {
                test: [/stats\.min\.js$/, /dat\.gui\.min\.js$/],
                loader: "file-loader?name=js/lib/[name].[ext]"
            },
            {
                test: /\.js$/,
                exclude: [/node_modules/, /stats\.min\.js$/, /dat\.gui\.min\.js$/],
                      use: {
                        loader: 'babel-loader',
                        options: {
                          presets: ['env']
                        }
                      }
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                        fallback: ['style-loader'],
                        use: ['css-loader', 'sass-loader']
                    })
            },
            {
                test: /\.gif|\.jpg|\.png$/,
                use: 'file-loader?name=img/[name].[ext]'
            },
            {
                test: /\.mp3$/,
                use: 'file-loader?name=sound/[name].[ext]'
            }
        ]
    }
};

module.exports = config;
