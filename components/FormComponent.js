import React from 'react';
import { Provider} from 'react-redux';
import {reduxForm} from 'redux-form';
import ReactDOM from 'react-dom';
import _isObject from 'lodash/isObject';

export default class FormComponent {

    constructor(store) {
        this.store = store || null;
        this.config = {};
        this.fields = null;
        this.views = {};
        this.metas = {};
        this.enums = {};
        this.fetchUrl = null;
        this.autoCompleteUrl = null;
    }

    addFieldComponents(fields) {
        if (!this.fields) {
            this.fields = require('../form/index').default;
        }
        this.fields = {
            ...this.fields,
            ...fields,
        };
    }

    getFieldComponent(name) {
        if (!this.fields) {
            this.fields = require('../form/index').default;
        }
        if (!this.fields[name]) {
            throw new Error(`Not found form field component '${name}'`);
        }
        return this.fields[name];
    }

    addViewComponents(views) {
        this.views = {
            ...this.views,
            ...views,
        };
    }

    getViewComponent(name) {
        if (!this.views[name]) {
            throw new Error(`Not found form field view '${name}'`);
        }
        return this.views[name];
    }

    addModelMeta(modelClass, meta) {
        this.metas[modelClass] = meta;
    }

    /**
     * @param {object|string} metaClass
     * @return {object}
     */
    getModelMeta(metaClass) {
        if (_isObject(metaClass)) {
            return metaClass.meta();
        }
        if (!this.metas[metaClass]) {
            throw new Error(`Not found model meta for '${metaClass}'`);
        }
        return this.metas[metaClass];
    }

    getMetaItem(metaClass, attribute) {
        const meta = this.getModelMeta(metaClass);
        const metaItem = meta[attribute];
        if (!metaItem) {
            const metaClassName = _isObject(metaClass) ? metaClass.constructor.name : metaClass;
            throw new Error(`Not found meta item for attribute '${attribute}', model '${metaClassName}'`);
        }

        return metaItem;
    }

    addEnum(enumClass, data) {
        this.enums[enumClass] = data;
    }

    getEnumLabels(enumClass) {
        if (_isObject(enumClass) && enumClass.getLabels) {
            return enumClass.getLabels();
        }

        if (!this.enums[enumClass]) {
            throw new Error(`Not found enum '${enumClass}'`);
        }

        return this.enums[enumClass].labels || {};
    }

    /**
     * @param {string} appType
     * @return {object}
     */
    getFieldConfig(appType) {
        appType = appType || 'string';

        return {
            component: '',
            refAttributeOptions: [],
            ...(this.config[appType] && this.config[appType].field || {}),
        };
    }

    renderForm(elementId, props) {
        this._render(elementId, require('../form/Form').default, props);
    }

    renderField(elementId, props) {
        const FieldComponent = require('../form/Field').default;
        const FieldComponentHoc = reduxForm({
            form: props.formId,
        })(FieldComponent);

        this._render(elementId, FieldComponentHoc, props);
    }

    _render(elementId, Component, props) {
        ReactDOM.render(
            <Provider store={this.store}>
                <Component {...props} />
            </Provider>,
            document.getElementById(elementId)
        );
    }

}
