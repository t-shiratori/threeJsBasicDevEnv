var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require("path");

var DIST_DIR = path.resolve(__dirname, "dist");
var SRC_DIR = path.resolve(__dirname, "src");

var config = {
    entry: [
        SRC_DIR + "/index.html",
        SRC_DIR + "/js/index.js"
    ],
    output: {
        path: DIST_DIR,
        filename: "/js/bundle.js"
    },
    devServer: {
        contentBase: "dist",
        inline: true,
        hot: true,
        port: 9999,
        open: true
    },
    plugins: [
        // hotモードに必要なプラグイン
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('css/index.css'),
        new webpack.ProvidePlugin({
            THREE: 'three',
            OrbitControls: 'three-orbit-controls',
            SimplexNoise :'simplex-noise'
        })
    ],
    devtool: "source-map",
    module: {
        loaders: [{
                test: /\.html$/,
                loader: "file?name=[name].[ext]"
            },
            {
                test: [/stats\.min\.js$/, /dat\.gui\.min\.js$/],
                loader: "file?name=js/lib/[name].[ext]"
            },
            {
                test: /\.js$/,
                exclude: [/node_modules/, /stats\.min\.js$/, /dat\.gui\.min\.js$/],
                loader: "babel-loader",
                query: {
                    presets: ["es2015", "stage-3"]
                }
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
            },
            {
                test: /\.jpg|\.png$/,
                loader: "file?name=img/[name].[ext]"
            },
            {
                test: /\.mp3$/,
                loader: "file?name=sound/[name].[ext]"
            }
        ]
    }
};

module.exports = config;
