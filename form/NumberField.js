import React from 'react';
import PropTypes from 'prop-types';

import {types} from 'components';

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
    };

    static defaultProps = {
        placeholder: '',
        step: 1,
    };

    render() {
        const {disabled, placeholder, input, ...props} = this.props;
        const NumberFieldView = types.getViewComponent('NumberFieldView');
        return (
            <NumberFieldView
                {...props}
                inputProps={{
                    type: 'text',
                    disabled,
                    placeholder,
                    value: input.value,
                    onChange: e => input.onChange(e.target.value),
                }}
                onPlus={() => input.onChange(parseFloat(input.value || 0) + this.props.step)}
                onMinus={() => input.onChange(parseFloat(input.value || 0) - this.props.step)}
            />
        );
    }

}
