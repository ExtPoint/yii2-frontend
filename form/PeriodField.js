import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import {locale, view} from 'components';

export default class PeriodField extends React.Component {

    static propTypes = {
        metaItem: PropTypes.object.isRequired,
        attributesMap: PropTypes.object,
    };

    render() {
        const fromInput = _get(this.props, this.props.attributesMap[this.props.attribute]).input;
        const toInput = _get(this.props, this.props.attributesMap[this.props.metaItem.refAttribute]).input;
        const {metaItem, ...props} = this.props;
        const PeriodFieldView = this.props.view || view.getFormView('PeriodFieldView');
        return (
            <PeriodFieldView
                {...props}
                fromPickerProps={{
                    input: fromInput,
                    metaItem,
                    pickerProps: {
                        selectsStart: true,
                        maxDate: toInput.value ? locale.moment(toInput.value) : null,
                        startDate: fromInput.value ? locale.moment(fromInput.value) : null,
                        endDate: toInput.value ? locale.moment(toInput.value) : null,
                    }
                }}
                toPickerProps={{
                    input: toInput,
                    metaItem,
                    pickerProps: {
                        selectsEnd: true,
                        minDate: fromInput.value ? locale.moment(fromInput.value) : null,
                        startDate: fromInput.value ? locale.moment(fromInput.value) : null,
                        endDate: toInput.value ? locale.moment(toInput.value) : null,
                    }
                }}
            />
        );
    }

}
