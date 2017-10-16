import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import {view} from 'components';

export default class GridRow extends React.Component {

    static propTypes = {
        listId: PropTypes.string,
        itemId: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
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
                    itemId={this.props.itemId}
                    listId={this.props.listId}
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