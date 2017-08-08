const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const webpackEasy = require('webpack-easy');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = (entry, stands, standsPath) => {
    const staticPath = (webpackEasy.isProduction() ? '' : 'static/1.0/');

    webpackEasy
        .entry(entry)
        .config({
            resolve: {
                root: path.resolve(process.cwd(), 'app'),
                alias: {
                    app: path.resolve(process.cwd(), 'app'),
                    actions: 'core/frontend/actions',
                    components: 'core/frontend/components',
                    reducers: 'core/frontend/reducers',
                    shared: 'core/frontend/shared',
                },
                extensions: ['', '.js']
            },
        })
        .output({
            path: path.resolve(process.cwd(), 'public'),
            filename: `${staticPath}assets/bundle-[name].js`,
            chunkFilename: `${staticPath}assets/bundle-[name].js`,
        })
        .loaderLess({
            loaders: [
                'style',
                'css',
                'less?' + JSON.stringify({
                    modifyVars: {
                        'bem-namespace': '',
                    }
                })
            ]
        })
        .loaderJs({
            exclude: /node_modules(\/|\\+)(?!jii)(?!extpoint-yii2)/
        })
        .loader({
            test: /\.(jpe?g|gif|png|svg)$/,
            loader: 'file'
        })
        .serverConfig({
            contentBase: './public',
            proxy: {
                '**': 'http://localhost',
            },
            staticOptions: {
                '**': 'http://localhost',
            },
        })
        .plugin(new webpack.optimize.CommonsChunkPlugin(
            'index',
            `${staticPath}assets/bundle-index.js`
        ))
        .plugin(fs.existsSync(path.resolve(process.cwd(), '.stylelintrc')) &&  new StyleLintPlugin())
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
