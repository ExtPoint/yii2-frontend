import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import FieldWrapper from './FieldWrapper';

const bem = html.bem('PhoneFieldView');

export default class PhoneFieldView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        inputProps: PropTypes.object,
        onEdit: PropTypes.func,
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
                <div className={bem(bem.element('container'), 'input-group')}>
                    <div className='input-group-addon'>
                        <span className='glyphicon glyphicon-phone' />
                    </div>
                    <input
                        {...this.props.inputProps}
                        className={bem(bem.element('input'), 'form-control')}
                    />
                    {this.props.readonly && (
                        <span
                            className={bem.element('icon-readonly')}
                            onClick={this.props.onEdit}
                        />
                    )}
                </div>
            </FieldWrapper>
        );
    }

}
