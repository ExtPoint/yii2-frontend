import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import FieldWrapper from './FieldWrapper';

const bem = html.bem('TextAreaFieldView');

export default class TextAreaFieldView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        inputProps: PropTypes.object,
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
                <textarea
                    {...this.props.inputProps}
                    className={bem(bem.element('input'), 'form-control')}
                />
            </FieldWrapper>
        );
    }

}
