import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Field as ReduxField, Fields as ReduxFields} from 'redux-form';
import _isBoolean from 'lodash/isBoolean';
import _isArray from 'lodash/isArray';
import _isObject from 'lodash/isObject';
import _get from 'lodash/get';

import {form} from 'components';

class Input extends React.Component {

    static propTypes = {
        component: PropTypes.func,
        attributesMap: PropTypes.object,
        input: PropTypes.object,
    };

    render() {
        const {component, ...props} = this.props;
        const FieldComponent = component;

        const values = {};
        if (this.props.input) {
            values[this.props.input.name] = this.props.input.value;
        } else {
            Object.keys(this.props.attributesMap).forEach(attribute => {
                const name = this.props.attributesMap[attribute];
                values[name] = _get(this.props, name).input.value;
            });
        }
        return (
            <span>
                {Object.keys(values).map(name => this.renderHiddenInput(name, values[name]))}
                <FieldComponent
                    {...props}
                />
            </span>
        );
    }

    renderHiddenInput(name, value) {
        if (_isArray(value)) {
            return value.map((valueItem, index) => (
                <span key={index}>
                    {this.renderHiddenInput(name + '[]', valueItem)}
                </span>
            ));
        }

        return (
            <input
                key={name}
                type='hidden'
                name={name.replace(/\.([^\.]+)/g, '[$1]')}
                value={value}
            />
        );
    }

}

class Field extends React.Component {

    static propTypes = {
        attribute: PropTypes.string.isRequired,
        formId: PropTypes.string,
        modelMeta: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
        ]),
        prefix: PropTypes.string,
        layout: PropTypes.string,
        layoutCols: PropTypes.arrayOf(PropTypes.number),
        component: PropTypes.element,
        label: PropTypes.string,
        hint: PropTypes.string,
        required: PropTypes.bool,
    };

    static contextTypes = {
        formId: PropTypes.string,
        modelMeta: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
        ]),
        prefix: PropTypes.string,
        layout: PropTypes.string,
        layoutCols: PropTypes.arrayOf(PropTypes.number),
    };

    static defaultProps = {
        prefix: '',
    };

    render() {
        // Get params
        const {attribute, formId, modelMeta, prefix, component, label, hint, required, layout, layoutCols, ...props} = this.props;
        props.attribute = attribute;
        props.layout = layout || this.context.layout;
        props.layoutCols = layoutCols || this.context.layoutCols;

        // Form id
        const finedFormId = formId || this.context.formId;
        if (!finedFormId) {
            throw new Error(`Not found required param 'formId' for attribute '${attribute}'`);
        }
        props.formId = finedFormId;

        // Model meta
        const finedModelMeta = modelMeta || this.context.modelMeta;
        if (!finedModelMeta) {
            throw new Error(`Not found modelMeta for attribute '${attribute}'`);
        }
        props.modelClass = _isObject(finedModelMeta) ? finedModelMeta.className : finedModelMeta;

        // Get meta item
        const metaItem = form.getMetaItem(finedModelMeta, attribute);
        props.metaItem = metaItem;

        // Get input field config
        const fieldConfig = form.getFieldConfig(metaItem.appType);

        // Get input component
        props.component = component || form.getFieldComponent(fieldConfig.component || 'StringField');
        delete fieldConfig.component;

        // Get prefix
        let fullPrefix = [this.context.prefix, prefix].filter(Boolean).join('.');
        if (fullPrefix) {
            fullPrefix += '.';
            props.prefix = fullPrefix;
        }

        // Get label, hint, required
        let resultLabel = label || label === false ? label : metaItem.label || '';
        let resultHint = hint || hint === false ? hint : metaItem.hint || '';
        let resultRequired = _isBoolean(required) ? required : metaItem.required || false;
        props.labelProps = {
            label: resultLabel,
            hint: resultHint,
            required: resultRequired,
            layout: props.layout,
            layoutCols: props.layoutCols,
        };
        props.hintProps = {
            hint: resultHint,
            layout: props.layout,
            layoutCols: props.layoutCols,
        };

        // Generate unique field id
        props.fieldId = `${props.formId}_${props.attribute}`;

        // Set error
        // TODO
        props.errorProps = {};

        // Render redux field component
        if (fieldConfig.refAttributeOptions.length > 0) {
            const names = [fullPrefix + attribute];
            props.attributesMap = {
                [attribute]: fullPrefix + attribute,
            };
            fieldConfig.refAttributeOptions.forEach(key => {
                const refAttribute = metaItem[key];
                const name = fullPrefix + refAttribute;

                props.attributesMap[refAttribute] = name;
                names.push(name);
            });

            return (
                <ReduxFields
                    names={names}
                    component={Input}
                    props={{
                        ...props,
                        ...fieldConfig,
                    }}
                />
            );
        } else {
            return (
                <ReduxField
                    name={fullPrefix + attribute}
                    component={Input}
                    props={{
                        ...props,
                        ...fieldConfig,
                    }}
                />
            );
        }
    }

}

const FieldHoc = connect()(Field);

export default class FieldHocWrapper extends React.Component {

    static contextTypes = {
        formId: PropTypes.string,
    };


    render() {
        return (
            <FieldHoc
                {...this.props}
                formId={this.props.formId || this.context.formId}
            />
        );
    }
}
