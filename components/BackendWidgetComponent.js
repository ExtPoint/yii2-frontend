import React from 'react';
import {Provider} from 'react-redux';
import ReactDOM from 'react-dom';
import _trimStart from 'lodash/trimStart';

export default class BackendWidgetComponent {

    constructor(store) {
        this.store = store || null;
        this._widgets = {};
    }

    register(name, func) {
        this._widgets[_trimStart(name, '\\')] = func;
        return func;
    }

    render(elementId, name, props) {
        const WidgetComponent = this._widgets[_trimStart(name, '\\')];
        ReactDOM.render(
            <Provider store={this.store}>
                <WidgetComponent {...props} />
            </Provider>,
            document.getElementById(elementId)
        );
    }

}
