import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {change} from 'redux-form';

import {types, view} from 'components';

class RadioField extends React.Component {

    static propTypes = {
        metaItem: PropTypes.object.isRequired,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        enumClassName: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
        ]),
    };

    componentWillMount() {
        if (!this.props.input.value) {
            const keys = Object.keys(this.getItems());
            if (keys.length > 0) {
                this.props.dispatch(change(this.props.formId, this.props.input.name, keys[0]));
            }
        }
    }

    getItems() {
        return types.getEnumLabels(this.props.enumClassName || this.props.metaItem.enumClassName);
    }

    render() {
        const items = this.getItems();
        const {input, ...props} = this.props;
        const RadioFieldView = view.getFormView('RadioFieldView');
        return (
            <RadioFieldView
                {...props}
                inputProps={{
                    type: 'radio',
                    name: input.name,
                }}
                items={Object.keys(items).map(key => ({
                    id: key,
                    isChecked: input.value === key,
                    label: items[key],
                    onSelect: () => input.onChange(key),
                }))}
            />
        );
    }

}

export default connect()(RadioField);