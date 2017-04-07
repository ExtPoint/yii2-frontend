const webpack = require('webpack');
const webpackEasy = require('webpack-easy');

module.exports = (entry) => {
    const staticPath = (webpackEasy.isProduction() ? '' : 'static/1.0/');

    webpackEasy
        .entry(entry)
        .config({
            resolve: {
                root: `${__dirname}/app`,
                alias: {
                    actions: 'core/frontend/actions',
                    components: 'core/frontend/components',
                    reducers: 'core/frontend/reducers',
                    shared: 'core/frontend/shared',
                },
                extensions: ['', '.js']
            },
        })
        .output({
            path: `${__dirname}/public/`,
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
            exclude: /node_modules(\/|\\+)(?!jii)/
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
};
