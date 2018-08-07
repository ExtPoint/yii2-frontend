import React from 'react';
import {Provider} from 'react-redux';
import domready from 'domready';
import loadJs from 'load-js';
import ReactDOM from 'react-dom';
import _trimStart from 'lodash-es/trimStart';

export default class BackendWidgetComponent {

    constructor(store) {
        this.store = store || null;
        this.scripts = [];
        this.toRender = [];

        this._widgets = {};

        setTimeout(() => {
            loadJs(
                this.scripts.map(url => ({
                    url,
                    async: true,
                }))
            )
                .then(() => {
                    domready(() => {
                        this.toRender.forEach(args => this.render.apply(this, args));
                    });
                });
        });
    }

    register(name, func) {
        name = _trimStart(name, '\\');
        if (arguments.length === 1) {
            // Decorator
            return func => {
                this._widgets[name] = func;
            };
        } else {
            this._widgets[name] = func;
            return func;
        }
    }

    render(elementId, name, props) {
        if (process.env.NODE_ENV !== 'production') {
            window.__snapshot = (window.__snapshot || []).concat({
                widget: {
                    elementHtml: document.getElementById(elementId).innerHTML,
                    elementId,
                    name,
                    props,
                },
            });
        }

        const WidgetComponent = this._widgets[_trimStart(name, '\\')];
        ReactDOM.render(
            <Provider store={this.store}>
                <WidgetComponent {...props} />
            </Provider>,
            document.getElementById(elementId)
        );
    }

}
