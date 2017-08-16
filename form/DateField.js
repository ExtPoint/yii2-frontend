import React from 'react';
import PropTypes from 'prop-types';
import _isString from 'lodash/isString';

import {locale, view} from 'components';

export default class DateField extends React.Component {

    static propTypes = {
        metaItem: PropTypes.object.isRequired,
        pickerProps: PropTypes.object,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        onChange: PropTypes.func,
        displayFormat: PropTypes.string,
        valueFormat: PropTypes.string,
    };

    static defaultProps = {
        displayFormat: 'DD.MM.YYYY',
        valueFormat: 'YYYY-MM-DD',
    };

    constructor() {
        super(...arguments);

        this._onChange = this._onChange.bind(this);
        this._onChangeRaw = this._onChangeRaw.bind(this);
    }

    render() {
        const {input, pickerProps, onChange, ...props} = this.props; // eslint-disable-line no-unused-vars
        const DateFieldView = this.props.view || view.getFormView('DateFieldView');
        let value = this.props.input.value || null;
        if (_isString(value)) {
            value = locale.moment(value, this.props.valueFormat);
        }

        return (
            <DateFieldView
                {...props}
                pickerProps={{
                    locale: locale.language,
                    peekNextMonth: true,
                    showYearDropdown: true,
                    scrollableYearDropdown: true,
                    selected: value,
                    dateFormat: this.props.displayFormat,
                    ...input,
                    onChange: this._onChange,
                    onChangeRaw: this._onChangeRaw,
                    ...pickerProps,
                }}
            />
        );
    }

    _onChange(momentDate) {
        const date = momentDate ? momentDate.format(this.props.valueFormat) : null;
        this.props.onChange && this.props.onChange({
            [this.props.input.name]: date,
        });
        return this.props.input.onChange(date);
    }

    _onChangeRaw(e) {
        const raw = e.target.value;
        const value = raw ? locale.moment(e.target.value, this.props.displayFormat).format(this.props.valueFormat) : null;
        this.props.onChange && this.props.onChange({
            [this.props.input.name]: value,
        });
        return this.props.input.onChange(value);
    }

}