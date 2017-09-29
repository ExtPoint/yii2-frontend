const runner = require('./runner');
const fs = require('fs');
const webpackEasy = require('webpack-easy');

let stands = null;
let standsPath = '';

let argvStand = null;
let argvOnlyApp = false;
process.argv.slice(2).forEach(value => {
    if (value.indexOf('stands/') === 0) {
        argvStand = value.substr(7);
    }
    if (value === 'app') {
        argvOnlyApp = true;
    }
});

const api = module.exports = {

    _entries: [],

    /**
     * Index js. Core module at first
     * @param {string} path
     * @return {exports}
     */
    base(path) {
        this._entries.push(
            webpackEasy.glob(path)
                .then(files => {
                    return files.sort(file => file.indexOf('app/core/') !== -1 ? -1 : 1);
                })
                .then(result => {
                    if (!webpackEasy.isProduction()) {
                        result.unshift('react-hot-loader/patch');
                    }
                    //result.unshift('babel-polyfill');

                    return {
                        index: result,
                    };
                })
        );
        return this;
    },

    entry(path, name) {
        this._entries.push(
            webpackEasy.glob(path)
                .then(result => ({
                    [name]: result
                }))
        );
        return this;
    },

    /**
     * Module styles
     * @param {string} path
     * @param {null|string} name
     * @return {exports}
     */
    styles(path, name = null) {
        if (typeof name === 'string') {
            this._entries.push(
                webpackEasy.glob(path)
                    .then(result => ({
                        ['style' + (name ? '-' + name : '')]: result
                    }))
            );
        } else {
            this._entries.push(
                webpackEasy.glob(path)
                    .then(result => result.reduce((obj, file) => {
                            const name = file.match(/([^\/]+)\.less$/)[1].replace(/^index/, 'style');
                            obj[name] = obj[name] || [];
                            obj[name].push(file);
                            return obj;
                        }, {})
                    )
            );
        }
        return this;
    },

    /**
     * PHP widgets. Only widgets with php file. Filter /path/MY_WIDGET/MY_WIDGET.js
     * @param {string} path
     * @return {exports}
     */
    widgets(path) {
        this._entries.push(
            webpackEasy.glob(path + '/*/*.+(js|jsx|php)')
                .then(files => {
                    let phpWidgets = files
                        .filter(file => file.match(/\.php$/))
                        .map(file => file.match(/([^\/]+)\.php$/)[1]);

                    return files
                        .filter(file => file.match(/\.jsx?$/))
                        .filter(file => phpWidgets.indexOf(file.match(/([^\/]+)\.jsx?$/)[1]) !== -1)
                        .filter(file => file.match(/([^\/]+)\.jsx?$/)[1] === file.match(/([^\/]+)\/[^\/]+?$/)[1]);
                })
                .then(result => result.reduce((obj, file) => {
                        const bundleName = file
                            .split('/').slice(0, -1)
                            .filter(name => name.match(/[a-z0-9_-]+/) && ['app', 'widgets', 'lib', 'vendor'].indexOf(name) === -1)
                            .join('-');
                        obj[bundleName] = file;
                        return obj;
                    }, {})
                )
        );
        return this;
    },

    /**
     *
     * @param path
     */
    stands(path) {
        stands = {};
        standsPath = path;

        if (argvOnlyApp) {
            return;
        }

        const entries = {};
        function processDirEntries(name, parentName = null) {
            ['js', 'less', 'html'].forEach(ext => {
                if (fs.existsSync(`${path}/${name}/index.${ext}`)) {
                    const key = name.replace(/\//g, '-');
                    if (ext === 'html') {
                        const path = `./${name}/index.${ext}`;
                        stands[key] = path;
                        if (parentName) {
                            const parentKey = parentName.replace(/\//g, '-');
                            if (!Array.isArray(stands[parentKey])) {
                                stands[parentKey] = [];
                            }
                            stands[parentKey].push(path)
                        }
                    } else if (!entries[key]) {
                        entries[key] = `${path}/${name}/index.${ext}`;
                    }
                }
            });
        }
        fs.readdirSync(path).forEach(name => {
            if (name === 'less' || !fs.lstatSync(`${path}/${name}`).isDirectory()) {
                return;
            }

            if (argvStand && argvStand !== name) {
                return;
            }

            fs.readdirSync(`${path}/${name}`).forEach(subname => {
                processDirEntries(`${name}/${subname}`, name);
            });
            processDirEntries(name);
        });

        this._entries.push(entries);
    }

};

setTimeout(() => {
    Promise.all(api._entries)
        .then(result => {
            runner(
                Object.assign.apply(null, result),
                stands,
                standsPath
            );
        })
        .catch(e => console.log(e));
});