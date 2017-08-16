import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {change} from 'redux-form';

import {types, view} from 'components';

class SwitcherField extends React.Component {

    static propTypes = {
        metaItem: PropTypes.object.isRequired,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        autoSelectFirst: PropTypes.bool,
        enumClassName: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
        ]),
    };

    static defaultProps = {
        autoSelectFirst: true,
    };

    componentWillMount() {
        if (this.props.autoSelectFirst) {
            const value = this.props.input.value;
            if (!value) {
                const keys = Object.keys(types.getEnumLabels(this.props.enumClassName || this.props.metaItem.enumClassName));
                if (keys.length > 0) {
                    this.props.dispatch(change(this.props.formId, this.props.input.name, keys[0]));
                }
            }
        }
    }

    render() {
        const items = types.getEnumLabels(this.props.enumClassName || this.props.metaItem.enumClassName);
        const {input, ...props} = this.props;
        const SwitcherFieldView = this.props.view || view.getFormView('SwitcherFieldView');
        return (
            <SwitcherFieldView
                {...props}
                items={Object.keys(items).map(key => ({
                    id: key,
                    label: items[key],
                    isSelected: input.value === key,
                    onClick: () => input.onChange(key),
                }))}
            />
        );
    }

}

export default connect()(SwitcherField);