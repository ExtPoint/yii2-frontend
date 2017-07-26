import _get from 'lodash/get';

export default class ViewComponent {

    constructor() {
        this.views = {};
    }

    addFormViews(views) {
        this._addViews('form', views);
    }

    addListViews(views) {
        this._addViews('list', views);
    }

    _addViews(group, views) {
        this.views[group] = {
            ...this.views[group],
            ...views,
        };
    }

    getFormView(name) {
        return this._getView('form', name);
    }

    getListView(name) {
        return this._getView('list', name);
    }

    _getView(group, name) {
        const view = _get(this.views, group + '.' + name);
        if (!view) {
            throw new Error(`Not found ${group} view '${name}'`);
        }
        return view;
    }

}
