import React from 'react';
import PropTypes from 'prop-types';

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

        this.state = {
            selected: this.props.input.value
                ? locale.moment(this.props.input.value, this.props.valueFormat)
                : null,
        };

        this._onChange = this._onChange.bind(this);
        this._onChangeRaw = this._onChangeRaw.bind(this);
    }

    render() {
        const {pickerProps, onChange, ...props} = this.props; // eslint-disable-line no-unused-vars
        const DateFieldView = this.props.view || view.getFormView('DateFieldView');

        return (
            <DateFieldView
                {...props}
                pickerProps={{
                    locale: locale.language,
                    peekNextMonth: true,
                    showYearDropdown: true,
                    scrollableYearDropdown: true,
                    selected: this.state.selected,
                    dateFormat: this.props.displayFormat,
                    input: {
                        ...this.props.input,
                        value: undefined,
                    },
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
        this.setState({selected: momentDate});
        return this.props.input.onChange(date);
    }

    _onChangeRaw(e) {
        const rawValue = e.target.value;
        const value = rawValue ? locale.moment(rawValue, this.props.displayFormat).format(this.props.valueFormat) : null;

        if (value === rawValue) {
            this.props.onChange && this.props.onChange({
                [this.props.input.name]: value,
            });
            this.setState({selected: locale.moment(value, this.props.valueFormat)});
        }
        return this.props.input.onChange(rawValue);
    }

}