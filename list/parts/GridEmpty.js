import React from 'react';
import PropTypes from 'prop-types';

import {view} from 'components';

export default class GridEmpty extends React.Component {

    static propTypes = {
        columns: PropTypes.array,
        emptyText: PropTypes.string,
        emptyView: PropTypes.func,
        emptyViewProps: PropTypes.object,
    };

    render() {
        const GridRowView = this.props.itemComponent || view.getListView('GridRowView');
        const EmptyView = this.props.emptyView || view.getListView('EmptyView');
        return (
            <GridRowView
                colSpan={this.props.columns.filter(Boolean).length}
                rowColumns={[
                    {
                        value: (
                            <EmptyView
                                text={this.props.emptyText}
                                {...this.props.emptyViewProps}
                            />
                        )
                    }
                ]}
            />
        );
    }

}

