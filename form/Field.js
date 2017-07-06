import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Field as ReduxField, Fields as ReduxFields} from 'redux-form';
import _isBoolean from 'lodash/isBoolean';
import _isArray from 'lodash/isArray';
import _isObject from 'lodash/isObject';
import _get from 'lodash/get';

import {types} from 'components';

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
        let errors = [];
        if (this.props.input) {
            values[this.props.input.name] = this.props.input.value;

            // Set error
            if (this.props.meta.touched) {
                errors = errors.concat(this.props.meta.error || []);
            }
        } else {
            Object.keys(this.props.attributesMap).forEach(attribute => {
                const name = this.props.attributesMap[attribute];
                const fieldProps = _get(this.props, name);
                values[name] = fieldProps.input.value;

                // Set error
                if (fieldProps.meta.touched) {
                    errors = errors.concat(fieldProps.meta.error || []);
                }
            });
        }

        if (errors.length > 0) {
            props.errorProps = {
                error: errors.join(', ')
            };
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
        model: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
        ]),
        prefix: PropTypes.string,
        layout: PropTypes.string,
        layoutCols: PropTypes.arrayOf(PropTypes.number),
        component: PropTypes.func,
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
            PropTypes.element,
        ]),
        hint: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
            PropTypes.element,
        ]),
        required: PropTypes.bool,
    };

    static contextTypes = {
        formId: PropTypes.string,
        model: PropTypes.oneOfType([
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
        const {attribute, formId, model, prefix, component, label, hint, required, layout, layoutCols, ...props} = this.props;
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
        const finedModelMeta = model || this.context.model;
        if (!finedModelMeta) {
            throw new Error(`Not found model for attribute '${attribute}'`);
        }
        props.model = finedModelMeta;
        props.modelClass = _isObject(finedModelMeta) ? finedModelMeta.className : finedModelMeta;

        // Get meta item
        const metaItem = types.getMetaItem(finedModelMeta, attribute);
        props.metaItem = metaItem;

        // Get input field config
        const fieldConfig = types.getFieldConfig(metaItem.appType);

        // Get input component
        props.component = component || types.getFieldComponent(fieldConfig.component || 'StringField');
        delete fieldConfig.component;

        // Get prefix
        let fullPrefix = [this.context.prefix, prefix].filter(Boolean).join('.');
        if (fullPrefix) {
            fullPrefix += '.';
            props.prefix = fullPrefix;
        }

        // Get label, hint, required
        let resultLabel = label || label === false || label === '' ? label : metaItem.label || '';
        let resultHint = hint || hint === false || hint === '' ? hint : metaItem.hint || '';
        let resultRequired = _isBoolean(required) ? required : metaItem.required || false;
        if (resultLabel !== false) {
            props.labelProps = {
                label: resultLabel,
                hint: resultHint,
                required: resultRequired,
                layout: props.layout,
                layoutCols: props.layoutCols,
            };
        }
        if (resultHint !== false) {
            props.hintProps = {
                hint: resultHint,
                layout: props.layout,
                layoutCols: props.layoutCols,
            };
        }

        // Generate unique field id
        props.fieldId = `${props.formId}_${props.attribute}`;

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
