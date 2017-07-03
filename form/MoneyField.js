import React from 'react';
import PropTypes from 'prop-types';

import {types} from 'components';

export default class MoneyField extends React.Component {

    static propTypes = {
        metaItem: PropTypes.object.isRequired,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
    };

    constructor() {
        super(...arguments);

        this._onChange = this._onChange.bind(this);
    }

    render() {
        const {input, disabled, placeholder, ...props} = this.props;
        const MoneyFieldView = types.getViewComponent('MoneyFieldView');
        return (
            <MoneyFieldView
                {...props}
                inputProps={{
                    name: input.name,
                    type: 'text',
                    disabled,
                    placeholder,
                    onChange: this._onChange,
                    value: input.value,
                }}
                currency={this.props.metaItem.currency}
            />
        );
    }

    _onChange(e) {
        const value = e.target.value;

        this.props.input.onChange(value);
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

}
