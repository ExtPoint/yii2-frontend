import React from 'react';
import PropTypes from 'prop-types';

export default class FieldSet extends React.Component {

    static propTypes = {
        modelMeta: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
        ]),
        prefix: PropTypes.prefix,
        layout: PropTypes.string,
        layoutCols: PropTypes.arrayOf(PropTypes.number),
    };

    static childContextTypes = {
        modelMeta: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
        ]),
        prefix: PropTypes.string,
        layout: PropTypes.string,
        layoutCols: PropTypes.arrayOf(PropTypes.number),
    };

    getChildContext() {
        return {
            modelMeta: this.props.modelMeta,
            prefix: (this.context.prefix || '') + (this.props.prefix || ''),
            layout: this.context.layout || this.props.layout,
            layoutCols: this.context.layoutCols || this.props.layoutCols,
        };
    }

    render() {
        return (
            <span>
                {this.props.children}
            </span>
        );
    }

}
