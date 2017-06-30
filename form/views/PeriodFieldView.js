import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import FieldWrapper from './FieldWrapper';
import DateField from '../DateField';

const bem = html.bem('PeriodFieldView');

export default class PeriodFieldView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        fromPickerProps: PropTypes.object,
        toPickerProps: PropTypes.object,
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
                    <DateField {...this.props.fromPickerProps}/>
                    <span className={bem.element('separator')}>
                        -
                    </span>
                    <DateField {...this.props.toPickerProps}/>
                </div>
            </FieldWrapper>
        );
    }

}
