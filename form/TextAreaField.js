import React from 'react';
import PropTypes from 'prop-types';

import {view} from 'components';

export default class TextAreaField extends React.Component {

    static propTypes = {
        metaItem: PropTypes.object.isRequired,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        inputProps: PropTypes.object,
    };

    render() {
        const {input, placeholder, ...props} = this.props;
        const TextAreaFieldView = this.props.view || view.getFormView('TextAreaFieldView');
        return (
            <TextAreaFieldView
                {...props}
                inputProps={{
                    placeholder,
                    ...this.props.inputProps,
                    value: input.value,
                    onChange: e => input.onChange(e.target.value),
                }}
            />
        );
    }

}
