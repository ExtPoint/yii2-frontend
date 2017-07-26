import React from 'react';
import PropTypes from 'prop-types';

export default class GridWrapperView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        table: PropTypes.element,
        pagination: PropTypes.element,
        paginationSize: PropTypes.element,
        search: PropTypes.element,
    };

    render() {
        return (
            <div className={this.props.className}>
                {this.props.search}
                {this.props.paginationSize}
                {this.props.table}
                {this.props.pagination}
            </div>
        );
    }

}