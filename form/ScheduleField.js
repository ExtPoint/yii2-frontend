import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash-es/get';
import _uniq from 'lodash-es/uniq';
import _range from 'lodash-es/range';
import _padStart from 'lodash-es/padStart';

import {view, locale} from 'components';

export default class ScheduleField extends React.Component {

    static propTypes = {
        metaItem: PropTypes.object.isRequired,
        attributesMap: PropTypes.object,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
    };

    static hours = _range(24).map(n => _padStart(n, 2, '0'));
    static minutes = _range(4).map(n => _padStart(n * 15, 2, '0'));

    render() {
        const daysInput = _get(this.props, this.props.attributesMap[this.props.attribute]).input;
        const timeSinceInput = _get(this.props, this.props.attributesMap[this.props.metaItem.sinceTimeAttribute]).input;
        const timeTillInput = _get(this.props, this.props.attributesMap[this.props.metaItem.tillTimeAttribute]).input;

        const weekDays = [locale.t('Пн'), locale.t('Вт'), locale.t('Ср'), locale.t('Чт'), locale.t('Пт'), locale.t('Сб'), locale.t('Вс')];
        const selectedDays = (daysInput.value || '').split(',').filter(Boolean).map(v => parseInt(v));

        const {fieldId, metaItem, ...props} = this.props;
        const ScheduleFieldView = this.props.view || view.getFormView('ScheduleFieldView');

        const extractTimeFromDateTime = dateTimeString => {
            if (!dateTimeString) {
                return '';
            }

            return dateTimeString.indexOf(' ') !== -1
                ? dateTimeString.split(' ')[1]
                : dateTimeString;
        };

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
                    timeSinceInput.onChange('00:00');
                    timeTillInput.onChange('00:00');
                }}
                onEverydayClick={() => daysInput.onChange('1,2,3,4,5,6,7')}
                sinceHourProps={{
                    metaItem,
                    autoSelectFirst: true,
                    placeholder: '',
                    fieldId: `${fieldId}_sinceHour`,
                    input: {
                        ...timeSinceInput,
                        value: extractTimeFromDateTime(timeSinceInput.value).split(':')[0] || '00',
                        onChange: v => this.setPartTime(0, v, this.props.metaItem.sinceTimeAttribute),
                    },
                    items: ScheduleField.hours,
                }}
                sinceMinuteProps={{
                    metaItem,
                    autoSelectFirst: true,
                    placeholder: '',
                    fieldId: `${fieldId}_sinceMinute`,
                    input: {
                        ...timeSinceInput,
                        value: extractTimeFromDateTime(timeSinceInput.value).split(':')[1] || '00',
                        onChange: v => this.setPartTime(1, v, this.props.metaItem.sinceTimeAttribute),
                    },
                    items: ScheduleField.minutes,
                }}
                tillHourProps={{
                    metaItem,
                    autoSelectFirst: true,
                    placeholder: '',
                    fieldId: `${fieldId}_tillHour`,
                    input: {
                        ...timeTillInput,
                        value: extractTimeFromDateTime(timeTillInput.value).split(':')[0] || '00',
                        onChange: v => this.setPartTime(0, v, this.props.metaItem.tillTimeAttribute),
                    },
                    items: ScheduleField.hours,
                }}
                tillMinuteProps={{
                    metaItem,
                    autoSelectFirst: true,
                    placeholder: '',
                    fieldId: `${fieldId}_tillMinute`,
                    input: {
                        ...timeTillInput,
                        value: extractTimeFromDateTime(timeTillInput.value).split(':')[1] || '00',
                        onChange: v => this.setPartTime(1, v, this.props.metaItem.tillTimeAttribute),
                    },
                    items: ScheduleField.minutes,
                }}
            />
        );
    }

    selectDay(dayNumber) {
        const daysInput = _get(this.props, this.props.attributesMap[this.props.attribute]).input;
        const value = (daysInput.value || '').split(',').filter(Boolean).map(v => parseInt(v));
        const index = value.indexOf(dayNumber);
        if (index !== -1) {
            value.splice(index, 1);
        } else {
            value.push(dayNumber);
        }

        daysInput.onChange(_uniq(value.sort()).join(','));
    }

    setPartTime(index, partValue, timeAttribute) {
        const timeInput = _get(this.props, this.props.attributesMap[timeAttribute]).input;
        const defaultTime = ['00', '00', '00'];

        let existingValue = (timeInput.value || '').split(':') || defaultTime;

        existingValue[0] = existingValue[0] || defaultTime[0];
        existingValue[1] = existingValue[1] || defaultTime[1];
        existingValue[2] = existingValue[2] || defaultTime[2];

        existingValue[index] = partValue;

        timeInput.onChange(existingValue.join(':'));
    }

}
