import React from 'react';
import PropTypes from 'prop-types';
import _isString from 'lodash/isString';
import _isNumber from 'lodash/isNumber';
import _isNaN from 'lodash/isNaN';

import {view} from 'components';

export default class NumberField extends React.Component {

    static propTypes = {
        metaItem: PropTypes.object.isRequired,
        placeholder: PropTypes.string,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        showButtons: PropTypes.bool,
        step: PropTypes.number,
        min: PropTypes.number,
        max: PropTypes.number,
    };

    static defaultProps = {
        placeholder: '',
        step: 1,
    };

    render() {
        const {disabled, placeholder, input, ...props} = this.props;
        const NumberFieldView = this.props.view || view.getFormView('NumberFieldView');
        return (
            <NumberFieldView
                {...props}
                inputProps={{
                    type: 'text',
                    disabled,
                    placeholder,
                    value: input.value,
                    onChange: e => this.onChange(e.target.value),
                }}
                onPlus={() => this.onChange(parseFloat(input.value || 0) + this.props.step)}
                onMinus={() => this.onChange(parseFloat(input.value || 0) - this.props.step)}
            />
        );
    }

    onChange(value) {
        value = value || '';
        if (_isString(value)) {
            value = value.replace(/[^0-9,.-]/, '');
        }
        value = parseFloat(value || 0);
        if (!_isNumber(value) || isNaN(value)) {
            value = 0;
        }
        if (_isNumber(this.props.min)) {
            value = Math.max(this.props.min, value);
        }
        if (_isNumber(this.props.max)) {
            value = Math.min(this.props.max, value);
        }

        this.props.input.onChange(value);
    }

}
