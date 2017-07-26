import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {getList} from '../reducers/list';
import ListView from './ListView';
import GridEmpty from './parts/GridEmpty';
import GridRow from './parts/GridRow';
import GridWrapper from './parts/GridWrapper';

@connect(
    (state, props) => ({
        list: getList(state, props.id),
    })
)
export default class GridView extends React.Component {

    static propTypes = {
        id: PropTypes.string.isRequired,
        method: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
        ]),
        primaryKey: PropTypes.string,
        loadMore: PropTypes.bool,
        pageSize: PropTypes.number,
        sort: PropTypes.object,
        query: PropTypes.object,
        items: PropTypes.array,
        list: PropTypes.shape({
            isFetched: PropTypes.bool,
            isLoading: PropTypes.bool,
            hasPagination: PropTypes.bool,
            total: PropTypes.number,
            meta: PropTypes.object,
            page: PropTypes.number,
            pageSize: PropTypes.number,
            sort: PropTypes.object,
            query: PropTypes.object,
            items: PropTypes.array,
        }),
        search: PropTypes.shape({
            model: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.func,
            ]),
            columnsCount: PropTypes.number,
            fields: PropTypes.arrayOf(PropTypes.shape({
                attribute: PropTypes.string,
            }))
        }),
        disableCache: PropTypes.bool,
        itemsOrder: PropTypes.string,
        itemComponent: PropTypes.func,
        itemComponentProps: PropTypes.object,
        wrapperView: PropTypes.func,
        wrapperViewProps: PropTypes.object,
        loadingView: PropTypes.func,
        loadingViewProps: PropTypes.object,
        emptyView: PropTypes.func,
        emptyViewProps: PropTypes.object,
        searchView: PropTypes.func,
        searchViewProps: PropTypes.object,
        paginationView: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.bool,
        ]),
        paginationViewProps: PropTypes.object,
        paginationSizeView: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.bool,
        ]),
        paginationSizeViewProps: PropTypes.object,
        columns: PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.shape({
                title: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.element
                ]),
                textCenter: PropTypes.bool,
                hint: PropTypes.string,
                attribute: PropTypes.string,
                sortable: PropTypes.bool,
                headerComponent: PropTypes.func,
                valueComponent: PropTypes.func,
                valueComponentProps: PropTypes.object,
            }),
        ])),
        actions: PropTypes.object,
        tableView: PropTypes.func,
        tableViewProps: PropTypes.object,
    };

    static defaultProps = {
        columns: [],
    };

    render() {
        const {columns, actions, tableView, tableViewProps, ...props} = this.props; // eslint-disable-line no-unused-vars
        return (
            <ListView
                ref='list'
                wrapperView={GridWrapper}
                wrapperViewProps={this.props}
                emptyView={GridEmpty}
                emptyViewProps={this.props}
                itemComponent={GridRow}
                itemComponentProps={this.props}
                {...props}
            />
        );
    }
}
