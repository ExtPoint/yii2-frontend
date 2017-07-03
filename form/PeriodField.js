import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import {locale, types} from 'components';

export default class PeriodField extends React.Component {

    static propTypes = {
        metaItem: PropTypes.object.isRequired,
        refNames: PropTypes.shape({
            refAttribute: PropTypes.string,
        }),
    };

    render() {
        const fromInput = _get(this.props, this.props.name).input;
        const toInput = _get(this.props, this.props.refNames.refAttribute).input;
        const {metaItem, ...props} = this.props;
        const PeriodFieldView = types.getViewComponent('PeriodFieldView');
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
