import React from 'react';
import PropTypes from 'prop-types';

import {form} from 'components';

export default class StringField extends React.Component {

    static propTypes = {
        metaItem: PropTypes.object.isRequired,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        readonly: PropTypes.bool,
        securityLevel: PropTypes.bool,
        onChange: PropTypes.func,
    };

    constructor() {
        super(...arguments);

        this._onChange = this._onChange.bind(this);

        this.state = {
            level: '',
            error: '',
            readonly: this.props.readonly,
        };
    }

    render() {
        const {input, disabled, placeholder, ...props} = this.props;
        const StringFieldView = form.getViewComponent('StringFieldView');
        return (
            <StringFieldView
                {...props}
                inputProps={{
                    name: input.name,
                    type: 'text',
                    disabled,
                    readOnly: this.state.readonly,
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
