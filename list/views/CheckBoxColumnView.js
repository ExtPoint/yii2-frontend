import React from 'react';
import PropTypes from 'prop-types';

import CheckboxField from '../../form/CheckboxField';

export default class CheckBoxColumnView extends React.Component {

    static propTypes = {
        isChecked: PropTypes.bool,
        isCheckedAll: PropTypes.bool,
        inHeader: PropTypes.bool,
        input: PropTypes.object,
    };

    render() {
        return (
            <CheckboxField
                input={this.props.input}
            />
        );
    }

}
