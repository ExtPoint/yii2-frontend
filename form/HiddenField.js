import React from 'react';
import PropTypes from 'prop-types';

export default class HiddenField extends React.Component {

    static propTypes = {
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
    };
    render() {
        return (
            <input
                type='hidden'
                name={this.props.input.name}
                value={this.props.input.value}
            />
        );
    }

}
