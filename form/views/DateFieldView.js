import React from 'react';
import PropTypes from 'prop-types';
import ReactDatePicker from 'react-datepicker';

import {html} from 'components';
import FieldWrapper from './FieldWrapper';

const bem = html.bem('DateFieldView');

export default class DateFieldView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        pickerProps: PropTypes.object,
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
                        <span className='glyphicon glyphicon-calendar' />
                    </div>
                    <ReactDatePicker
                        {...this.props.pickerProps}
                        className={bem(bem.element('input'), 'form-control')}
                    />
                </div>
            </FieldWrapper>
        );
    }

}