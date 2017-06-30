import React from 'react';
import PropTypes from 'prop-types';
import ReCaptcha from 'react-google-recaptcha';

import {html} from 'components';
import FieldWrapper from './FieldWrapper';

const bem = html.bem('ReCaptchaFieldView');

export default class ReCaptchaFieldView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        reCaptchaProps: PropTypes.object,
    };

    render() {
        return (
            <FieldWrapper
                {...this.props}
                className={bem(
                    bem.block(),
                    this.props.className,
                )}
            >
                <div className={bem.element('container')}>
                    <ReCaptcha
                        {...this.props.reCaptchaProps}
                        className={bem.element('captcha')}
                    />
                </div>
            </FieldWrapper>
        );
    }

}
