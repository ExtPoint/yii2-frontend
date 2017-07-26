import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import _isFunction from 'lodash/isFunction';

import {view} from 'components';
import Controls from 'shared/tooltip/Controls';

export default class GridRow extends React.Component {

    static propTypes = {
        itemComponent: PropTypes.func,
        itemComponentProps: PropTypes.object,
    };

    static defaultActions = {
        edit: {
            icon: 'edit',
        },
        copy: {
            icon: 'copy',
            confirm: 'Создать копию?',
        },
        remove: {
            icon: 'remove',
            confirm: 'Удалить запись?',
        },
    };

    render() {
        const rowColumns = this.props.columns.filter(Boolean).map((column, index) => ({
            ...column,
            value: this.renderValue(column, index),
        }));

        if (this.props.actions) {
            const actions = Object.keys(this.props.actions).map(key => {
                const action = this.props.actions[key];
                return {
                    ...GridRow.defaultActions[key],
                    ...(_isFunction(action) ? {onClick: action} : action),
                    componentProps: _isFunction(action.componentProps) ? action.componentProps(this.props.item) : action.componentProps,
                };
            });
            rowColumns.push({
                value: (
                    <Controls
                        items={actions}
                        handlerProps={this.props.item}
                    />
                ),
            });
        }

        const GridRowView = this.props.itemComponent || view.getListView('GridRowView');
        return (
            <GridRowView
                {...this.props.itemComponentProps}
                rowColumns={rowColumns}
            />
        );
    }

    renderValue(column, cellIndex) {
        if (column.valueComponent) {
            const ValueComponent = column.valueComponent;
            return (
                <ValueComponent
                    attribute={column.attribute}
                    item={this.props.item}
                    column={column}
                    rowIndex={this.props.index}
                    cellIndex={cellIndex}
                    {...column.valueComponentProps}
                />
            );
        }

        if (column.attribute) {
            return _get(this.props.item, column.attribute) || '';
        }

        return '';
    }


}