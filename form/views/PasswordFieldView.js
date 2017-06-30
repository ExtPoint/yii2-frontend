import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import FieldWrapper from './FieldWrapper';

const bem = html.bem('PasswordFieldView');

export default class PasswordFieldView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        inputProps: PropTypes.object,
        isShowSecurity: PropTypes.bool,
        securityLevel: PropTypes.string,
        securityMessage: PropTypes.string,
        onShowPassword: PropTypes.func,
        onHidePassword: PropTypes.func,
    };

    render() {
        return (
            <FieldWrapper
                {...this.props}
                className={bem(
                    bem.block(),
                    bem.block(this.props.securityLevel),
                    bem.block({error: !!this.props.securityMessage}),
                    this.props.className,
                )}
            >
                <div
                    className={bem(
                        bem.element('container'),
                        this.props.currency && 'input-group',
                    )}
                >
                    <input
                        {...this.props.inputProps}
                        className={bem(bem.element('input'), 'form-control')}
                    />
                    {this.props.isShowSecurity && (
                        <div className={bem.element('security-level')}>
                            <div className={bem.element('security-level-bar')}/>
                            <div className={bem.element('security-level-error')}>
                                {this.props.securityMessage}
                            </div>
                        </div>
                    )}
                    <div
                        className={bem.element('icon-eye')}
                        onMouseDown={this.props.onShowPassword}
                        onMouseUp={this.props.onHidePassword}
                    >
                        <span className='glyphicon glyphicon-eye-open'/>
                    </div>
                </div>
            </FieldWrapper>
        );
    }

}
