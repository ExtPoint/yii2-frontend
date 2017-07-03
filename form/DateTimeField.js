import React from 'react';
import PropTypes from 'prop-types';
import _isString from 'lodash/isString';
import _range from 'lodash/range';
import _padStart from 'lodash/padStart';
import _keyBy from 'lodash/keyBy';

import {types, locale} from 'components';

export default class DateTimeField extends React.Component {

    static propTypes = {
        pickerProps: PropTypes.object,
        metaItem: PropTypes.object.isRequired,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        displayFormat: PropTypes.string,
        valueFormat: PropTypes.string,
    };

    static defaultProps = {
        displayFormat: 'DD.MM.YYYY HH:mm',
        valueFormat: 'YYYY-MM-DD HH:mm',
    };

    // The 'x' string is a fix object as array optimization -> wrong keys sort
    static hours = _keyBy(_range(24).map(n => _padStart(n, 2, '0')), v => 'x' + v);
    static minutes = _keyBy(_range(4).map(n => _padStart(n * 15, 2, '0')), v => 'x' + v);

    constructor() {
        super(...arguments);

        this._onChangeHours = this._onChangeHours.bind(this);
        this._onChangeMinutes = this._onChangeMinutes.bind(this);
        this._onChangeDate = this._onChangeDate.bind(this);
        this._onChangeDateRaw = this._onChangeDateRaw.bind(this);
    }

    render() {
        const {fieldId, metaItem, input, ...props} = this.props; // eslint-disable-line no-unused-vars
        const DateTimeFieldView = types.getViewComponent('DateTimeFieldView');

        const hour = this.getDate('HH');
        const minute = this.getDate('mm');

        return (
            <DateTimeFieldView
                {...props}
                dateProps={{
                    metaItem,
                    layout: 'inline',
                    input: {
                        name: '',
                        value: this.getDate(this.props.valueFormat),
                        onChange: this._onChangeDate,
                    },
                    pickerProps: {
                        dateFormat: this.props.displayFormat,
                        onChangeRaw: this._onChangeDateRaw,
                    }
                }}
                hoursProps={{
                    metaItem,
                    fieldId: `${fieldId}_hours`,
                    layout: 'inline',
                    input: {
                        name: '',
                        value: hour ? 'x' + hour : null,
                        onChange: this._onChangeHours,
                    },
                    placeholder: 'ЧЧ',
                    items: DateTimeField.hours,
                }}
                minutesProps={{
                    metaItem,
                    fieldId: `${fieldId}_minutes`,
                    layout: 'inline',
                    input: {
                        name: '',
                        value: minute ? 'x' + minute : null,
                        onChange: this._onChangeMinutes,
                    },
                    placeholder: 'ММ',
                    items: DateTimeField.minutes,
                }}
            />
        );
    }

    getDate(format) {
        let value = this.props.input.value || null;
        if (_isString(value)) {
            value = locale.moment(value, this.props.valueFormat);
        }

        if (value && format) {
            return value.format(format);
        }
        return value;
    }

    _onChangeHours(hour) {
        const prevDate = this.getDate();
        const momentDate = prevDate || locale.moment();
        momentDate.hour(hour.substr(1));
        momentDate.minute(prevDate ? prevDate.minute() : '00');
        this._onChange(momentDate);
    }

    _onChangeMinutes(minute) {
        const prevDate = this.getDate();
        const momentDate = prevDate || locale.moment();
        if (momentDate) {
            momentDate.hour(prevDate ? prevDate.hour() : '00');
            momentDate.minute(minute.substr(1));
        }
        this._onChange(momentDate);
    }

    _onChangeDate(date) {
        const prevDate = this.getDate();
        const nextDate = date ? locale.moment(date, this.props.valueFormat) : null;
        nextDate.hour(prevDate ? prevDate.hour() : 0);
        nextDate.minute(prevDate ? prevDate.minute() : 0);
        this._onChange(nextDate);
    }

    _onChangeDateRaw(e) {
        let value = locale.moment(e.target.value, this.props.displayFormat);
        this._onChange(value);
    }

    _onChange(momentDate) {
        const date = momentDate ? momentDate.format(this.props.valueFormat) : null;
        this.props.onChange && this.props.onChange({
            [this.props.input.name]: date,
        });
        return this.props.input.onChange(date);

    }


}
