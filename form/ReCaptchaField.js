import React from 'react';
import PropTypes from 'prop-types';

import {resource, form} from 'components';

export default class ReCaptchaField extends React.Component {

    static propTypes = {
        metaItem: PropTypes.object.isRequired,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
    };

    render() {
        const {input, ...props} = this.props;
        const ReCaptchaFieldView = form.getViewComponent('ReCaptchaFieldView');
        return (
            <ReCaptchaFieldView
                {...props}
                reCaptchaProps={{
                    sitekey: resource.googleCaptchaSiteKey,
                    onChange: value => input.onChange(value),
                }}
            />
        );
    }

}
