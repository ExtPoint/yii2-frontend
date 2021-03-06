'use strict';

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const glob = require('glob');
const path = require('path');
const _ = require('lodash');

class WebpackEasyManager {

    constructor() {
        this._serverConfig = {};

        this._isProduction = null;
        this._port = null;
        this._outputDev = null;

        this._configs = [];

        this._isRun = false;
    }

    /**
     * @param {object} [value]
     * @returns {WebpackEasy}
     */
    createConfig(value) {
        const config = new WebpackEasy(this);
        if (value) {
            config.config(value);
        }
        this._configs.push(config);
        this._lazyRun();
        return config;
    }

    /**
     * @param {number} value
     * @returns {WebpackEasyManager}
     */
    port(value) {
        this._port = value;
        return this;
    }

    /**
     * @param {string} value
     * @returns {WebpackEasyManager}
     */
    output(value) {
        this._outputDev = value;
        return this;
    }

    /**
     * Generate port by project name
     * @returns {string}
     */
    getPort() {
        if (this._port === null) {
            this._port = path.basename(process.cwd())
                .split('')
                .reduce((a, b) => {
                    a = ((a << 5) - a) + b.charCodeAt(0);
                    return a & a;
                }, 0)
                .toString()
                .replace(/^-|/, '5')
                .replace(/([0-9]{4}).*/, '$1');
        }
        return this._port;
    }

    /**
     * @param {object} value
     * @returns {WebpackEasyManager}
     */
    serverConfig(value) {
        this._serverConfig = value;
        return this;
    }

    /**
     *
     * @param {string} pattern
     * @returns {Promise}
     */
    glob(pattern) {
        return new Promise((resolve, reject) => {
            glob(pattern, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);
                }
            });
        });
    }

    /**
     * Check `production` or `--production` in cli arguments
     * @returns {boolean}
     */
    isProduction() {
        if (this._isProduction === null) {
            this._isProduction = process.argv.slice(2).filter(a => a.match(/(--)?production/) !== null).length > 0;
        }
        return this._isProduction;
    }

    /**
     *
     * @param {string|string[]|object|function} source
     * @param {string} [destination]
     * @returns {WebpackEasyManager}
     */
    entry(source, destination = 'index') {
        this._getFirstConfig().entry(...arguments);
        return this;
    }

    /**
     * @param {string|object} rootPath
     * @param {string} [publicPath]
     * @returns {WebpackEasyManager}
     */
    output(rootPath, publicPath) {
        this._getFirstConfig().output(...arguments);
        return this;
    }

    /**
     * @param {object} value
     * @returns {WebpackEasyManager}
     */
    plugin(value) {
        this._getFirstConfig().plugin(...arguments);
        return this;
    }

    /**
     * @param {object} value
     * @returns {WebpackEasyManager}
     */
    config(value) {
        this._getFirstConfig().config(...arguments);
        return this;
    }

    /**
     * @param {object} value
     * @param {boolean} prepend
     * @returns {WebpackEasyManager}
     */
    loader(value, prepend = false) {
        this._getFirstConfig().loader(...arguments);
        return this;
    }

    /**
     * @param {object|boolean} value
     * @returns {WebpackEasyManager}
     */
    loaderJs(value) {
        this._getFirstConfig().loaderJs(...arguments);
        return this;
    }

    /**
     * @param {object|boolean} value
     * @returns {WebpackEasyManager}
     */
    loaderJson(value) {
        this._getFirstConfig().loaderJson(...arguments);
        return this;
    }

    /**
     * @param {object|boolean} value
     * @returns {WebpackEasyManager}
     */
    loaderLess(value) {
        this._getFirstConfig().loaderLess(...arguments);
        return this;
    }

    /**
     * @param {object|boolean} value
     * @returns {WebpackEasyManager}
     */
    loaderFont() {
        this._getFirstConfig().loaderFont(...arguments);
        return this;
    }

    _getFirstConfig() {
        if (this._configs.length === 0) {
            this.createConfig();
        }

        return this._configs[0];
    }


    _lazyRun() {
        setTimeout(this._run.bind(this));
    }

    _run() {
        if (this._isRun) {
            return;
        }
        this._isRun = true;

        Promise.all(this._configs.map(config => config.run()))
            .then(configs => {
                if (this.isProduction()) {
                    // Run build
                    webpack(configs, (err, multiStats) => {
                        if (err) {
                            throw new Error(err);
                        }
                        multiStats.stats.map(stat => console.error(stat.compilation.errors.map(e => String(e)).join('\n')));
                    });
                } else {
                    // Configuration for dev server
                    const serverConfig = _.merge({
                        hot: true,
                        contentBase: this._outputDev || this._getFirstConfig().path,
                        historyApiFallback: true,
                        disableHostCheck: true,
                        headers: {
                            'Host': 'localhost',
                            'Access-Control-Allow-Origin': '*'
                        },
                        stats: {
                            chunks: false,
                            colors: true
                        }
                    }, this._serverConfig);

                    // Run dev server
                    new WebpackDevServer(
                        webpack(configs),
                        serverConfig
                    ).listen(this.getPort(), 'localhost', err => {
                        if (err) {
                            throw new Error(err);
                        }
                        console.log('Listening at http://localhost:' + this.getPort());
                    });
                }
            })
            .catch(e => console.log(e));
    }

}

class WebpackEasy {

    constructor(manager) {
        this._manager = manager;
        this._entries = {};
        this._output = {
            path: `${process.cwd()}/public`,
            publicPath: '/',
            filename: 'assets/[name].js'
        };
        this._config = {};
        this._promises = [];

        this._loaders = {
            js: {
                test: /\.js$/,
                use: {
                    babel: {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            plugins: [
                                'transform-decorators-legacy',
                                'transform-class-properties',
                                'transform-object-rest-spread',
                                'transform-export-extensions',
                                this._manager.isProduction() && 'transform-runtime',
                            ].filter(Boolean),
                            presets: ['env', 'react']
                        }
                    },
                    eslint: !this._manager.isProduction() && {
                        loader: 'eslint-loader',
                        options: {
                            configFile: `${process.cwd()}/.eslintrc`,
                        }
                    },
                },
                exclude: /node_modules/
            },
            json: {
                test: /\.json$/,
                use: {
                    json: 'json-loader'
                },
            },
            less: {
                test: /\.less$/,
                use: {
                    style: 'style-loader',
                    css: 'css-loader',
                    less: {
                        loader: 'less-loader',
                        options: {
                            modifyVars: {
                                'bem-namespace': '',
                            }
                        }
                    }
                }
            },
            sass: {
                test: /\.scss$/,
                use: {
                    style: 'style-loader',
                    css: 'css-loader',
                    sass: 'sass-loader'
                }
            },
            font: {
                test: /(\/|\\)fonts(\/|\\).*\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: {
                    file: {
                        loader: 'file-loader',
                        options: {
                            name: 'fonts/[name].[ext]'
                        }
                    }
                },
            }
        };
        this._loadersNames = Object.keys(this._loaders);

        this._plugins = [
            this._manager.isProduction() && new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            }),
            this._manager.isProduction() && new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                sourceMap: false,
            }),
            !this._manager.isProduction() && new webpack.HotModuleReplacementPlugin()
        ];
    }

    /**
     *
     * @param {string|string[]|object|function} source
     * @param {string} [destination]
     * @returns {WebpackEasy}
     */
    entry(source, destination = 'index') {

        if (_.isString(source)) {
            return this.entry([source], destination);
        }
        if (_.isFunction(source)) {
            return source.call(this);
        }

        _.each(source, (paths, key) => {
            if (_.isString(key)) {
                destination = key;
            }

            this._entries[destination] = this._entries[destination] || [];
            this._promises.push(
                Promise.all(
                    [destination].concat([].concat(paths).map(path => this._manager.glob(path)))
                ).then(result => {
                    const dest = result.shift();
                    result.forEach(p => {
                        this._entries[dest] = this._entries[dest].concat(p);
                    });
                })
            );
        });

        return this;
    }

    /**
     * @param {string|object} rootPath
     * @param {string} [publicPath]
     * @returns {WebpackEasy}
     */
    output(rootPath, publicPath) {
        if (_.isString(rootPath)) {
            rootPath = {
                path: path.resolve(process.cwd(), rootPath)
            };
        }
        if (publicPath) {
            rootPath.publicPath = publicPath;
        }

        // Split to path and file name
        if (rootPath.publicPath) {
            var params = path.parse(rootPath.publicPath);
            if (params.base) {
                rootPath.dir = params.dir;
                rootPath.filename = params.base;
            }
        }

        this._output = _.merge(this._output, rootPath);
        return this;
    }

    /**
     * @param {object} value
     * @returns {WebpackEasy}
     */
    plugin(value) {
        this._plugins = this._plugins.concat(value);
        return this;
    }

    /**
     * @param {object} value
     * @returns {WebpackEasy}
     */
    config(value) {
        this._config = _.extend(this._config || {}, value);
        return this;
    }

    /**
     * @param {object} value
     * @param {boolean} prepend
     * @returns {WebpackEasy}
     */
    loader(value, prepend = false) {
        return this._loader(_.uniqueId('loader'), value, prepend);
    }

    /**
     * @param {object|boolean} value
     * @returns {WebpackEasy}
     */
    loaderJs(value) {
        return this._loader('js', value);
    }

    /**
     * @param {object|boolean} value
     * @returns {WebpackEasy}
     */
    loaderJson(value) {
        return this._loader('json', value);
    }

    /**
     * @param {object|boolean} value
     * @returns {WebpackEasy}
     */
    loaderLess(value) {
        return this._loader('less', value);
    }

    /**
     * @param {object|boolean} value
     * @returns {WebpackEasy}
     */
    loaderSass(value) {
        return this._loader('sass', value);
    }

    /**
     * @param {object|boolean} value
     * @returns {WebpackEasy}
     */
    loaderFont(value) {
        return this._loader('font', value);
    }

    run() {
        return Promise.all(this._promises).then(() => {
            // Webpack config
            let config = {
                entry: this._entries,
                output: _.merge({}, this._output, {
                    publicPath: this._manager.isProduction() ?
                        this._output.publicPath :
                        'http://localhost:' + this._manager.getPort() + this._output.publicPath,
                }),
                devtool: this._manager.isProduction() ? 'hidden-sourcemap' : 'eval',
                module: {
                    rules: this._loadersNames.map(v => this._loaders[v]).filter(v => v).map(loader => {
                        if (_.isObject(loader.use)) {
                            loader.use = _.values(loader.use).filter(Boolean);
                        }
                        return loader;
                    })
                },
                plugins: this._plugins.filter(v => v),
            };

            Object.keys(this._entries).forEach(key => {
                config.entry[key] = []
                    .concat(this._entries[key]);
            });

            // Add hot replacement modules
            if (!this._manager.isProduction()) {

                var indexKey = _.has(this._entries, 'index') ? 'index' : _.head(Object.keys(this._entries));
                if (indexKey) {
                    config.entry[indexKey].push(`webpack-dev-server/client?http://localhost:${this._manager.getPort()}/`);
                }
            }

            // Merge with custom config
            return _.merge(config, this._config);
        });
    }

    _loader(name, value, prepend) {
        if (!this._loaders[name]) {
            if (prepend) {
                this._loadersNames.unshift(name);
            } else {
                this._loadersNames.push(name);
            }
        }
        this._loaders[name] = value ? _.extend(this._loaders[name] || {}, value) : false;
        return this;
    }

}

module.exports = new WebpackEasyManager();