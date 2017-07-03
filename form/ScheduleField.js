import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import _uniq from 'lodash/uniq';
import _range from 'lodash/range';
import _pad from 'lodash/pad';

import {types} from 'components';

export default class ScheduleField extends React.Component {

    static propTypes = {
        metaItem: PropTypes.object.isRequired,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        refNames: PropTypes.shape({
            sinceTimeAttribute: PropTypes.string,
            tillTimeAttribute: PropTypes.string,
        }),
    };

    static hours = _range(24).map(n => _pad(n, 2, '0'));
    static minutes = _range(60).map(n => _pad(n, 2, '0'));

    render() {
        const daysInput = _get(this.props, this.props.name).input;
        const timeSinceInput = _get(this.props, this.props.refNames.sinceTimeAttribute).input;
        const timeTillInput = _get(this.props, this.props.refNames.tillTimeAttribute).input;

        const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const selectedDays = (daysInput.value || '').split(',').filter(Boolean).map(v => parseInt(v));

        const {fieldId, ...props} = this.props;
        const ScheduleFieldView = types.getViewComponent('ScheduleFieldView');
        return (
            <ScheduleFieldView
                {...props}
                weekDays={weekDays.map((label, index) => ({
                    index,
                    label,
                    isSelected: selectedDays.indexOf(index + 1) !== -1,
                    onClick: () => this.selectDay(index + 1),
                }))}
                onAllTimeClick={() => {
                    timeSinceInput.onChange('0:0');
                    timeTillInput.onChange('23:59');
                }}
                onEverydayClick={() => daysInput.onChange('1,2,3,4,5,6,7')}
                sinceHourProps={{
                    placeholder: '',
                    fieldId: `${fieldId}_sinceHour`,
                    input: {
                        ...timeSinceInput,
                        value: (timeSinceInput.value || '').split(':')[0] || '00',
                        onChange: v => this.setSincePartTime(0, v),
                    },
                    items: ScheduleField.hours,
                }}
                sinceMinuteProps={{
                    placeholder: '',
                    fieldId: `${fieldId}_sinceMinute`,
                    input: {
                        ...timeSinceInput,
                        value: (timeSinceInput.value || '').split(':')[1] || '00',
                        onChange: v => this.setSincePartTime(1, v),
                    },
                    items: ScheduleField.minutes,
                }}
                tillHourProps={{
                    placeholder: '',
                    fieldId: `${fieldId}_tillHour`,
                    input: {
                        ...timeTillInput,
                        value: (timeTillInput.value || '').split(':')[0] || '00',
                        onChange: v => this.setTillPartTime(0, v),
                    },
                    items: ScheduleField.hours,
                }}
                tillMinuteProps={{
                    placeholder: '',
                    fieldId: `${fieldId}_tillMinute`,
                    input: {
                        ...timeTillInput,
                        value: (timeTillInput.value || '').split(':')[1] || '00',
                        onChange: v => this.setTillPartTime(1, v),
                    },
                    items: ScheduleField.minutes,
                }}
            />
        );
    }

    selectDay(dayNumber) {
        const daysInput = _get(this.props, this.props.name).input;
        const value = (daysInput.value || '').split(',').filter(Boolean).map(v => parseInt(v));
        const index = value.indexOf(dayNumber);
        if (index !== -1) {
            value.splice(index, 1);
        } else {
            value.push(dayNumber);
        }

        daysInput.onChange(_uniq(value.sort()).join(','));
    }

    setSincePartTime(index, partValue) {
        const timeSinceInput = _get(this.props, this.props.refNames.sinceTimeAttribute).input;
        const value = (timeSinceInput.value || '').split(':') || ['00', '00'];
        value[index] = partValue;
        timeSinceInput.onChange(value.join(':'));
    }

    setTillPartTime(index, partValue) {
        const timeTillInput = _get(this.props, this.props.refNames.tillTimeAttribute).input;
        const value = (timeTillInput.value || '').split(':') || ['00', '00'];
        value[index] = partValue;
        timeTillInput.onChange(value.join(':'));
    }

}
