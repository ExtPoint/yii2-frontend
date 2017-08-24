import React from 'react';
import PropTypes from 'prop-types';

import {view} from 'components';

export default class StringField extends React.Component {

    static propTypes = {
        metaItem: PropTypes.object.isRequired,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        readOnly: PropTypes.bool,
        securityLevel: PropTypes.bool,
        onChange: PropTypes.func,
    };

    constructor() {
        super(...arguments);

        this._onChange = this._onChange.bind(this);

        this.state = {
            level: '',
            error: '',
            readOnly: this.props.readOnly,
        };
    }

    render() {
        const {input, disabled, placeholder, ...props} = this.props;
        const StringFieldView = this.props.view || view.getFormView('StringFieldView');
        return (
            <StringFieldView
                {...props}
                inputProps={{
                    name: input.name,
                    type: 'text',
                    disabled,
                    readOnly: this.state.readOnly,
                    placeholder,
                    onChange: this._onChange,
                    value: input.value,
                    ...this.props.inputProps,
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
