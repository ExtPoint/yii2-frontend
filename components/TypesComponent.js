import React from 'react';
import {Provider} from 'react-redux';
import domready from 'domready';
import {reduxForm} from 'redux-form';
import ReactDOM from 'react-dom';
import _isFunction from 'lodash/isFunction';
import _isArray from 'lodash/isArray';

export default class TypesComponent {

    constructor(store) {
        this.store = store || null;
        this.config = {};
        this.fields = null;
        this.metas = {};
        this.enums = {};
        this.fetchUrl = null;
        this.autoCompleteUrl = null;
        this.toRenderForm = [];
        this.toRenderField = [];

        domready(() => {
            this.toRenderForm.forEach(args => this.renderForm.apply(this, args));
            this.toRenderField.forEach(args => this.renderField.apply(this, args));
        });
    }

    addFieldComponents(fields) {
        this.fields = {
            ...this.fields,
            ...fields,
        };
    }

    getFieldComponent(name) {
        if (!this.fields[name]) {
            throw new Error(`Not found form field component '${name}'`);
        }
        return this.fields[name];
    }

    addModelMeta(modelClass, meta) {
        this.metas[modelClass] = meta;
    }

    /**
     * @param {object|string} metaClass
     * @return {object}
     */
    getModelMeta(metaClass) {
        if (_isFunction(metaClass)) {
            return metaClass.meta();
        }
        if (!this.metas[metaClass]) {
            throw new Error(`Not found model meta for '${metaClass}'`);
        }
        return this.metas[metaClass];
    }

    getMetaItem(metaClass, attribute) {
        return {
            appType: 'string',
            label: '',
            hint: '',
            required: false,
            ...this.getModelMeta(metaClass)[attribute],
        };
    }

    addEnum(enumClass, data) {
        this.enums[enumClass] = data;
    }

    getEnum(enumClass) {
        if (_isFunction(enumClass)) {
            return enumClass;
        }
        return this.enums[enumClass];
    }

    getEnumLabels(enumClass) {
        if (_isFunction(enumClass) && enumClass.getLabels) {
            return enumClass.getLabels();
        }

        if (!this.enums[enumClass]) {
            throw new Error(`Not found enum '${enumClass}'`);
        }

        return this.enums[enumClass].labels || {};
    }

    getEnumLabel(enumClass, id) {
        const labels = this.getEnumLabels(enumClass);
        if (_isArray(labels)) {
            const labelsItem = labels.find(item => item.id === id);
            return labelsItem ? labelsItem.label : '';
        } else {
            return labels[id] || '';
        }
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
