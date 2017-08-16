import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {change} from 'redux-form';

import {view} from 'components';

class CheckboxField extends React.Component {

    static propTypes = {
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        disabled: PropTypes.bool,
    };

    constructor() {
        super(...arguments);

        this._onClick = this._onClick.bind(this);
    }

    componentWillMount() {
        if (!this.props.input.value) {
            this.props.dispatch(change(this.props.formId, this.props.input.name, false));
        }
    }

    render() {
        const {input, disabled, labelProps, ...props} = this.props;
        const CheckboxFieldView = this.props.view || view.getFormView('CheckboxFieldView');
        return (
            <CheckboxFieldView
                {...props}
                labelProps={labelProps}
                inputProps={{
                    name: input.name,
                    type: 'checkbox',
                    checked: !!input.value,
                    disabled,
                    onChange: this._onClick,
                }}
            />
        );
    }

    _onClick() {
        if (!this.props.disabled) {
            this.props.input.onChange(!this.props.input.value);
        }
    }

}

export default connect()(CheckboxField);