import React from 'react';
import PropTypes from 'prop-types';

export default class ListWrapperView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        itemsOrder: PropTypes.oneOf(['asc', 'desc']),
        search: PropTypes.element,
        items: PropTypes.array,
        pagination: PropTypes.element,
        paginationSize: PropTypes.element,
        empty: PropTypes.element,
    };

    render() {
        if (this.props.itemsOrder.toLowerCase() === 'desc') {
            return (
                <div className={this.props.className}>
                    {this.props.search}
                    {this.props.paginationSize}
                    {this.props.items}
                    {this.props.pagination}
                    {this.props.empty}
                </div>
            );
        } else {
            return (
                <div className={this.props.className}>
                    {this.props.search}
                    {this.props.paginationSize}
                    {this.props.pagination}
                    {this.props.items}
                    {this.props.empty}
                </div>
            );
        }
    }

}