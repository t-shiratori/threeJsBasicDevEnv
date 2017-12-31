const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const glob = require('glob');
const _ = require('lodash');

const DIST_DIR = path.resolve(__dirname, './dist');

const getProjectDirName = /.+\/src\/([^/]+)\//;

// jsエントリーポイントオブジェクト作成
const entryJsPasses = glob.sync(`./src/**/index.js`);
const entryJsKeys = _.map(entryJsPasses, (pass) => {
    return pass.match(getProjectDirName)[1]
})
const entriesJs = _.zipObject(entryJsKeys, entryJsPasses)

/* プラグイン
------------------------------------------------------- */
let plugins = [
    // hotモードに必要なプラグイン
    new webpack.HotModuleReplacementPlugin()
];

// html コピー
_.map(glob.sync(`./src/**/index.html`), (pass) => {
    plugins.push(new CopyWebpackPlugin([
        {from: pass, to: pass.replace('src/', '')}
    ]))
})

// libファイルコピー
_.map(glob.sync(`./src/**/lib/*.js`), (pass) => {
    plugins.push(new CopyWebpackPlugin([
        {from: pass, to: pass.replace('src/', '')}
    ]))
})

// css コンパイル & 外部ファイル化
plugins.push(new ExtractTextPlugin({
    filename: (getPath) => {
        const dirName = getPath('[name]')
        return dirName.replace(`${dirName}`, `${dirName}/css/index.css`);
    },
    allChunks: true
}))

plugins.push(new webpack.ProvidePlugin({
    THREE: 'three',
    OrbitControls: 'three-orbit-controls',
    SimplexNoise: 'simplex-noise'
}))

/* config
------------------------------------------------------- */
const config = {
    entry: entriesJs,
    output: {
        path: DIST_DIR,
        filename: '[name]/js/bandle.js'
    },
    devServer: {
        contentBase: 'dist',
        inline: true,
        hot: true,
        open: true,
        port: 9999
    },
    plugins: plugins,
    devtool: 'source-map',
    module: {
        rules: [{
                    test: /\.html$/,
                    loader: 'html-loader'
                },
                {
                    test: /\.js$/,
                      exclude: /(node_modules|bower_components|[/stats\.min\.js$/, /dat\.gui\.min\.js$/])/,
                      use: {
                        loader: 'babel-loader',
                        options: {
                          presets: [
                            ['env', {modules: false}]
                          ]
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
                    test: /\.jpg|\.png$/,
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
