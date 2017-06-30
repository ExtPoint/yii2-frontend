import React from 'react';
import PropTypes from 'prop-types';

import {form} from 'components';

export default class PhoneField extends React.Component {

    static propTypes = {
        metaItem: PropTypes.object.isRequired,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        readOnly: PropTypes.bool,
        onChange: PropTypes.func,
    };

    constructor() {
        super(...arguments);

        this._onChange = this._onChange.bind(this);

        this.state = {
            readOnly: this.props.readOnly,
        };
    }

    render() {
        const {input, disabled, placeholder, ...props} = this.props;
        const PhoneFieldView = form.getViewComponent('PhoneFieldView');
        return (
            <PhoneFieldView
                {...props}
                inputProps={{
                    name: input.name,
                    type: 'tel',
                    disabled,
                    readOnly: this.state.readOnly,
                    placeholder,
                    onChange: this._onChange,
                    value: input.value,
                }}
                onEdit={() => this.setState({readOnly: false})}
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
