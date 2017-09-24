import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import _isFunction from 'lodash/isFunction';
import _get from 'lodash/get';
import _merge from 'lodash/merge';

import {view} from 'components';
import Search from './parts/Search';
import {init, fetch, remove} from 'actions/list';
import {getList} from '../reducers/list';

@connect(
    (state, props) => ({
        list: getList(state, props.id),
    })
)
export default class ListView extends React.Component {

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
        itemComponent: PropTypes.func.isRequired,
        itemComponentProps: PropTypes.object,
        wrapperView: PropTypes.func,
        wrapperViewProps: PropTypes.object,
        loadingView: PropTypes.func,
        loadingViewProps: PropTypes.object,
        emptyText: PropTypes.string,
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
    };

    static defaultProps = {
        primaryKey: 'id',
        pageSize: 50,
        loadMore: false,
        disableCache: false,
        itemsOrder: 'desc',
    };

    constructor() {
        super(...arguments);

        this.setPage = this.setPage.bind(this);
        this.setPageSize = this.setPageSize.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(init(
            this.props.id,
            {
                method: _isFunction(this.props.method) ? this.props.method() : this.props.method,
                pageSize: this.props.pageSize,
                sort: this.props.sort || (this.props.list ? this.props.list.sort : null),
                query: this.props.list ? _merge(this.props.list.query, this.props.query) : this.props.query,
                items: this.props.items,
                page: this.getCurrentPage(),
                loadMore: this.props.loadMore,
                primaryKey: this.props.primaryKey,
            }
        ));

        if (!this.props.list || !this.props.list.isFetched || this.props.disableCache) {
            this.setPage(this.getCurrentPage());
        }
    }

    componentWillUnmount() {
        this.props.dispatch(remove(this.props.id));
    }

    getCurrentPage() {
        // TODO get page from route
        return this.props.list ? this.props.list.page : 1;
    }

    render() {
        if (!this.props.list || !this.props.list.isFetched) {
            return null;
        }

        let items = this.props.list.items || [];
        if (this.props.itemsOrder.toLowerCase() !== 'desc') {
            items = [].concat(items).reverse();
        }

        const LoadingView = this.props.loadingView || view.getListView('LoadingView');
        const WrapperView = this.props.wrapperView || view.getListView('ListWrapperView');
        return (
            <LoadingView
                {...this.props.loadingViewProps}
                isLoading={this.props.list.isLoading}
            >
                <WrapperView
                    {...this.props.wrapperViewProps}
                    itemsOrder={this.props.itemsOrder}
                    search={this.renderSearch()}
                    items={items.map((entry, index) => this.renderItem(entry, index))}
                    pagination={items.length > 0 && this.props.list.hasPagination ? this.renderPagination() : null}
                    paginationSize={items.length > 0 && this.props.list.hasPagination ? this.renderPaginationSize() : null}
                    empty={!this.props.list.isLoading && items.length === 0 ? this.renderEmpty() : null}
                />
            </LoadingView>
        );
    }

    renderSearch() {
        if (this.props.search) {
            return (
                <Search {...this.props}/>
            );
        }
        return null;
    }

    renderPagination() {
        if (this.props.paginationView === false) {
            return null;
        }

        const PaginationView = this.props.paginationView || view.getListView(this.props.loadMore ? 'PaginationMoreView' : 'PaginationView');
        return (
            <PaginationView
                {...this.props.paginationViewProps}
                currentPage={this.getCurrentPage()}
                totalPages={Math.ceil(this.props.list.total / this.props.list.pageSize)}
                onSelect={this.setPage}
            />
        );
    }

    renderPaginationSize() {
        if (this.props.paginationSizeView === false) {
            return null;
        }

        const PaginationSizeView = this.props.paginationSizeView || view.getListView('PaginationSizeView');
        return (
            <PaginationSizeView
                {...this.props.paginationSizeViewProps}
                currentSize={this.props.list.pageSize}
                onSelect={this.setPageSize}
            />
        );
    }

    renderEmpty() {
        const EmptyView = this.props.emptyView || view.getListView('EmptyView');
        return (
            <EmptyView
                {...this.props.emptyViewProps}
                text={this.props.emptyText}
            />
        );
    }

    renderItem(item, index) {
        const ItemComponent = this.props.itemComponent;
        return (
            <ItemComponent
                {...this.props.itemComponentProps}
                key={_get(item, this.props.primaryKey) || index}
                item={item}
                index={index}
            />
        );
    }

    setPage(page) {
        this.props.dispatch(fetch(this.props.id, {page}));
    }

    setPageSize(pageSize) {
        this.props.dispatch(fetch(this.props.id, {pageSize}));
    }

}