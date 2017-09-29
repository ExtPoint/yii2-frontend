const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const webpackEasy = require('./easy');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = (entry, stands, standsPath) => {
    const staticPath = (webpackEasy.isProduction() ? '' : 'static/1.0/');

    webpackEasy
        .entry(entry)
        .config({
            resolve: {
                alias: {
                    app: path.resolve(process.cwd(), 'app'),
                    actions: 'core/frontend/actions',
                    components: 'core/frontend/components',
                    reducers: 'core/frontend/reducers',
                    shared: 'core/frontend/shared',
                },
                modules: [
                    'node_modules',
                    path.resolve(process.cwd(), 'app'),
                ],
            },
        })
        .output({
            path: path.resolve(process.cwd(), 'public'),
            filename: `${staticPath}assets/bundle-[name].js`,
            chunkFilename: `${staticPath}assets/bundle-[name].js`,
        })
        .loaderJs({
            exclude: /node_modules(\/|\\+)(?!jii)(?!extpoint-yii2)/
        })
        .loader({
            test: /\.(jpe?g|gif|png|svg)$/,
            loader: 'file-loader'
        })
        .serverConfig({
            contentBase: path.join(process.cwd(), 'public'),
            proxy: {
                '**': 'http://localhost',
            },
            staticOptions: {
                '**': 'http://localhost',
            },
        })
        .plugin(new webpack.optimize.CommonsChunkPlugin({
            name: 'index',
            filename: `${staticPath}assets/bundle-index.js`
        }))
        .plugin(fs.existsSync(path.resolve(process.cwd(), '.stylelintrc')) &&  new StyleLintPlugin({
            files: ['**/*.less'],
            syntax: 'less',
        }))
        .plugin(stands && new HtmlWebpackPlugin({
            template: `${standsPath}/index.html`,
            filename: 'stands/index.html',
            TEMPLATE_NAMES: Object.keys(stands),
            inject: false,
        }))
        .plugin(stands && Object.keys(stands).map(name => new HtmlWebpackPlugin({
            template: `${standsPath}/index.html`,
            filename: `stands/${name}.html`,
            inject: false,
            BUNDLE_NAME: name,
            FILES_TO_REQUIRE: [].concat(stands[name])
        })));
};
