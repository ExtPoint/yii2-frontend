import React from 'react';
import PropTypes from 'prop-types';
import {FieldArray} from 'redux-form';
import _isBoolean from 'lodash/isBoolean';

import {types, view} from 'components';
import Field from './Field';

class FieldsListArrayComponent extends React.Component {

    static propTypes = {
        fields: PropTypes.shape({
            push: PropTypes.func,
            map: PropTypes.func,
            remove: PropTypes.func,
        }),
        columns: PropTypes.arrayOf(PropTypes.shape({
            attribute: PropTypes.string,
            prefix: PropTypes.string,
            model: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.func,
            ]),
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
            component: PropTypes.any,
        })),
        initialRowsCount: PropTypes.number,
        editable: PropTypes.bool,
    };

    static defaultProps = {
        initialRowsCount: 1,
        editable: true,
    };

    static contextTypes = {
        model: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
        ]),
    };

    componentWillMount() {
        if (this.props.fields.length === 0) {
            for (let i = 0; i < this.props.initialRowsCount; i++) {
                this.props.fields.push();
            }
        }
    }

    render() {
        const {fields, columns, ...props} = this.props;
        const FieldsListView = view.getFormView('FieldsListView');
        const errors = [].concat(this.props.meta && this.props.meta.error || []);

        return (
            <span>
                {fields.map(
                    (prefix, rowIndex) => columns.map(
                        (column, columnIndex) => this.renderPkField(column, prefix, rowIndex, columnIndex)
                    )
                )}
                <FieldsListView
                    {...props}
                    errorProps={errors.length === 0 ? null :{
                        error: errors.join(', ')
                    }}
                    rows={fields.map(prefix => ({
                        renderField: (column) => this.renderField(column, prefix),
                    }))}
                    columns={this.props.columns
                        .map(column => {
                            const metaItem = this.getItem(column);
                            if (metaItem.appType === 'primaryKey') {
                                return null;
                            }
                            const label = column.label || column.label === false || column.label === '' ? column.label : metaItem.label || '';

                            return {
                                ...column,
                                labelProps: label === false ? null : {
                                    label,
                                    hint:  column.hint || column.hint === false || column.hint === '' ? column.hint : metaItem.hint || '',
                                    required: _isBoolean(column.required) ? column.required : metaItem.required || false,
                                },
                            };
                        })
                        .filter(Boolean)
                    }
                    onAdd={() => fields.push()}
                    onRemove={index => fields.remove(index)}
                />
            </span>
        );
    }

    getItem(column) {
        return types.getMetaItem(column.model || this.context.model, column.attribute);
    }

    renderPkField(column, prefix, rowIndex, columnIndex) {
        const item = this.getItem(column);
        if (item.appType !== 'primaryKey') {
            return null;
        }

        if (column.prefix) {
            prefix = prefix + '.' + column.prefix;
        }

        return (
            <Field
                {...column}
                key={`${rowIndex}_${columnIndex}`}
                prefix={prefix}
                label={false}
                labelProps={null}
            />
        );
    }

    renderField(column, prefix) {
        const item = this.getItem(column);
        if (item.appType === 'primaryKey') {
            return null;
        }

        if (column.prefix) {
            prefix = prefix + '.' + column.prefix;
        }

        return (
            <Field
                {...column}
                prefix={prefix}
                label={false}
                labelProps={null}
            />
        );
    }
}

export default class FieldsList extends React.Component {

    static propTypes = {
        attribute: PropTypes.string.isRequired,
        model: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
        ]),
        columns: PropTypes.arrayOf(PropTypes.shape({
            attribute: PropTypes.string,
            prefix: PropTypes.string,
            model: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.func,
            ]),
            component: PropTypes.any,
        })),
    };

    static contextTypes = {
        formId: PropTypes.string.isRequired,
        prefix: PropTypes.string,
    };

    static childContextTypes = {
        model: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
        ]),
        prefix: PropTypes.string,
    };

    getChildContext() {
        return {
            model: this.props.model,
            prefix: '',
        };
    }

    render() {
        const name = (this.context.prefix ? this.context.prefix + '.' : '') + this.props.attribute;
        return (
            <FieldArray
                {...this.props}
                name={name}
                component={FieldsListArrayComponent}
                columns={this.props.columns}
                formId={this.context.formId}
            />
        );
    }

}