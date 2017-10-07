import React from 'react';
import PropTypes from 'prop-types';

import {html, view} from 'components';
import {fetch} from 'actions/list';

const bem = html.bem('GridView');

export default class GridWrapper extends React.Component {

    static propTypes = {
        id: PropTypes.string.isRequired,
        wrapperView: PropTypes.func,
        wrapperViewProps: PropTypes.object,
        tableView: PropTypes.func,
        tableViewProps: PropTypes.object,
        items: PropTypes.array,
        empty: PropTypes.element,
        pagination: PropTypes.element,
        paginationSize: PropTypes.element,
        search: PropTypes.element,
    };

    render() {
        const WrapperComponent = this.props.wrapperView || view.getListView('GridWrapperView');
        return (
            <WrapperComponent
                className={bem.block()}
                {...this.props.wrapperViewProps}
                table={this.renderTable()}
                pagination={this.props.pagination}
                paginationSize={this.props.paginationSize}
                search={this.props.search}
            />
        );
    }

    renderTable() {
        const headerColumns = this.props.columns.filter(Boolean).map(column => {
            const HeaderComponent = column.headerComponent;
            return {
                ...column,
                title: HeaderComponent
                    ? (
                        <HeaderComponent
                            inHeader
                            listId={this.props.id}
                        />
                    )
                    : column.title,
                    direction: this.props.list.sort && this.props.list.sort[column.attribute] || null,
                onSortAsc: () => this.setSort(column.attribute, 'asc', ),
                onSortDesc: () => this.setSort(column.attribute, 'desc', ),
            };
        });
        if (this.props.actions) {
            headerColumns.push({});
        }

        const GridTableView = this.props.tableView || view.getListView('GridTableView');
        return (
            <GridTableView
                {...this.props.tableViewProps}
                headerColumns={headerColumns}
                items={this.props.items}
                empty={this.props.empty}
            />
        );
    }

    setSort(attribute, direction) {
        this.props.dispatch(fetch(this.props.id, {
            sort: {
                [attribute]: direction,
            }
        }));
    }

}
