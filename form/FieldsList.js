import React from 'react';
import PropTypes from 'prop-types';
import {FieldArray} from 'redux-form';

import {types} from 'components';
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
            model: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.func,
            ]),
            label: PropTypes.string,
            hint: PropTypes.string,
            component: PropTypes.any,
        })),
    };

    static contextTypes = {
        model: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
        ]),
    };

    componentWillMount() {
        if (this.props.fields.length === 0) {
            this.props.fields.push();
        }
    }

    render() {
        const {fields, columns, ...props} = this.props;
        const FieldsListView = types.getViewComponent('FieldsListView');
        return (
            <span>
                {fields.map(
                    (prefix, rowIndex) => columns.map(
                        (column, columnIndex) => this.renderPkField(column, prefix, rowIndex, columnIndex)
                    )
                )}
                <FieldsListView
                    {...props}
                    rows={fields.map(prefix => ({
                        renderField: (column) => this.renderField(column, prefix),
                    }))}
                    columns={this.columns.map(column => {
                        const metaItem = this.getItem(column);
                        return {
                            label: column.label || metaItem.label,
                            hint: column.hint || metaItem.hint,
                            required: metaItem.required,
                        };
                    })}
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

        return (
            <Field
                {...column}
                key={`${rowIndex}_${columnIndex}`}
                prefix={prefix}
                label={null}
            />
        );
    }

    renderField(column, prefix) {
        const item = this.getItem(column);
        if (item.appType === 'primaryKey') {
            return null;
        }

        return (
            <Field
                {...column}
                prefix={prefix}
                label={null}
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
                name={name}
                component={FieldsListArrayComponent}
                columns={this.props.columns}
                formId={this.context.formId}
            />
        );
    }

}