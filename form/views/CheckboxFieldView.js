import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import FieldWrapper from './FieldWrapper';

const bem = html.bem('CheckboxFieldView');

export default class CheckboxFieldView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        inputProps: PropTypes.object,
        labelProps: PropTypes.object,
    };

    render() {
        return (
            <FieldWrapper
                {...this.props}
                labelProps={null}
                className={bem(
                    bem.block(),
                    this.props.className,
                    'checkbox',
                )}
            >
                <div className={bem.element('container')}>
                    <label>
                        <input
                            {...this.props.inputProps}
                            className={bem.element('input')}
                        />
                        {this.props.labelProps.label}
                    </label>
                </div>
            </FieldWrapper>
        );
    }

}
