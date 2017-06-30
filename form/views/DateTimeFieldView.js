import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import FieldWrapper from './FieldWrapper';
import DateField from '../DateField';
import DropDownField from '../DropDownField';

const bem = html.bem('DateTimeFieldView');

export default class DateTimeFieldView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        dateProps: PropTypes.object,
        hoursProps: PropTypes.object,
        minutesProps: PropTypes.object,
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
                <DateField
                    {...this.props.dateProps}
                    className={bem.element('date')}
                />
                <DropDownField
                    {...this.props.hoursProps}
                    className={bem.element('hours')}
                />
                <DropDownField
                    {...this.props.minutesProps}
                    className={bem.element('minutes')}
                />
            </FieldWrapper>
        );
    }

}
